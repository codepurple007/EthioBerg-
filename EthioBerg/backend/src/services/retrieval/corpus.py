from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

import yaml

from src.domain.enums import MarketSegment


@dataclass(frozen=True)
class RegulatoryChunk:
    chunk_id: str
    source_id: str
    source_title: str
    section: str
    page: int | None
    segment: MarketSegment | None
    language: str
    effective_from: str
    effective_to: str | None
    text: str


def load_corpus(corpus_path: Path) -> list[RegulatoryChunk]:
    payload = yaml.safe_load(corpus_path.read_text(encoding="utf-8"))
    chunks: list[RegulatoryChunk] = []
    for item in payload["chunks"]:
        segment = item.get("segment")
        chunks.append(
            RegulatoryChunk(
                chunk_id=item["chunk_id"],
                source_id=item["source_id"],
                source_title=item["source_title"],
                section=item["section"],
                page=item.get("page"),
                segment=MarketSegment(segment) if segment else None,
                language=item["language"],
                effective_from=item["effective_from"],
                effective_to=item.get("effective_to"),
                text=item["text"].strip(),
            )
        )
    return chunks


ARTICLE_PATTERN = re.compile(r"\b(?:article|art\.?)\s*(\d+[a-z]?)\b", re.IGNORECASE)


def extract_article_reference(query: str) -> str | None:
    match = ARTICLE_PATTERN.search(query)
    if not match:
        return None
    return match.group(1).lower()
