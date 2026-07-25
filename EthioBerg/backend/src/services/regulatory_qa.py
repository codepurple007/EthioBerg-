from __future__ import annotations

import re
from pathlib import Path
from typing import Callable

from src.domain.models import (
    GuardrailSettings,
    RegulatoryAskRequest,
    RegulatoryAskResponse,
    RegulatoryCitation,
    RetrievalSettings,
)
from src.services.retrieval.corpus import load_corpus
from src.services.retrieval.hybrid import HybridRetriever, RetrievalHit, rerank_hits
from src.services.retrieval.pinecone_store import PineconeConfig, PineconeStore

ConfigProvider = Callable[[], tuple[RetrievalSettings, GuardrailSettings]]

ABSTENTION_MESSAGE = (
    "Insufficient official evidence was found in the active ECMA/ESX corpus to answer this question "
    "confidently. Please refine the question, adjust filters, or consult the cited source documents directly."
)

MIN_RRF_SCORE = 0.012
MIN_BM25_SCORE = 0.35
MIN_DENSE_SCORE = 0.12
MIN_PINECONE_SCORE = 0.45


def _normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().lower()


def _has_sufficient_evidence(
    hit: RetrievalHit, *, use_pinecone: bool, min_dense_score: float = MIN_PINECONE_SCORE
) -> bool:
    if hit.article_boost > 0:
        return True
    if use_pinecone:
        return hit.dense_score >= min_dense_score
    if hit.bm25_score >= MIN_BM25_SCORE:
        return True
    return hit.dense_score >= MIN_DENSE_SCORE


def _compose_answer(question: str, hits: list[RetrievalHit]) -> str:
    lead = hits[0].chunk
    supporting = hits[1:3]
    sentences = [lead.text.strip()]
    if supporting:
        extra = " ".join(hit.chunk.text.strip() for hit in supporting)
        sentences.append(extra)
    answer = " ".join(sentences)
    if len(answer) > 900:
        answer = answer[:897] + "..."
    segment_note = f" Selected segment context: {lead.segment}." if lead.segment else ""
    return (
        f"Based on the retrieved official provisions, {answer}"
        f"{segment_note} This response summarizes the cited sources and is not legal advice."
    )


def _verify_citations(hits: list[RetrievalHit]) -> tuple[bool, list[RegulatoryCitation]]:
    citations: list[RegulatoryCitation] = []
    for hit in hits:
        full_text = hit.chunk.text.strip()
        if not full_text:
            return False, []
        quote = full_text if len(full_text) <= 280 else full_text[:277] + "..."
        citations.append(
            RegulatoryCitation(
                id=f"cite-{hit.chunk.chunk_id}",
                sourceId=hit.chunk.source_id,
                sourceTitle=hit.chunk.source_title,
                section=hit.chunk.section,
                page=hit.chunk.page,
                chunkId=hit.chunk.chunk_id,
                quote=quote,
            )
        )
    return True, citations


