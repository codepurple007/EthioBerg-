from fastapi import APIRouter, Query

from src.api.deps import repository
from src.domain.models import AuditEvent

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("", response_model=list[AuditEvent])
def list_audit_events(
    actor_id: str | None = Query(default=None, alias="actorId"),
    action: str | None = Query(default=None),
    result: str | None = Query(default=None),
    search: str | None = Query(default=None),
) -> list[AuditEvent]:
    return repository.get_audit_logs(
        actor_id=actor_id,
        action=action,
        result=result,
        search=search,
    )
