from fastapi import APIRouter, Header, HTTPException

from src.api.deps import platform_config_service, regulatory_qa_service
from src.domain.models import (
    ActorRef,
    ChunkPreviewResponse,
    IngestionPipelineStats,
    IngestionSettings,
    IngestionSettingsInput,
)

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("/settings", response_model=IngestionSettings)
def get_ingestion_settings() -> IngestionSettings:
    return platform_config_service.get_ingestion_settings()


@router.put("/settings", response_model=IngestionSettings)
def update_ingestion_settings(
    payload: IngestionSettingsInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> IngestionSettings:
    if payload.child_chunk_chars > payload.parent_chunk_chars:
        raise HTTPException(
            status_code=400,
            detail="Child chunk size must not exceed the parent chunk size.",
        )
    if payload.chunk_overlap_chars >= payload.child_chunk_chars:
        raise HTTPException(
            status_code=400,
            detail="Chunk overlap must be smaller than the child chunk size.",
        )
    return platform_config_service.update_ingestion_settings(payload, _actor(x_actor_id, x_actor_name))


@router.get("/settings/versions", response_model=list[IngestionSettings])
def list_ingestion_versions() -> list[IngestionSettings]:
    return platform_config_service.list_ingestion_versions()


@router.post("/settings/versions/{version}/restore", response_model=IngestionSettings)
def restore_ingestion_version(
    version: int,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> IngestionSettings:
    restored = platform_config_service.restore_ingestion_version(
        version, _actor(x_actor_id, x_actor_name)
    )
    if not restored:
        raise HTTPException(status_code=404, detail=f"Ingestion settings version {version} not found.")
    return restored


@router.get("/stats", response_model=IngestionPipelineStats)
def ingestion_stats() -> IngestionPipelineStats:
    return platform_config_service.ingestion_stats(len(regulatory_qa_service.chunks))


@router.post("/preview", response_model=ChunkPreviewResponse)
def preview_chunking(payload: dict | None = None) -> ChunkPreviewResponse:
    sample = (payload or {}).get("text") if payload else None
    return platform_config_service.preview_chunking(sample)
