from fastapi import APIRouter, Header, HTTPException, Query

from src.api.deps import repository
from src.domain.enums import MarketSegment
from src.domain.models import ActorRef, AddSourceInput, AddSourceResponse, Company, SourceDocument
from src.services.rule_engine import PRE_REVIEW_DISCLAIMER

router = APIRouter(prefix="/sources", tags=["sources"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("", response_model=list[SourceDocument])
def list_sources() -> list[SourceDocument]:
    return repository.get_sources()


@router.get("/{source_id}", response_model=SourceDocument)
def get_source(source_id: str) -> SourceDocument:
    source = repository.get_source(source_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found.")
    return source


@router.post("", response_model=AddSourceResponse)
def create_source(
    payload: AddSourceInput,
    force_duplicate: bool = Query(default=False, alias="forceDuplicate"),
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> AddSourceResponse:
    return repository.add_source(payload, _actor(x_actor_id, x_actor_name), force_duplicate)


@router.patch("/{source_id}/activate", response_model=SourceDocument)
def activate_source(
    source_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> SourceDocument:
    source = repository.activate_source(source_id, _actor(x_actor_id, x_actor_name))
    if not source:
        raise HTTPException(status_code=404, detail="Source not found.")
    return source


@router.patch("/{source_id}/retire", response_model=SourceDocument)
def retire_source(
    source_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> SourceDocument:
    source = repository.retire_source(source_id, _actor(x_actor_id, x_actor_name))
    if not source:
        raise HTTPException(status_code=404, detail="Source not found.")
    return source


@router.patch("/{source_id}/index", response_model=SourceDocument)
def index_source(
    source_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> SourceDocument:
    source = repository.index_source(source_id, _actor(x_actor_id, x_actor_name))
    if not source:
        raise HTTPException(status_code=404, detail="Source not found.")
    return source


@router.post("/{source_id}/smoke-test")
def smoke_test(
    source_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict[str, object]:
    ok, message = repository.run_smoke_test(source_id, _actor(x_actor_id, x_actor_name))
    return {"ok": ok, "message": message, "disclaimer": PRE_REVIEW_DISCLAIMER}
