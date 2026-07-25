from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import audit, companies, dashboard, documents, readiness, regulatory, rules, settings, sources

app = FastAPI(
    title="EthioBerg API",
    description="Listing readiness and regulatory decision-support services.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3005",
        "http://127.0.0.1:3005",
    ],
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
app.include_router(api_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ethioberg-api"}
