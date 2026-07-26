import os
from pathlib import Path

from dotenv import load_dotenv

from src.adapters.repository import Repository
from src.services.company_explorer import CompanyExplorerService
from src.services.documents import DocumentService
from src.services.platform_config import PlatformConfigService
from src.services.rag_quality import RagQualityService
from src.services.regulatory_qa import RegulatoryQAService
from src.services.retrieval.pinecone_store import PineconeConfig, PineconeStore
from src.services.source_indexing import SourceIndexingService
from src.services.scraper_service import ScraperService
from src.services.sources import SourceService

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

# Point ETHIOBERG_DATA_DIR at a mounted volume in hosted environments; the local
# default lives inside the backend directory and is gitignored.
DATA_DIR = Path(os.environ.get("ETHIOBERG_DATA_DIR") or ROOT_DIR / "data")
RULES_DIR = ROOT_DIR / "config" / "rules"
CORPUS_DIR = ROOT_DIR / "config" / "corpus"
SCRAPER_CONFIG_PATH = ROOT_DIR / "config" / "scraper" / "default_seeds.yaml"
GOLDEN_SET_PATH = ROOT_DIR / "config" / "quality" / "golden_set.yaml"
FIXTURES_DIR = ROOT_DIR / "config" / "fixtures"
SYNTHETIC_DIR = ROOT_DIR / "config" / "synthetic_demo"
SOURCES_DIR = DATA_DIR / "sources"
UPLOADS_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "ethioberg.db"

repository = Repository(DB_PATH, RULES_DIR)
document_service = DocumentService(repository, UPLOADS_DIR)

_pinecone_config = PineconeConfig.from_env()
_pinecone_store = PineconeStore(_pinecone_config) if _pinecone_config else None
_indexing_service = SourceIndexingService(_pinecone_store) if _pinecone_store else None

source_service = SourceService(repository, SOURCES_DIR, _indexing_service)
scraper_service = ScraperService(repository, SCRAPER_CONFIG_PATH, _pinecone_store)
platform_config_service = PlatformConfigService(repository)
regulatory_qa_service = RegulatoryQAService.from_env(
    CORPUS_DIR / "regulatory_chunks.yaml",
    source_count=len(repository.get_sources()),
    config_provider=lambda: (
        platform_config_service.get_retrieval_settings(),
        platform_config_service.get_guardrails(),
    ),
)
rag_quality_service = RagQualityService(
    repository,
    regulatory_qa_service,
    platform_config_service,
    GOLDEN_SET_PATH,
)
company_explorer_service = CompanyExplorerService(
    repository,
    synthetic_config_path=SYNTHETIC_DIR / "price_volume.yaml",
    financials_config_path=FIXTURES_DIR / "issuer_financials.yaml",
    readiness_facts_path=FIXTURES_DIR / "company_readiness_facts.yaml",
)
