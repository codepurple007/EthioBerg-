from __future__ import annotations

import math
from collections import Counter

from src.services.retrieval.bm25_index import tokenize
from src.services.retrieval.corpus import RegulatoryChunk


class DenseTfidfIndex:
    """Lightweight dense proxy using TF-IDF cosine similarity (deterministic MVP adapter)."""

    def __init__(self, chunks: list[RegulatoryChunk]):
        self.chunks = chunks
        self._docs = [tokenize(chunk.text + " " + chunk.section) for chunk in chunks]
        self._df: Counter[str] = Counter()
        for tokens in self._docs:
            for term in set(tokens):
                self._df[term] += 1
        self._N = len(chunks)
        self._vectors = [self._vector(tokens) for tokens in self._docs]

    def _idf(self, term: str) -> float:
        df = self._df.get(term, 0)
        return math.log(1 + (self._N + 1) / (df + 1))

    def _vector(self, tokens: list[str]) -> dict[str, float]:
        counts = Counter(tokens)
        total = sum(counts.values()) or 1
        return {term: (count / total) * self._idf(term) for term, count in counts.items()}

    @staticmethod
    def _cosine(a: dict[str, float], b: dict[str, float]) -> float:
        if not a or not b:
            return 0.0
        dot = sum(a.get(k, 0.0) * b.get(k, 0.0) for k in set(a) | set(b))
        norm_a = math.sqrt(sum(v * v for v in a.values()))
        norm_b = math.sqrt(sum(v * v for v in b.values()))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def score(self, query: str) -> list[tuple[int, float]]:
        query_vec = self._vector(tokenize(query))
        return [(idx, self._cosine(query_vec, vec)) for idx, vec in enumerate(self._vectors)]
