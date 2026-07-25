import pytest

from src.services.extraction import extract_facts
from src.services.ingestion import ParsedDocument, ParsedPage


def test_extract_facts_from_sample_text():
    parsed = ParsedDocument(
        pages=[
            ParsedPage(
                page_number=1,
                text=(
                    "Operating track record of 4 years. "
                    "Market capitalization ETB 620 million. "
                    "Public free float 14 percent. "
                    "145 shareholders."
                ),
            )
        ],
        mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        checksum="abc",
    )
    facts = extract_facts(parsed)
    by_field = {fact.field: fact for fact in facts}
    assert by_field["track_record_years"].value == 4
    assert by_field["market_cap_etb"].value == 620_000_000
    assert by_field["free_float_pct"].value == 14
    assert by_field["shareholder_count"].value == 145
