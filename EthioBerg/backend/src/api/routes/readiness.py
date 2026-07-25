from fastapi import APIRouter

from src.api.deps import repository
from src.domain.models import ReadinessEvaluateRequest, ReadinessEvaluateResponse
from src.services.rule_engine import PRE_REVIEW_DISCLAIMER, summarize_results

router = APIRouter(prefix="/readiness", tags=["readiness"])


@router.post("/evaluate", response_model=ReadinessEvaluateResponse)
def evaluate_readiness(payload: ReadinessEvaluateRequest) -> ReadinessEvaluateResponse:
    settings = repository.get_settings()
    results = repository.rule_engine.evaluate(
        payload.segment,
        payload.facts,
        as_of=payload.as_of,
        include_draft_rules=False,
    )
    return ReadinessEvaluateResponse(
        segment=payload.segment,
        ruleVersion=settings.active_rule_version,
        results=results,
        summary=summarize_results(results),
        disclaimer=PRE_REVIEW_DISCLAIMER,
    )
