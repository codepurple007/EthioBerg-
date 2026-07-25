from fastapi import APIRouter, File, Form, Header, HTTPException, UploadFile

from src.api.deps import document_service
from src.domain.enums import MarketSegment
from src.domain.models import ActorRef, DocumentEvaluateResponse, IssuerDocument, UpdateFactsInput
from src.services.ingestion import IngestionError

router = APIRouter(prefix="/documents", tags=["documents"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("", response_model=list[IssuerDocument])
def list_documents() -> list[IssuerDocument]:
    return document_service.list_documents()


@router.get("/{document_id}", response_model=IssuerDocument)
def get_document(document_id: str) -> IssuerDocument:
    try:
        return document_service.get_document(document_id)
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None


@router.post("/upload", response_model=IssuerDocument)
async def upload_document(
    segment: MarketSegment = Form(...),
    file: UploadFile = File(...),
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> IssuerDocument:
    content = await file.read()
    try:
        return document_service.upload_document(
            file.filename or "upload.pdf",
            content,
            segment,
            _actor(x_actor_id, x_actor_name),
        )
    except IngestionError as exc:
        raise HTTPException(status_code=400, detail=exc.message) from exc


@router.post("/{document_id}/extract", response_model=IssuerDocument)
def extract_document(
    document_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> IssuerDocument:
    try:
        return document_service.extract_document(document_id, _actor(x_actor_id, x_actor_name))
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None


@router.put("/{document_id}/facts", response_model=IssuerDocument)
def update_facts(
    document_id: str,
    payload: UpdateFactsInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> IssuerDocument:
    try:
        return document_service.update_facts(document_id, payload, _actor(x_actor_id, x_actor_name))
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None


@router.post("/{document_id}/evaluate", response_model=DocumentEvaluateResponse)
def evaluate_document(
    document_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> DocumentEvaluateResponse:
    try:
        return document_service.evaluate_document(document_id, _actor(x_actor_id, x_actor_name))
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
