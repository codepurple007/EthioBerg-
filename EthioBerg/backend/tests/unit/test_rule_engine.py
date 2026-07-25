from datetime import date
from pathlib import Path

import pytest

from src.domain.enums import FactStatus, MarketSegment, RequirementState, ReviewStatus, RuleOperator
from src.domain.models import ExtractedFactInput, RuleDefinition
from src.services.rule_engine import RuleEngine, compare, summarize_results


@pytest.fixture
def main_rules() -> list[RuleDefinition]:
    return RuleEngine.from_directory(Path(__file__).resolve().parents[2] / "config" / "rules").list_rules(
        MarketSegment.MAIN
    )


@pytest.fixture
def engine() -> RuleEngine:
    rules_dir = Path(__file__).resolve().parents[2] / "config" / "rules"
    return RuleEngine.from_directory(rules_dir)


def test_gte_boundary_values(engine: RuleEngine):
    facts = [ExtractedFactInput(field="track_record_years", value=3, status=FactStatus.USER_CONFIRMED)]
    results = engine.evaluate(MarketSegment.MAIN, facts)
    track = next(r for r in results if r.rule_id == "ESX_MAIN_TRACK_RECORD")
    assert track.state == RequirementState.MET

    facts_low = [ExtractedFactInput(field="track_record_years", value=2.9, status=FactStatus.USER_CONFIRMED)]
    results_low = engine.evaluate(MarketSegment.MAIN, facts_low)
    track_low = next(r for r in results_low if r.rule_id == "ESX_MAIN_TRACK_RECORD")
    assert track_low.state == RequirementState.NOT_MET


def test_missing_evidence_never_passes(engine: RuleEngine):
    results = engine.evaluate(MarketSegment.MAIN, [])
    market_cap = next(r for r in results if r.rule_id == "ESX_MAIN_MARKET_CAP")
    assert market_cap.state == RequirementState.MISSING_EVIDENCE


def test_null_fact_is_missing_evidence(engine: RuleEngine):
    facts = [ExtractedFactInput(field="market_cap_etb", value=None, status=FactStatus.EXTRACTED)]
    results = engine.evaluate(MarketSegment.MAIN, facts)
    market_cap = next(r for r in results if r.rule_id == "ESX_MAIN_MARKET_CAP")
    assert market_cap.state == RequirementState.MISSING_EVIDENCE


def test_conflict_fact_blocks_pass(engine: RuleEngine):
    facts = [ExtractedFactInput(field="free_float_pct", value=20, status=FactStatus.CONFLICT)]
    results = engine.evaluate(MarketSegment.MAIN, facts)
    free_float = next(r for r in results if r.rule_id == "ESX_MAIN_FREE_FLOAT")
    assert free_float.state == RequirementState.CONFLICT


def test_draft_rule_requires_review(engine: RuleEngine):
    facts = [ExtractedFactInput(field="free_float_pct", value=12, status=FactStatus.USER_CONFIRMED)]
    results = engine.evaluate(MarketSegment.GROWTH, facts, include_draft_rules=False)
    growth_float = next(r for r in results if r.rule_id == "ESX_GROWTH_FREE_FLOAT")
    assert growth_float.state == RequirementState.PROFESSIONAL_REVIEW


def test_compare_operators():
    assert compare(RuleOperator.GTE, 5, 5, None) is True
    assert compare(RuleOperator.GT, 5, 5, None) is False
    assert compare(RuleOperator.LT, 4, 5, None) is True
    assert compare(RuleOperator.RANGE, 5, 4, 6) is True
    assert compare(RuleOperator.RANGE, 7, 4, 6) is False


def test_summary_counts(engine: RuleEngine):
    facts = [
        ExtractedFactInput(field="track_record_years", value=4, status=FactStatus.USER_CONFIRMED),
        ExtractedFactInput(field="market_cap_etb", value=600_000_000, status=FactStatus.USER_CONFIRMED),
    ]
    results = engine.evaluate(MarketSegment.MAIN, facts)
    summary = summarize_results(results)
    assert summary[RequirementState.MET] >= 2
    assert RequirementState.MISSING_EVIDENCE in summary
