from fastapi import APIRouter, Header, HTTPException, Query

from src.api.deps import repository
from src.domain.enums import MarketSegment
from src.domain.models import ActorRef, RuleDefinition

router = APIRouter(prefix="/rules", tags=["rules"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("", response_model=list[RuleDefinition])
def list_rules(segment: MarketSegment | None = Query(default=None)) -> list[RuleDefinition]:
    return repository.get_rules(segment)


@router.patch("/{rule_id}/approve", response_model=RuleDefinition)
def approve_rule(
    rule_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> RuleDefinition:
    rule = repository.approve_rule(rule_id, _actor(x_actor_id, x_actor_name))
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")
    return rule
