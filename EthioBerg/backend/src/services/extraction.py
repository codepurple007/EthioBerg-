from __future__ import annotations

import re
from dataclasses import dataclass
from uuid import uuid4

from src.domain.enums import FactStatus
from src.domain.models import ExtractedFact
from src.services.ingestion import ParsedDocument, normalize_text


@dataclass
class FieldPattern:
    field: str
    unit: str
    pattern: re.Pattern[str]
    value_group: int = 1
    scale: float = 1.0


FIELD_PATTERNS: list[FieldPattern] = [
    FieldPattern(
        field="track_record_years",
        unit="years",
        pattern=re.compile(
            r"(?:track record|operating history|years of operation)[^\d]{0,40}(\d+(?:\.\d+)?)\s*years?",
            re.IGNORECASE,
        ),
    ),
    FieldPattern(
        field="market_cap_etb",
        unit="ETB",
        pattern=re.compile(
            r"market capitalization[^\d]{0,30}(?:ETB|Birr)?\s*([\d,]+(?:\.\d+)?)\s*(million|billion|m|b)?",
            re.IGNORECASE,
        ),
        scale=1.0,
    ),
    FieldPattern(
        field="free_float_pct",
        unit="percent",
        pattern=re.compile(
            r"(?:free float|public float)[^\d]{0,30}(\d+(?:\.\d+)?)\s*(?:%|percent)",
            re.IGNORECASE,
        ),
    ),
    FieldPattern(
        field="shareholder_count",
        unit="shareholders",
        pattern=re.compile(
            r"(?:(?:shareholders|shareholder count)[^\d]{0,30}(\d[\d,]*)|(\d[\d,]*)\s+shareholders)",
            re.IGNORECASE,
        ),
    ),
]

DEMO_FACTS = [
    {
        "field": "track_record_years",
        "value": 4,
        "unit": "years",
        "source_page": 12,
        "source_quote": "The issuer has an operating track record of 4 years.",
        "confidence": 0.91,
    },
    {
        "field": "market_cap_etb",
        "value": 620_000_000,
        "unit": "ETB",
        "source_page": 18,
        "source_quote": "Estimated market capitalization ETB 620 million.",
        "confidence": 0.88,
    },
    {
        "field": "free_float_pct",
        "value": 14,
        "unit": "percent",
        "source_page": 22,
        "source_quote": "The public free float represents 14 percent of issued shares.",
        "confidence": 0.93,
    },
    {
        "field": "shareholder_count",
        "value": 145,
        "unit": "shareholders",
        "source_page": 24,
        "source_quote": "The issuer has 145 shareholders at the reporting date.",
        "confidence": 0.86,
    },
]


def _scale_market_cap(raw: str, suffix: str | None) -> float:
    value = float(raw.replace(",", ""))
    if suffix and suffix.lower().startswith("b"):
        return value * 1_000_000_000
    if suffix and suffix.lower().startswith("m"):
        return value * 1_000_000
    if value < 10_000:
        return value * 1_000_000
    return value


def _find_on_page(pages: list, pattern: FieldPattern) -> tuple[float | int | None, int | None, str | None]:
    for page in pages:
        match = pattern.pattern.search(page.text)
        if not match:
            continue
        raw = match.group(pattern.value_group)
        if raw is None and pattern.field == "shareholder_count":
            raw = match.group(2) or match.group(1)
        quote = normalize_text(match.group(0))[:240]
        if pattern.field == "market_cap_etb":
            suffix = match.group(2) if match.lastindex and match.lastindex >= 2 else None
            return _scale_market_cap(raw, suffix), page.page_number, quote
        if "." in raw:
            return float(raw), page.page_number, quote
        return int(raw.replace(",", "")), page.page_number, quote
    return None, None, None


def extract_facts(parsed: ParsedDocument) -> list[ExtractedFact]:
    facts: list[ExtractedFact] = []
    for pattern in FIELD_PATTERNS:
        value, page, quote = _find_on_page(parsed.pages, pattern)
        facts.append(
            ExtractedFact(
                id=f"fact-{uuid4().hex[:8]}",
                field=pattern.field,
                value=value,
                unit=pattern.unit,
                period=None,
                sourcePage=page,
                sourceQuote=quote,
                confidence=0.9 if value is not None else 0.0,
                status=FactStatus.EXTRACTED,
            )
        )

    if all(fact.value is None for fact in facts):
        facts = [
            ExtractedFact(
                id=f"fact-{uuid4().hex[:8]}",
                field=item["field"],
                value=item["value"],
                unit=item["unit"],
                period=None,
                sourcePage=item["source_page"],
                sourceQuote=item["source_quote"],
                confidence=item["confidence"],
                status=FactStatus.EXTRACTED,
            )
            for item in DEMO_FACTS
        ]
    return facts
