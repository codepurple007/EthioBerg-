from __future__ import annotations

import re

from src.domain.models import RegulatoryAskRequest, RegulatoryAskResponse, RegulatoryCitation
from src.services.retrieval.corpus import load_corpus
from src.services.retrieval.hybrid import HybridRetriever, RetrievalHit

ABSTENTION_MESSAGE = (
    "Insufficient official evidence was found in the active ECMA/ESX corpus to answer this question "
    "confidently. Please refine the question, adjust filters, or consult the cited source documents directly."
)

MIN_RRF_SCORE = 0.012
MIN_BM25_SCORE = 0.35
MIN_DENSE_SCORE = 0.12


def _normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().lower()


def _has_sufficient_evidence(hit: RetrievalHit) -> bool:
    if hit.article_boost > 0:
        return True
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
        quote = hit.chunk.text.strip()
        if len(quote) > 280:
            quote = quote[:277] + "..."
        if _normalize_whitespace(quote) not in _normalize_whitespace(hit.chunk.text):
            return False, []
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
    def __init__(self, corpus_path):
        self.chunks = load_corpus(corpus_path)
        self.retriever = HybridRetriever(self.chunks)

    def ask(self, payload: RegulatoryAskRequest) -> RegulatoryAskResponse:
        hits = self.retriever.retrieve(
            payload.question,
            segment=payload.segment,
            language=payload.language,
            as_of=payload.effective_as_of,
            top_k=5,
        )

        limitations: list[str] = []
        if payload.language == "am":
            limitations.append(
                "Machine translation or paraphrase may not be the legally authoritative text; inspect original-language evidence."
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

        if not hits or hits[0].rrf_score < MIN_RRF_SCORE or not _has_sufficient_evidence(hits[0]):
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
        if not verified or not citations:
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

    def corpus_stats(self) -> dict[str, int | str]:
        return {
            "chunkCount": len(self.chunks),
            "sourceCount": len({chunk.source_id for chunk in self.chunks}),
            "retrievalMode": "BM25 + TF-IDF cosine + RRF",
        }
