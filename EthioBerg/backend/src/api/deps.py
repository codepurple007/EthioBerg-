from pathlib import Path

from src.adapters.repository import Repository
from src.services.company_explorer import CompanyExplorerService
from src.services.documents import DocumentService
from src.services.regulatory_qa import RegulatoryQAService

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
RULES_DIR = ROOT_DIR / "config" / "rules"
CORPUS_DIR = ROOT_DIR / "config" / "corpus"
FIXTURES_DIR = ROOT_DIR / "config" / "fixtures"
SYNTHETIC_DIR = ROOT_DIR / "config" / "synthetic_demo"
DB_PATH = DATA_DIR / "ethioberg.db"

repository = Repository(DB_PATH, RULES_DIR)
document_service = DocumentService(repository)
regulatory_qa_service = RegulatoryQAService(CORPUS_DIR / "regulatory_chunks.yaml")
company_explorer_service = CompanyExplorerService(
    repository,
    synthetic_config_path=SYNTHETIC_DIR / "price_volume.yaml",
    financials_config_path=FIXTURES_DIR / "issuer_financials.yaml",
    readiness_facts_path=FIXTURES_DIR / "company_readiness_facts.yaml",
)
