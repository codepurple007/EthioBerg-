from __future__ import annotations

import re
from dataclasses import dataclass, replace
from datetime import date

from src.domain.enums import MarketSegment
from src.services.retrieval.bm25_index import BM25Index
from src.services.retrieval.corpus import RegulatoryChunk, extract_article_reference
from src.services.retrieval.dense_index import DenseTfidfIndex


@dataclass
class RetrievalHit:
    chunk: RegulatoryChunk
    bm25_score: float
    dense_score: float
    rrf_score: float
    article_boost: float
    reranked: bool = False


def _tokenize(value: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9]+", value.lower()) if len(token) > 2}


def rerank_hits(query: str, hits: list[RetrievalHit], top_n: int) -> list[RetrievalHit]:
    """Rescore the top candidates by query-term coverage over chunk text and section.

    Acts as a lightweight stand-in for a cross-encoder: it reads the full candidate
    text rather than relying on the bag-of-words ranking signals alone.
    """
    query_terms = _tokenize(query)
    if not query_terms or not hits:
        return hits

    head, tail = hits[:top_n], hits[top_n:]
    rescored: list[RetrievalHit] = []
    for hit in head:
        text_terms = _tokenize(hit.chunk.text)
        section_terms = _tokenize(hit.chunk.section)
        coverage = len(query_terms & text_terms) / len(query_terms)
        section_match = len(query_terms & section_terms) / len(query_terms)
        adjusted = hit.rrf_score * (1.0 + 0.6 * coverage + 0.4 * section_match)
        rescored.append(replace(hit, rrf_score=adjusted, reranked=True))

    rescored.sort(key=lambda hit: hit.rrf_score, reverse=True)
    return rescored + tail


class HybridRetriever:
    def __init__(self, chunks: list[RegulatoryChunk], rrf_k: int = 60):
        self.chunks = chunks
        self.bm25 = BM25Index(chunks)
        self.dense = DenseTfidfIndex(chunks)
        self.rrf_k = rrf_k

    def _eligible(
        self,
        chunk: RegulatoryChunk,
        *,
        segment: MarketSegment | None,
        language: str | None,
        as_of: date,
    ) -> bool:
        if segment and chunk.segment and chunk.segment != segment:
            return False
        if language and chunk.language != language:
            return False
        if date.fromisoformat(chunk.effective_from) > as_of:
            return False
        if chunk.effective_to and date.fromisoformat(chunk.effective_to) < as_of:
            return False
        return True

    def retrieve(
        self,
        query: str,
        *,
        segment: MarketSegment | None = None,
        language: str | None = None,
        as_of: date | None = None,
        top_k: int = 5,
        rrf_k: int | None = None,
        bm25_weight: float = 1.0,
        dense_weight: float = 1.0,
        article_boost_weight: float = 0.5,
        candidate_pool: int | None = None,
        rerank_enabled: bool = False,
        rerank_top_n: int = 10,
    ) -> list[RetrievalHit]:
        evaluation_date = as_of or date.today()
        article_ref = extract_article_reference(query)
        fusion_k = rrf_k if rrf_k is not None else self.rrf_k

        bm25_scores = self.bm25.score(query)
        dense_scores = self.dense.score(query)

        bm25_rank = {
            idx: rank + 1
            for rank, (idx, score) in enumerate(
                sorted(bm25_scores, key=lambda item: item[1], reverse=True)
            )
            if score > 0
        }
        dense_rank = {
            idx: rank + 1
            for rank, (idx, score) in enumerate(
                sorted(dense_scores, key=lambda item: item[1], reverse=True)
            )
            if score > 0
        }

        hits: list[RetrievalHit] = []
        for idx, chunk in enumerate(self.chunks):
            if not self._eligible(chunk, segment=segment, language=language, as_of=evaluation_date):
                continue

            rrf = 0.0
            if idx in bm25_rank:
                rrf += bm25_weight / (fusion_k + bm25_rank[idx])
            if idx in dense_rank:
                rrf += dense_weight / (fusion_k + dense_rank[idx])

            article_boost = 0.0
            if article_ref and article_ref in chunk.section.lower():
                article_boost = article_boost_weight
                rrf += article_boost

            if rrf <= 0:
                continue

            hits.append(
                RetrievalHit(
                    chunk=chunk,
                    bm25_score=bm25_scores[idx][1],
                    dense_score=dense_scores[idx][1],
                    rrf_score=rrf,
                    article_boost=article_boost,
                )
            )

        hits.sort(key=lambda hit: hit.rrf_score, reverse=True)
        if candidate_pool:
            hits = hits[:candidate_pool]
        if rerank_enabled:
            hits = rerank_hits(query, hits, rerank_top_n)
        return hits[:top_k]
