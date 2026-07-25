from fastapi import APIRouter, HTTPException, Query

from src.api.deps import company_explorer_service
from src.domain.models import (
    Company,
    CompanyExploreRequest,
    CompanyExploreResponse,
    CompanyResolveResponse,
)

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=list[Company])
def list_companies() -> list[Company]:
    return company_explorer_service.repository.get_companies()


@router.get("/resolve", response_model=CompanyResolveResponse)
def resolve_company(query: str = Query(min_length=1)) -> CompanyResolveResponse:
    return company_explorer_service.resolve(query)


@router.post("/explore", response_model=CompanyExploreResponse)
def explore_company(payload: CompanyExploreRequest) -> CompanyExploreResponse:
    try:
        return company_explorer_service.explore(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{company_id}", response_model=Company)
def get_company(company_id: str) -> Company:
    company = next(
        (row for row in company_explorer_service.repository.get_companies() if row.id == company_id),
        None,
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
    return company
