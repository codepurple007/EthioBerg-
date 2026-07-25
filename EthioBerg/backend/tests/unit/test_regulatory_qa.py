from datetime import date

from src.domain.enums import MarketSegment
from src.domain.models import RegulatoryAskRequest
from src.services.regulatory_qa import RegulatoryQAService


def test_article_query_boost(tmp_path):
    corpus = tmp_path / "corpus.yaml"
    corpus.write_text(
        """
chunks:
  - chunk_id: art-135
    source_id: src-esx-rulebook
    source_title: ESX Rulebook
    section: Article 135 — Insider dealing prohibition
    page: 201
    segment: null
    language: en
    effective_from: "2025-01-01"
    effective_to: null
    text: Article 135 prohibits insider dealing in relevant securities.
  - chunk_id: other
    source_id: src-esx-rulebook
    source_title: ESX Rulebook
    section: Volume C — Main Market listing criteria
    page: 112
    segment: MAIN
    language: en
    effective_from: "2025-01-01"
    effective_to: null
    text: Main Market applicants need three years track record.
""",
        encoding="utf-8",
    )
    service = RegulatoryQAService(corpus)
    response = service.ask(RegulatoryAskRequest(question="What does Article 135 prohibit?"))
    assert response.status == "ANSWERED"
    assert response.citations[0].chunk_id == "art-135"


def test_abstention_on_out_of_corpus_question(tmp_path):
    corpus = tmp_path / "corpus.yaml"
    corpus.write_text(
        """
chunks:
  - chunk_id: one
    source_id: src-esx-rulebook
    source_title: ESX Rulebook
    section: Volume C
    page: 1
    segment: null
    language: en
    effective_from: "2025-01-01"
    effective_to: null
    text: Listing criteria for Ethiopian issuers.
""",
        encoding="utf-8",
    )
    service = RegulatoryQAService(corpus)
    response = service.ask(
        RegulatoryAskRequest(question="What is the capital requirement for Singapore listings?")
    )
    assert response.status == "ABSTAINED"
    assert response.answer is None


def test_segment_filter_excludes_other_segment(tmp_path):
    corpus = tmp_path / "corpus.yaml"
    corpus.write_text(
        """
chunks:
  - chunk_id: main-cap
    source_id: src-esx-rulebook
    source_title: ESX Rulebook
    section: Main Market market capitalization
    page: 113
    segment: MAIN
    language: en
    effective_from: "2025-01-01"
    effective_to: null
    text: Main Market capitalization shall be not less than ETB 500 million.
  - chunk_id: growth-cap
    source_id: src-esx-rulebook
    source_title: ESX Rulebook
    section: Growth Market market capitalization
    page: 129
    segment: GROWTH
    language: en
    effective_from: "2025-01-01"
    effective_to: null
    text: Growth Market capitalization shall be not less than ETB 100 million.
""",
        encoding="utf-8",
    )
    service = RegulatoryQAService(corpus)
    response = service.ask(
        RegulatoryAskRequest(
            question="What is the minimum market capitalization?",
            segment=MarketSegment.GROWTH,
        )
    )
    assert response.status == "ANSWERED"
    assert any("100 million" in citation.quote for citation in response.citations)
