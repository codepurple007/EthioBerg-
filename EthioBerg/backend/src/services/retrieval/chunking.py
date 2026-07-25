from __future__ import annotations

import re
from dataclasses import dataclass

from src.services.ingestion import normalize_text

MAX_CHUNK_CHARS = 1500

TABLE_ROW_PATTERN = re.compile(r"(?:\S+\s*\|\s*\S+)|(?:\S+\t\S+)")


@dataclass(frozen=True)
class ParentChunk:
    index: int
    text: str
    children: list[str]


def looks_like_table(text: str) -> bool:
    lines = [line for line in text.splitlines() if line.strip()]
    if len(lines) < 2:
        return False
    tabular = sum(1 for line in lines if TABLE_ROW_PATTERN.search(line))
    return tabular >= max(2, len(lines) // 3)


def _split_with_overlap(text: str, size: int, overlap: int) -> list[str]:
    if size <= 0:
        return [text] if text else []
    stride = max(1, size - max(0, overlap))
    pieces: list[str] = []
    for start in range(0, len(text), stride):
        piece = text[start : start + size].strip()
        if piece:
            pieces.append(piece)
        if start + size >= len(text):
            break
    return pieces


def chunk_parent_child(
    text: str,
    *,
    parent_chars: int,
    child_chars: int,
    overlap_chars: int = 0,
    table_aware: bool = True,
) -> list[ParentChunk]:
    """Split text into retrieval-sized child chunks grouped under context-sized parents.

    Table-like blocks are kept whole so row/column relationships survive chunking.
    """
    if table_aware and looks_like_table(text):
        blocks = [block.strip() for block in re.split(r"\n{2,}", text) if block.strip()]
    else:
        normalized = normalize_text(text)
        blocks = _split_with_overlap(normalized, parent_chars, 0) if normalized else []

    parents: list[ParentChunk] = []
    for index, block in enumerate(blocks):
        children = _split_with_overlap(block, child_chars, overlap_chars)
        parents.append(ParentChunk(index=index, text=block, children=children or [block]))
    return parents


def chunk_page_text(text: str, *, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    normalized = normalize_text(text)
    if not normalized:
        return []
    if len(normalized) <= max_chars:
        return [normalized]

    paragraphs = [part.strip() for part in re.split(r"\n{2,}", text) if part.strip()]
    if not paragraphs:
        paragraphs = [normalized]

    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        paragraph = normalize_text(paragraph)
        if not paragraph:
            continue
        if len(paragraph) > max_chars:
            if current:
                chunks.append(current)
                current = ""
            for start in range(0, len(paragraph), max_chars):
                chunks.append(paragraph[start : start + max_chars])
            continue
        candidate = f"{current} {paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = paragraph
    if current:
        chunks.append(current)
    return chunks
