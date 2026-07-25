from __future__ import annotations

import math
import re
from collections import Counter

from src.services.retrieval.corpus import RegulatoryChunk


TOKEN_PATTERN = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.lower())


class BM25Index:
    def __init__(self, chunks: list[RegulatoryChunk], k1: float = 1.5, b: float = 0.75):
        self.chunks = chunks
        self.k1 = k1
        self.b = b
        self._tokenized = [tokenize(chunk.text + " " + chunk.section) for chunk in chunks]
        self._doc_lengths = [len(tokens) for tokens in self._tokenized]
        self._avgdl = sum(self._doc_lengths) / max(len(self._doc_lengths), 1)
        self._df: Counter[str] = Counter()
        for tokens in self._tokenized:
            for term in set(tokens):
                self._df[term] += 1
        self._N = len(chunks)

    def _idf(self, term: str) -> float:
        df = self._df.get(term, 0)
        return math.log(1 + (self._N - df + 0.5) / (df + 0.5))

    def score(self, query: str) -> list[tuple[int, float]]:
        query_terms = tokenize(query)
        scores: list[tuple[int, float]] = []
        for idx, tokens in enumerate(self._tokenized):
            if not tokens:
                scores.append((idx, 0.0))
                continue
            term_freq = Counter(tokens)
            doc_len = self._doc_lengths[idx]
            total = 0.0
            for term in query_terms:
                tf = term_freq.get(term, 0)
                if tf == 0:
                    continue
                idf = self._idf(term)
                denom = tf + self.k1 * (1 - self.b + self.b * doc_len / self._avgdl)
                total += idf * (tf * (self.k1 + 1)) / denom
            scores.append((idx, total))
        return scores
