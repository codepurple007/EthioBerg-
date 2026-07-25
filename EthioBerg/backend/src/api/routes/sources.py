from fastapi import APIRouter, File, Form, Header, HTTPException, Query, UploadFile

from src.api.deps import repository, source_service
from src.domain.enums import TrustClass
from src.domain.models import ActorRef, AddSourceInput, AddSourceResponse, SourceDocument
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


@router.post("/upload", response_model=AddSourceResponse)
async def upload_source(
    title: str = Form(...),
    issuing_body: str = Form(..., alias="issuingBody"),
    version: str = Form(...),
    publication_date: str = Form(..., alias="publicationDate"),
    effective_from: str = Form(..., alias="effectiveFrom"),
    effective_to: str | None = Form(default=None, alias="effectiveTo"),
    language: str = Form(...),
    url: str = Form(default=""),
    checksum: str = Form(...),
    trust_class: TrustClass = Form(..., alias="trustClass"),
    force_duplicate: bool = Query(default=False, alias="forceDuplicate"),
    file: UploadFile = File(...),
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> AddSourceResponse:
    content = await file.read()
    payload = AddSourceInput(
        title=title,
        issuingBody=issuing_body,
        version=version,
        publicationDate=publication_date,
        effectiveFrom=effective_from,
        effectiveTo=effective_to or None,
        language=language,
        url=url,
        checksum=checksum,
        trustClass=trust_class,
    )
    return source_service.upload_source(
        payload,
        file.filename or "upload.pdf",
        content,
        _actor(x_actor_id, x_actor_name),
        force_duplicate,
    )


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
    try:
        return source_service.index_source(source_id, _actor(x_actor_id, x_actor_name))
    except LookupError:
        raise HTTPException(status_code=404, detail="Source not found.") from None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/{source_id}/smoke-test")
def smoke_test(
    source_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict[str, object]:
    ok, message = source_service.run_smoke_test(source_id, _actor(x_actor_id, x_actor_name))
    return {"ok": ok, "message": message, "disclaimer": PRE_REVIEW_DISCLAIMER}
