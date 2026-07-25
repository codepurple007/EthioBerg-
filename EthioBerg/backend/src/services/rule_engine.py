from __future__ import annotations

from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any

import yaml

from src.domain.enums import FactStatus, MarketSegment, RequirementState, ReviewStatus, RuleOperator
from src.domain.models import ExtractedFactInput, RequirementResult, RuleDefinition, RuleDefinitionFile


PRE_REVIEW_DISCLAIMER = (
    "Pre-review only — not ECMA or ESX approval. "
    "Final decisions remain with the issuer, licensed advisers, auditors, ESX, ECMA, "
    "and other competent authorities."
)


def load_rules_from_directory(rules_dir: Path) -> list[RuleDefinition]:
    rules: list[RuleDefinition] = []
    for path in sorted(rules_dir.glob("*.yaml")):
        payload = yaml.safe_load(path.read_text(encoding="utf-8"))
        parsed = RuleDefinitionFile.model_validate(payload)
        rules.extend(parsed.rules)
    return rules


def format_threshold(rule: RuleDefinition) -> str:
    if rule.operator == RuleOperator.RANGE and rule.threshold_max is not None:
        return f"{rule.threshold:g}–{rule.threshold_max:g} {rule.unit}"
    op_label = {
        RuleOperator.GTE: "≥",
        RuleOperator.LTE: "≤",
        RuleOperator.GT: ">",
        RuleOperator.LT: "<",
        RuleOperator.EQ: "=",
    }.get(rule.operator, rule.operator)
    return f"{op_label} {rule.threshold:g} {rule.unit}"


def compare(operator: RuleOperator, value: float, threshold: float, threshold_max: float | None) -> bool:
    if operator == RuleOperator.GTE:
        return value >= threshold
    if operator == RuleOperator.LTE:
        return value <= threshold
    if operator == RuleOperator.GT:
        return value > threshold
    if operator == RuleOperator.LT:
        return value < threshold
    if operator == RuleOperator.EQ:
        return value == threshold
    if operator == RuleOperator.RANGE:
        if threshold_max is None:
            raise ValueError("RANGE operator requires threshold_max")
        return threshold <= value <= threshold_max
    raise ValueError(f"Unsupported operator: {operator}")


def coerce_numeric(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        stripped = value.strip().replace(",", "")
        if not stripped:
            return None
        try:
            return float(stripped)
        except ValueError:
            return None
    return None


def is_rule_effective(rule: RuleDefinition, as_of: date) -> bool:
    start = date.fromisoformat(rule.effective_from)
    if as_of < start:
        return False
    if rule.effective_to:
        end = date.fromisoformat(rule.effective_to)
        if as_of > end:
            return False
    return True


class RuleEngine:
    def __init__(self, rules: list[RuleDefinition]):
        self._rules = rules

    @classmethod
    def from_directory(cls, rules_dir: Path) -> RuleEngine:
        return cls(load_rules_from_directory(rules_dir))

    def list_rules(self, segment: MarketSegment | None = None) -> list[RuleDefinition]:
        if segment is None:
            return list(self._rules)
        return [rule for rule in self._rules if rule.segment == segment]

    def update_rule_review_status(self, rule_id: str, status: ReviewStatus) -> RuleDefinition | None:
        for rule in self._rules:
            if rule.rule_id == rule_id:
                rule.review_status = status
                return rule
        return None

    def evaluate(
        self,
        segment: MarketSegment,
        facts: list[ExtractedFactInput],
        *,
        as_of: date | None = None,
        include_draft_rules: bool = False,
    ) -> list[RequirementResult]:
        evaluation_date = as_of or date.today()
        facts_by_field: dict[str, list[ExtractedFactInput]] = defaultdict(list)
        for fact in facts:
            facts_by_field[fact.field].append(fact)

        results: list[RequirementResult] = []
        for rule in self.list_rules(segment):
            if not is_rule_effective(rule, evaluation_date):
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=RequirementState.NOT_APPLICABLE,
                        fact_value=None,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                        calculation="Rule not effective on evaluation date.",
                    )
                )
                continue

            if rule.review_status == ReviewStatus.DRAFT and not include_draft_rules:
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=RequirementState.PROFESSIONAL_REVIEW,
                        fact_value=None,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                        calculation="Draft rule — requires administrator approval before evaluation.",
                    )
                )
                continue

            field_facts = facts_by_field.get(rule.field, [])
            if not field_facts:
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=rule.unknown_result,
                        fact_value=None,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                    )
                )
                continue

            conflict_facts = [f for f in field_facts if f.status == FactStatus.CONFLICT]
            if conflict_facts:
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=RequirementState.CONFLICT,
                        fact_value=conflict_facts[0].value,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                        calculation="Multiple credible values disagree.",
                    )
                )
                continue

            usable = [
                f
                for f in field_facts
                if f.status in (FactStatus.EXTRACTED, FactStatus.USER_CONFIRMED)
            ]
            if not usable:
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=RequirementState.CONFLICT,
                        fact_value=None,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                    )
                )
                continue

            primary = next((f for f in usable if f.status == FactStatus.USER_CONFIRMED), usable[0])
            numeric = coerce_numeric(primary.value)
            if numeric is None:
                results.append(
                    RequirementResult(
                        rule_id=rule.rule_id,
                        rule_name=rule.name,
                        state=RequirementState.MISSING_EVIDENCE,
                        fact_value=primary.value,
                        threshold=format_threshold(rule),
                        category=rule.category,
                        source_section=rule.source_section,
                        calculation="Fact value is not a comparable number.",
                    )
                )
                continue

            passed = compare(rule.operator, numeric, float(rule.threshold), rule.threshold_max)
            results.append(
                RequirementResult(
                    rule_id=rule.rule_id,
                    rule_name=rule.name,
                    state=RequirementState.MET if passed else RequirementState.NOT_MET,
                    fact_value=numeric,
                    threshold=format_threshold(rule),
                    category=rule.category,
                    source_section=rule.source_section,
                    calculation=f"{numeric:g} compared to {format_threshold(rule)}",
                )
            )

        return results


def summarize_results(results: list[RequirementResult]) -> dict[str, int]:
    summary: dict[str, int] = defaultdict(int)
    for result in results:
        summary[result.state] += 1
    return dict(summary)
