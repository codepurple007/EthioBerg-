from fastapi import APIRouter, Header, HTTPException, Query
from fastapi.responses import PlainTextResponse

from src.api.deps import scraper_service
from src.domain.models import ActorRef, ScraperConfigInput

router = APIRouter(prefix="/scraper", tags=["scraper"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("/config")
def get_config() -> dict:
    return scraper_service.get_config()


@router.put("/config")
def update_config(
    payload: ScraperConfigInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict:
    return scraper_service.update_config(payload.model_dump(by_alias=False), _actor(x_actor_id, x_actor_name))


@router.get("/status")
def get_status() -> dict:
    return scraper_service.get_status()


@router.get("/documents")
def list_documents(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
) -> dict:
    return scraper_service.list_documents(page=page, page_size=page_size)


@router.post("/run")
def start_scrape(
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict:
    return scraper_service.start_scrape(_actor(x_actor_id, x_actor_name))


@router.delete("/run")
def stop_scrape(
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict:
    return scraper_service.stop_scrape(_actor(x_actor_id, x_actor_name))


@router.delete("/archive")
def clear_archive(
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> dict:
    result = scraper_service.clear_archive(_actor(x_actor_id, x_actor_name))
    if not result.get("ok"):
        raise HTTPException(status_code=400, detail=result.get("message", "Could not clear archive."))
    return result


@router.get("/export/csv")
def export_csv() -> PlainTextResponse:
    return PlainTextResponse(
        content=scraper_service.export_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="ethioberg_scrape_export.csv"'},
    )