class RegulatoryQAService:
    def __init__(
        self,
        corpus_path: Path,
        pinecone: PineconeStore | None = None,
        source_count: int = 0,
        config_provider: ConfigProvider | None = None,
    ):
        self.use_pinecone = pinecone is not None
        self.pinecone = pinecone
        self.source_count = source_count
        self.chunks = load_corpus(corpus_path)
        self.retriever = HybridRetriever(self.chunks)
        self.config_provider = config_provider

    def active_config(self) -> tuple[RetrievalSettings, GuardrailSettings]:
        if self.config_provider:
            return self.config_provider()
        return RetrievalSettings(), GuardrailSettings()

    def pinecone_active(self, settings: RetrievalSettings | None = None) -> bool:
        """Whether the hosted index serves this request, given the admin's backend choice."""
        if not (self.use_pinecone and self.pinecone):
            return False
        resolved = settings or self.active_config()[0]
        return resolved.retrieval_backend in ("auto", "pinecone")

    def retrieve(self, payload: RegulatoryAskRequest) -> list[RetrievalHit]:
        settings, _ = self.active_config()
        if self.pinecone_active(settings) and self.pinecone:
            hits = self.pinecone.retrieve(
                payload.question,
                segment=payload.segment,
                language=payload.language,
                as_of=payload.effective_as_of,
                top_k=max(settings.candidate_pool, settings.top_k),
            )
            if settings.rerank_enabled:
                hits = rerank_hits(payload.question, hits, settings.rerank_top_n)
            return hits[: settings.top_k]
        return self.retriever.retrieve(
            payload.question,
            segment=payload.segment,
            language=payload.language,
            as_of=payload.effective_as_of,
            top_k=settings.top_k,
            rrf_k=settings.rrf_k,
            bm25_weight=settings.bm25_weight,
            dense_weight=settings.dense_weight,
            article_boost_weight=settings.article_boost,
            candidate_pool=settings.candidate_pool,
            rerank_enabled=settings.rerank_enabled,
            rerank_top_n=settings.rerank_top_n,
        )

    def _retrieve(self, payload: RegulatoryAskRequest) -> list[RetrievalHit]:
        return self.retrieve(payload)

    def ask(self, payload: RegulatoryAskRequest) -> RegulatoryAskResponse:
        settings, guardrails = self.active_config()
        use_pinecone = self.pinecone_active(settings)
        hits = self._retrieve(payload)

        limitations: list[str] = []
        if payload.language == "am":
            limitations.append(
                "Machine translation or paraphrase may not be the legally authoritative text; inspect original-language evidence."
            )

        # Dense similarity scores sit on a much higher scale than fused RRF scores, so the
        # hosted-index floor stays in force and the configured value can only tighten it.
        min_score = (
            max(settings.min_score, MIN_PINECONE_SCORE) if use_pinecone else settings.min_score
        )
        retrieval_trace = [
            {
                "chunkId": hit.chunk.chunk_id,
                "rrfScore": round(hit.rrf_score, 4),
                "bm25Score": round(hit.bm25_score, 4),
                "denseScore": round(hit.dense_score, 4),
                "articleBoost": hit.article_boost,
            }
            for hit in hits
        ]

        weak_evidence = (
            guardrails.abstain_on_low_confidence
            and not _has_sufficient_evidence(
                hits[0], use_pinecone=use_pinecone, min_dense_score=min_score
            )
            if hits
            else True
        )

        if not hits or hits[0].rrf_score < min_score or weak_evidence:
            return RegulatoryAskResponse(
                question=payload.question,
                answer=None,
                status="ABSTAINED",
                citations=[],
                limitations=[ABSTENTION_MESSAGE, *limitations],
                retrievalTrace=retrieval_trace,
                verificationStatus="ABSTAINED",
            )

        answer = _compose_answer(payload.question, hits[:3])
        verified, citations = _verify_citations(hits[:3])
        citations_insufficient = (
            guardrails.require_citation_for_answer
            and len(citations) < max(1, guardrails.min_citation_count)
        )
        if not verified or citations_insufficient:
            return RegulatoryAskResponse(
                question=payload.question,
                answer=None,
                status="ABSTAINED",
                citations=[],
                limitations=["Citation verification failed.", ABSTENTION_MESSAGE, *limitations],
                retrievalTrace=retrieval_trace,
                verificationStatus="FAILED",
            )

        return RegulatoryAskResponse(
            question=payload.question,
            answer=answer,
            status="ANSWERED",
            citations=citations,
            limitations=[
                "This is an information and education response, not investment advice or a compliance certification.",
                *limitations,
            ],
            retrievalTrace=retrieval_trace,
            verificationStatus="PASSED",
        )

    def retrieval_mode(self) -> str:
        settings, _ = self.active_config()
        if self.pinecone_active(settings):
            base = "Pinecone dense vector search"
        else:
            base = "BM25 + TF-IDF cosine + weighted RRF"
        mode = f"{base} + lexical rerank" if settings.rerank_enabled else base
        if settings.retrieval_backend == "pinecone" and not self.use_pinecone:
            return f"{mode} (hosted index unavailable — using the in-process retriever)"
        return mode

    def corpus_stats(self) -> dict[str, int | str]:
        if self.pinecone_active() and self.pinecone:
            stats = self.pinecone.describe_stats()
            stats["sourceCount"] = self.source_count or len({chunk.source_id for chunk in self.chunks})
            stats["retrievalMode"] = self.retrieval_mode()
            return stats
        return {
            "chunkCount": len(self.chunks),
            "sourceCount": len({chunk.source_id for chunk in self.chunks}),
            "retrievalMode": self.retrieval_mode(),
        }

    @classmethod
    def from_env(
        cls,
        corpus_path: Path,
        source_count: int = 0,
        config_provider: ConfigProvider | None = None,
    ) -> RegulatoryQAService:
        config = PineconeConfig.from_env()
        pinecone = PineconeStore(config) if config else None
        return cls(
            corpus_path,
            pinecone=pinecone,
            source_count=source_count,
            config_provider=config_provider,
        )
