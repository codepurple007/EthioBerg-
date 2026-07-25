from fastapi import APIRouter

from src.api.deps import repository
from src.domain.models import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats() -> DashboardStats:
    return repository.get_dashboard_stats()
