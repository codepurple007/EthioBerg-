import os

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import (
    audit,
    companies,
    dashboard,
    documents,
    ingestion,
    quality,
    readiness,
    regulatory,
    reports,
    retrieval,
    rules,
    scraper,
    settings,
    sources,
)

app = FastAPI(
    title="EthioBerg API",
    description="Listing readiness and regulatory decision-support services.",
    version="0.2.0",
)

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:3005",
    "http://127.0.0.1:3005",
]


def _allowed_origins() -> list[str]:
    """Local dev origins plus any comma-separated origins from CORS_ALLOW_ORIGINS."""
    configured = os.environ.get("CORS_ALLOW_ORIGINS", "")
    extra = [origin.strip().rstrip("/") for origin in configured.split(",") if origin.strip()]
    return [*DEFAULT_ALLOWED_ORIGINS, *extra]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_origin_regex=os.environ.get("CORS_ALLOW_ORIGIN_REGEX") or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(sources.router)
api_router.include_router(companies.router)
api_router.include_router(rules.router)
api_router.include_router(settings.router)
api_router.include_router(audit.router)
api_router.include_router(dashboard.router)
api_router.include_router(documents.router)
api_router.include_router(regulatory.router)
api_router.include_router(readiness.router)
api_router.include_router(reports.router)
api_router.include_router(scraper.router)
api_router.include_router(ingestion.router)
api_router.include_router(retrieval.router)
api_router.include_router(quality.router)
app.include_router(api_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ethioberg-api"}
