from urllib.parse import quote

from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import Response

from src.api.deps import report_service
from src.domain.models import ActorRef, ReportCandidate, ReportPreview

router = APIRouter(prefix="/reports", tags=["reports"])

DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(
            status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required."
        )
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("/candidates", response_model=list[ReportCandidate])
def list_candidates() -> list[ReportCandidate]:
    return report_service.list_candidates()


@router.get("/{document_id}/preview", response_model=ReportPreview)
def preview_report(
    document_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> ReportPreview:
    try:
        return report_service.build_preview(document_id, _actor(x_actor_id, x_actor_name))
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{document_id}/export.docx")
def export_report(
    document_id: str,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> Response:
    try:
        filename, payload = report_service.render_docx(
            document_id, _actor(x_actor_id, x_actor_name)
        )
    except LookupError:
        raise HTTPException(status_code=404, detail="Document not found.") from None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return Response(
        content=payload,
        media_type=DOCX_MEDIA_TYPE,
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quote(filename)}",
        },
    )
