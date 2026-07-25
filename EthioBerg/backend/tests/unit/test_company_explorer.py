from pathlib import Path

import pytest

from src.adapters.repository import Repository
from src.domain.enums import CompanyExploreIntent, DataStatus
from src.domain.models import ActorRef, ChartSeries, ChartVisualization, CompanyExploreRequest
from src.services.chart_validator import validate_visualization
from src.services.company_explorer import CompanyExplorerService


@pytest.fixture
def explorer_service(tmp_path):
    rules_dir = Path(__file__).resolve().parents[2] / "config" / "rules"
    repo = Repository(tmp_path / "test.db", rules_dir)
    root = Path(__file__).resolve().parents[2] / "config"
    return CompanyExplorerService(
        repo,
        synthetic_config_path=root / "synthetic_demo" / "price_volume.yaml",
        financials_config_path=root / "fixtures" / "issuer_financials.yaml",
        readiness_facts_path=root / "fixtures" / "company_readiness_facts.yaml",
    )


def test_resolve_company_by_ticker(explorer_service):
    result = explorer_service.resolve("AWASH")
    assert result.status == "RESOLVED"
    assert result.company is not None
    assert result.company.ticker == "AWASH"


def test_ambiguous_bank_query(explorer_service):
    result = explorer_service.resolve("bank")
    assert result.status == "AMBIGUOUS"
    assert len(result.candidates) >= 2


def test_synthetic_price_history_is_reproducible(explorer_service):
    repo = explorer_service.repository
    actor = ActorRef(actorId="u1", actorName="Admin")
    repo.update_settings(actor, syntheticDemoEnabled=True)
    first = explorer_service.explore(
        CompanyExploreRequest(companyId="c1", intent=CompanyExploreIntent.COMPANY_PRICE_HISTORY)
    )
    second = explorer_service.explore(
        CompanyExploreRequest(companyId="c1", intent=CompanyExploreIntent.COMPANY_PRICE_HISTORY)
    )
    assert first.data_status == DataStatus.SYNTHETIC_DEMO
    assert first.visualizations[0].series[0].points[0].value == second.visualizations[0].series[0].points[0].value


def test_price_history_unavailable_when_synthetic_disabled(explorer_service):
    repo = explorer_service.repository
    actor = ActorRef(actorId="u1", actorName="Admin")
    repo.update_settings(actor, syntheticDemoEnabled=False)
    response = explorer_service.explore(
        CompanyExploreRequest(companyId="c1", intent=CompanyExploreIntent.COMPANY_PRICE_HISTORY)
    )
    assert response.data_status == DataStatus.UNAVAILABLE
    assert response.visualizations == []


def test_financial_trend_uses_issuer_reported_fixture(explorer_service):
    response = explorer_service.explore(
        CompanyExploreRequest(companyId="c5", intent=CompanyExploreIntent.COMPANY_FINANCIAL_TREND)
    )
    assert response.data_status == DataStatus.ISSUER_REPORTED
    assert response.visualizations[0].template_id == "FINANCIAL_TREND_V1"


def test_validator_rejects_mixed_status_series():
    visualization = ChartVisualization(
        templateId="PRICE_VOLUME_V1",
        title="Mixed",
        period={"start": "2026-01-01", "end": "2026-02-01"},
        dataStatus=DataStatus.SYNTHETIC_DEMO,
        series=[
            ChartSeries(
                key="close",
                label="Close",
                unit="ETB",
                dataStatus=DataStatus.SYNTHETIC_DEMO,
                points=[
                    {"date": "2026-01-31", "value": 100.0, "dataStatus": DataStatus.SYNTHETIC_DEMO},
                    {"date": "2026-02-28", "value": 101.0, "dataStatus": DataStatus.OFFICIAL},
                ],
            ),
            ChartSeries(
                key="volume",
                label="Volume",
                unit="shares",
                dataStatus=DataStatus.SYNTHETIC_DEMO,
                points=[
                    {"date": "2026-01-31", "value": 1000.0, "dataStatus": DataStatus.SYNTHETIC_DEMO},
                    {"date": "2026-02-28", "value": 1100.0, "dataStatus": DataStatus.SYNTHETIC_DEMO},
                ],
            ),
        ],
    )
    valid, errors = validate_visualization(visualization)
    assert not valid
    assert errors
