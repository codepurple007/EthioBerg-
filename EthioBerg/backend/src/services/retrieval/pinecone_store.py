from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

from pinecone import Pinecone

from src.domain.enums import MarketSegment
from src.services.retrieval.corpus import RegulatoryChunk, extract_article_reference
from src.services.retrieval.hybrid import RetrievalHit


@dataclass
class PineconeConfig:
    api_key: str
    index_name: str
    namespace: str = "regulatory"

    @classmethod
    def from_env(cls) -> PineconeConfig | None:
        api_key = os.environ.get("PINECONE_API_KEY", "").strip()
        if not api_key:
            return None
        return cls(
            api_key=api_key,
            index_name=os.environ.get("PINECONE_INDEX_NAME", "ethioberg-regulatory"),
            namespace=os.environ.get("PINECONE_NAMESPACE", "regulatory"),
        )


class PineconeStore:
    BATCH_SIZE = 96

    def __init__(self, config: PineconeConfig):
        self.config = config
        self._client: Pinecone | None = None
        self._index = None

    def _get_index(self):
        if self._index is None:
            self._client = Pinecone(api_key=self.config.api_key)
            self._index = self._client.Index(self.config.index_name)
        return self._index

    def describe_stats(self) -> dict[str, int | str]:
        try:
            stats = self._get_index().describe_index_stats()
            total = getattr(stats, "total_vector_count", 0) or 0
        except Exception:
            total = 0
        return {
            "chunkCount": int(total),
            "retrievalMode": "Pinecone multilingual-e5-large (hosted embeddings)",
            "indexName": self.config.index_name,
            "namespace": self.config.namespace,
        }

    def upsert_records(self, records: list[dict[str, Any]]) -> int:
        if not records:
            return 0
        index = self._get_index()
        for start in range(0, len(records), self.BATCH_SIZE):
            batch = records[start : start + self.BATCH_SIZE]
            index.upsert_records(namespace=self.config.namespace, records=batch)
        return len(records)

    def delete_by_source_url(self, source_url: str) -> None:
        self._get_index().delete(
            filter={"source_url": {"$eq": source_url}},
            namespace=self.config.namespace,
        )

    def search(
        self,
        query: str,
        *,
        top_k: int = 5,
        source_id: str | None = None,
        fields: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        metadata_filter: dict[str, Any] | None = None
        if source_id:
            metadata_filter = {"source_id": {"$eq": source_id}}

        query_payload: dict[str, Any] = {"inputs": {"text": query}, "top_k": top_k}
        if metadata_filter:
            query_payload["filter"] = metadata_filter

        response = self._get_index().search(
            namespace=self.config.namespace,
            query=query_payload,
            fields=fields
            or [
                "text",
                "source_id",
                "source_title",
                "section",
                "page",
                "language",
                "effective_from",
                "effective_to",
                "segment",
                "is_active",
            ],
        )
        return [
            {
                "id": hit.id,
                "score": hit.score,
                "fields": hit.fields,
            }
            for hit in response.result.hits
        ]

    def retrieve(
        self,
        query: str,
        *,
        segment: MarketSegment | None = None,
        language: str | None = None,
        as_of=None,
        top_k: int = 5,
    ) -> list[RetrievalHit]:
        from datetime import date

        evaluation_date = as_of or date.today()
        article_ref = extract_article_reference(query)
        raw_hits = self.search(query, top_k=max(top_k * 3, 10))

        hits: list[RetrievalHit] = []
        for raw in raw_hits:
            chunk = _fields_to_chunk(raw["id"], raw["fields"])
            if not _eligible(chunk, segment=segment, language=language, as_of=evaluation_date):
                continue

            article_boost = 0.0
            if article_ref and article_ref in chunk.section.lower():
                article_boost = 0.5

            score = float(raw["score"]) + article_boost
            hits.append(
                RetrievalHit(
                    chunk=chunk,
                    bm25_score=0.0,
                    dense_score=float(raw["score"]),
                    rrf_score=score,
                    article_boost=article_boost,
                )
            )

        hits.sort(key=lambda hit: hit.rrf_score, reverse=True)
        return hits[:top_k]


def _fields_to_chunk(record_id: str, fields: dict[str, Any]) -> RegulatoryChunk:
    segment_value = fields.get("segment")
    segment = MarketSegment(segment_value) if segment_value else None
    page = fields.get("page")
    return RegulatoryChunk(
        chunk_id=str(record_id),
        source_id=str(fields.get("source_id") or "unknown"),
        source_title=str(fields.get("source_title") or "Unknown source"),
        section=str(fields.get("section") or "General"),
        page=int(page) if page is not None else None,
        segment=segment,
        language=str(fields.get("language") or "en"),
        effective_from=str(fields.get("effective_from") or "1900-01-01"),
        effective_to=fields.get("effective_to"),
        text=str(fields.get("text") or ""),
    )


def _eligible(
    chunk: RegulatoryChunk,
    *,
    segment: MarketSegment | None,
    language: str | None,
    as_of,
) -> bool:
    from datetime import date

    if segment and chunk.segment and chunk.segment != segment:
        return False
    if language and chunk.language != language:
        return False
    if date.fromisoformat(chunk.effective_from) > as_of:
        return False
    if chunk.effective_to and date.fromisoformat(chunk.effective_to) < as_of:
        return False
    return bool(chunk.text.strip())
