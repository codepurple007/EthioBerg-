from fastapi import APIRouter, Header, HTTPException

from src.api.deps import repository
from src.domain.models import ActorRef, AppSettings, UpdateSettingsInput

router = APIRouter(prefix="/settings", tags=["settings"])


def _actor(actor_id: str | None, actor_name: str | None) -> ActorRef:
    if not actor_id or not actor_name:
        raise HTTPException(status_code=400, detail="X-Actor-Id and X-Actor-Name headers are required.")
    return ActorRef(actorId=actor_id, actorName=actor_name)


@router.get("", response_model=AppSettings)
def get_settings() -> AppSettings:
    return repository.get_settings()


@router.patch("", response_model=AppSettings)
def update_settings(
    payload: UpdateSettingsInput,
    x_actor_id: str | None = Header(default=None, alias="X-Actor-Id"),
    x_actor_name: str | None = Header(default=None, alias="X-Actor-Name"),
) -> AppSettings:
    return repository.update_settings(
        _actor(x_actor_id, x_actor_name),
        **payload.model_dump(by_alias=True, exclude_none=True),
    )
