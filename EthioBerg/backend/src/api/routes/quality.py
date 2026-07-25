from fastapi import APIRouter, Header, HTTPException

from src.api.deps import platform_config_service, rag_quality_service
from src.domain.models import (
    ActorRef,
    EvaluationProgress,
    GuardrailSettings,
    GuardrailSettingsInput,
    MessageResponse,
    RagQualityOverview,
)

router = APIRouter(prefix="/quality", tags=["quality"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("/overview", response_model=RagQualityOverview)
def quality_overview() -> RagQualityOverview:
    return rag_quality_service.overview()


@router.post("/evaluate", response_model=MessageResponse)
def run_evaluation(
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> MessageResponse:
    result = rag_quality_service.start_evaluation(_actor(x_actor_id, x_actor_name))
    if not result.get("ok"):
        raise HTTPException(status_code=409, detail=result.get("message", "Could not start evaluation."))
    return MessageResponse(ok=True, message=result["message"])


@router.get("/progress", response_model=EvaluationProgress)
def evaluation_progress() -> EvaluationProgress:
    return rag_quality_service.progress()


@router.get("/guardrails", response_model=GuardrailSettings)
def get_guardrails() -> GuardrailSettings:
    return platform_config_service.get_guardrails()


@router.put("/guardrails", response_model=GuardrailSettings)
def update_guardrails(
    payload: GuardrailSettingsInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> GuardrailSettings:
    return platform_config_service.update_guardrails(payload, _actor(x_actor_id, x_actor_name))
