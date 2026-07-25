from __future__ import annotations

import random
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import yaml

from src.adapters.repository import Repository
from src.domain.enums import CompanyExploreIntent, DataStatus, FactStatus
from src.domain.models import (
    ChartPoint,
    ChartSeries,
    ChartTableRow,
    ChartVisualization,
    Company,
    CompanyExploreRequest,
    CompanyExploreResponse,
    CompanyMetric,
    CompanyResolveResponse,
    ExtractedFactInput,
    RequirementResult,
)
from src.services.chart_validator import validate_visualization
from src.services.rule_engine import PRE_REVIEW_DISCLAIMER, summarize_results

LIMITATION_NOTICE = (
    "This response provides factual analysis and education only. It is not investment advice, "
    "a trading recommendation, or ECMA/ESX compliance certification."
)
SYNTHETIC_BANNER = "Synthetic demo data — not ESX market data."


class CompanyExplorerService:
    def __init__(
        self,
        repository: Repository,
        *,
        synthetic_config_path: Path,
        financials_config_path: Path,
        readiness_facts_path: Path,
    ):
        self.repository = repository
        self.synthetic_config = yaml.safe_load(synthetic_config_path.read_text(encoding="utf-8"))
        self.financials_config = yaml.safe_load(financials_config_path.read_text(encoding="utf-8"))
        self.readiness_facts_config = yaml.safe_load(readiness_facts_path.read_text(encoding="utf-8"))

    def resolve(self, query: str) -> CompanyResolveResponse:
        normalized = query.strip().lower()
        if not normalized:
            return CompanyResolveResponse(status="NOT_FOUND")

        exact: list[Company] = []
        partial: list[Company] = []
        for company in self.repository.get_companies():
            ticker = company.ticker.lower()
            name = company.official_name.lower()
            aliases = [alias.lower() for alias in company.aliases]
            if normalized in {ticker, name} or normalized in aliases:
                exact.append(company)
            elif normalized in name or any(normalized in alias for alias in aliases):
                partial.append(company)

        matches = exact or partial
        if len(matches) == 1:
            return CompanyResolveResponse(status="RESOLVED", company=matches[0])
        if len(matches) > 1:
            return CompanyResolveResponse(status="AMBIGUOUS", candidates=matches)
        return CompanyResolveResponse(status="NOT_FOUND")

    def explore(self, payload: CompanyExploreRequest) -> CompanyExploreResponse:
        company = self._resolve_company(payload)
        settings = self.repository.get_settings()

        if payload.intent == CompanyExploreIntent.COMPANY_PRICE_HISTORY:
            return self._price_history(company, settings.synthetic_demo_enabled)
        if payload.intent == CompanyExploreIntent.COMPANY_FINANCIAL_TREND:
            return self._financial_trend(company)
        return self._readiness_view(company)

    def _resolve_company(self, payload: CompanyExploreRequest) -> Company:
        if payload.company_id:
            company = next(
                (row for row in self.repository.get_companies() if row.id == payload.company_id),
                None,
            )
            if not company:
                raise ValueError("Company not found.")
            return company

        if not payload.query:
            raise ValueError("Provide a company query or companyId.")

        resolution = self.resolve(payload.query)
        if resolution.status == "AMBIGUOUS":
            names = ", ".join(candidate.ticker for candidate in resolution.candidates)
            raise ValueError(f"Ambiguous company query. Candidates: {names}")
        if resolution.status != "RESOLVED" or not resolution.company:
            raise ValueError("Company not found in the ESX registry.")
        return resolution.company

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).astimezone().isoformat()

    def _price_history(self, company: Company, synthetic_enabled: bool) -> CompanyExploreResponse:
        as_of = self._now_iso()
        if not synthetic_enabled:
            return CompanyExploreResponse(
                responseId=str(uuid4()),
                intent=CompanyExploreIntent.COMPANY_PRICE_HISTORY,
                company=company,
                asOf=as_of,
                dataStatus=DataStatus.UNAVAILABLE,
                summaryFacts=[
                    f"{company.official_name} ({company.ticker}) is listed on the {company.segment} Market.",
                    "Verified historical ESX price and volume feeds are not connected in this MVP build.",
                ],
                metrics=[
                    CompanyMetric(
                        label="Listing date",
                        value=company.listing_date,
                        unit="date",
                        dataStatus=DataStatus.OFFICIAL,
                    ),
                    CompanyMetric(
                        label="Market segment",
                        value=company.segment,
                        unit="segment",
                        dataStatus=DataStatus.OFFICIAL,
                    ),
                ],
                visualizations=[],
                citations=[company.source_id],
                warnings=[
                    "Historical price charts require a licensed ESX market-data feed or enabled synthetic demo mode.",
                ],
                verificationStatus="PASSED",
                limitationNotice=LIMITATION_NOTICE,
            )

        fixture = self.synthetic_config["fixtures"].get(company.ticker)
        if not fixture:
            raise ValueError(f"No synthetic price fixture configured for {company.ticker}.")

        close_points, volume_points, table_rows = self._generate_synthetic_price_volume(
            fixture_id=fixture["fixture_id"],
            seed=int(fixture["seed"]),
            ticker=company.ticker,
        )
        visualization = ChartVisualization(
            templateId="PRICE_VOLUME_V1",
            title=f"{company.official_name} closing price and volume",
            subtitle=SYNTHETIC_BANNER,
            period={"start": close_points[0].date or "", "end": close_points[-1].date or ""},
            dataStatus=DataStatus.SYNTHETIC_DEMO,
            fixtureId=fixture["fixture_id"],
            series=[
                ChartSeries(
                    key="close",
                    label="Closing price",
                    unit="ETB",
                    dataStatus=DataStatus.SYNTHETIC_DEMO,
                    fixtureId=fixture["fixture_id"],
                    points=close_points,
                ),
                ChartSeries(
                    key="volume",
                    label="Volume",
                    unit="shares",
                    dataStatus=DataStatus.SYNTHETIC_DEMO,
                    fixtureId=fixture["fixture_id"],
                    points=volume_points,
                ),
            ],
            sourceRefs=[fixture["fixture_id"], company.source_id],
            caveats=[
                SYNTHETIC_BANNER,
                "Values are generated from a reproducible demo fixture and must not be interpreted as actual trading history.",
            ],
            tableRows=table_rows,
        )
        valid, errors = validate_visualization(visualization)
        if not valid:
            raise ValueError("; ".join(errors))

        latest_close = close_points[-1].value
        return CompanyExploreResponse(
            responseId=str(uuid4()),
            intent=CompanyExploreIntent.COMPANY_PRICE_HISTORY,
            company=company,
            asOf=as_of,
            dataStatus=DataStatus.SYNTHETIC_DEMO,
            summaryFacts=[
                f"{company.official_name} ({company.ticker}) demo price history uses fixture {fixture['fixture_id']}.",
                f"Latest synthetic close: ETB {latest_close:,.2f} on {close_points[-1].date}.",
            ],
            metrics=[
                CompanyMetric(
                    label="Latest synthetic close",
                    value=f"{latest_close:,.2f}",
                    unit="ETB",
                    dataStatus=DataStatus.SYNTHETIC_DEMO,
                ),
                CompanyMetric(
                    label="Latest synthetic volume",
                    value=f"{volume_points[-1].value:,.0f}",
                    unit="shares",
                    dataStatus=DataStatus.SYNTHETIC_DEMO,
                ),
            ],
            visualizations=[visualization],
            citations=[company.source_id, fixture["fixture_id"]],
            warnings=[SYNTHETIC_BANNER],
            verificationStatus="PASSED",
            limitationNotice=LIMITATION_NOTICE,
        )

    def _generate_synthetic_price_volume(
        self,
        *,
        fixture_id: str,
        seed: int,
        ticker: str,
    ) -> tuple[list[ChartPoint], list[ChartPoint], list[ChartTableRow]]:
        rng = random.Random(seed)
        base = 700 + (sum(ord(char) for char in ticker) % 250)
        close_points: list[ChartPoint] = []
        volume_points: list[ChartPoint] = []
        table_rows: list[ChartTableRow] = []
        price = float(base)

        for month in range(1, 8):
            date = f"2026-{month:02d}-28"
            price = round(max(price + rng.uniform(-18, 22), 50), 2)
            volume = float(rng.randint(85000, 165000))
            close_points.append(
                ChartPoint(date=date, value=price, dataStatus=DataStatus.SYNTHETIC_DEMO)
            )
            volume_points.append(
                ChartPoint(date=date, value=volume, dataStatus=DataStatus.SYNTHETIC_DEMO)
            )
            table_rows.extend(
                [
                    ChartTableRow(
                        date=date,
                        measure="Closing price",
                        value=price,
                        unit="ETB",
                        dataStatus=DataStatus.SYNTHETIC_DEMO,
                    ),
                    ChartTableRow(
                        date=date,
                        measure="Volume",
                        value=volume,
                        unit="shares",
                        dataStatus=DataStatus.SYNTHETIC_DEMO,
                    ),
                ]
            )

        return close_points, volume_points, table_rows

    def _financial_trend(self, company: Company) -> CompanyExploreResponse:
        payload = self.financials_config["companies"].get(company.id)
        if not payload:
            raise ValueError("No issuer financial fixture is available for this company.")

        revenue_points: list[ChartPoint] = []
        profit_points: list[ChartPoint] = []
        table_rows: list[ChartTableRow] = []
        for row in payload["periods"]:
            period = row["period"]
            revenue = float(row["revenue_etb_m"])
            profit = float(row["net_profit_etb_m"])
            revenue_points.append(
                ChartPoint(period=period, value=revenue, dataStatus=DataStatus.ISSUER_REPORTED)
            )
            profit_points.append(
                ChartPoint(period=period, value=profit, dataStatus=DataStatus.ISSUER_REPORTED)
            )
            table_rows.extend(
                [
                    ChartTableRow(
                        period=period,
                        measure="Revenue",
                        value=revenue,
                        unit="ETB millions",
                        dataStatus=DataStatus.ISSUER_REPORTED,
                    ),
                    ChartTableRow(
                        period=period,
                        measure="Net profit",
                        value=profit,
                        unit="ETB millions",
                        dataStatus=DataStatus.ISSUER_REPORTED,
                    ),
                ]
            )

        visualization = ChartVisualization(
            templateId="FINANCIAL_TREND_V1",
            title=f"{company.official_name} revenue and net profit",
            subtitle="Issuer-reported fixture data — demo education only",
            period={
                "start": revenue_points[0].period or "",
                "end": revenue_points[-1].period or "",
            },
            dataStatus=DataStatus.ISSUER_REPORTED,
            fixtureId=payload["fixture_id"],
            series=[
                ChartSeries(
                    key="revenue",
                    label="Revenue",
                    unit="ETB millions",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                    fixtureId=payload["fixture_id"],
                    points=revenue_points,
                ),
                ChartSeries(
                    key="net_profit",
                    label="Net profit",
                    unit="ETB millions",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                    fixtureId=payload["fixture_id"],
                    points=profit_points,
                ),
            ],
            sourceRefs=[payload["source_id"], payload["fixture_id"]],
            caveats=[
                payload["citation"],
                "Figures are fixture values for demonstration and may not match the latest audited issuer filing.",
            ],
            tableRows=table_rows,
        )
        valid, errors = validate_visualization(visualization)
        if not valid:
            raise ValueError("; ".join(errors))

        latest = payload["periods"][-1]
        return CompanyExploreResponse(
            responseId=str(uuid4()),
            intent=CompanyExploreIntent.COMPANY_FINANCIAL_TREND,
            company=company,
            asOf=self._now_iso(),
            dataStatus=DataStatus.ISSUER_REPORTED,
            summaryFacts=[
                f"{company.official_name} revenue reached ETB {latest['revenue_etb_m']} million in {latest['period']}.",
                f"Net profit was ETB {latest['net_profit_etb_m']} million in the same period.",
            ],
            metrics=[
                CompanyMetric(
                    label="Latest revenue",
                    value=f"{latest['revenue_etb_m']}",
                    unit="ETB millions",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                ),
                CompanyMetric(
                    label="Latest net profit",
                    value=f"{latest['net_profit_etb_m']}",
                    unit="ETB millions",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                ),
            ],
            visualizations=[visualization],
            citations=[payload["source_id"], payload["fixture_id"]],
            warnings=["Issuer-reported fixture data — not live market pricing."],
            verificationStatus="PASSED",
            limitationNotice=LIMITATION_NOTICE,
        )

    def _readiness_view(self, company: Company) -> CompanyExploreResponse:
        facts_payload = self.readiness_facts_config["companies"].get(company.id)
        if not facts_payload:
            raise ValueError("No readiness fixture is available for this company.")

        facts = [
            ExtractedFactInput(field=row["field"], value=row["value"], status=FactStatus.USER_CONFIRMED)
            for row in facts_payload["facts"]
        ]
        results = self.repository.rule_engine.evaluate(company.segment, facts, include_draft_rules=False)
        category_summary = self._build_category_summary(results)
        table_rows = [
            ChartTableRow(
                period=result.category,
                measure=result.rule_name,
                value=1.0 if result.state == "MET" else 0.0,
                unit=result.state,
                dataStatus=DataStatus.ISSUER_REPORTED,
            )
            for result in results
        ]

        visualization = ChartVisualization(
            templateId="READINESS_CATEGORY_V1",
            title=f"{company.official_name} listing readiness by category",
            subtitle="Illustrative readiness view from labelled fixture facts",
            period={"start": company.listing_date, "end": self._now_iso()[:10]},
            dataStatus=DataStatus.ISSUER_REPORTED,
            fixtureId=f"fix-readiness-{company.id}",
            series=[
                ChartSeries(
                    key=row["category"],
                    label=str(row["category"]),
                    unit="requirements",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                    points=[
                        ChartPoint(
                            period=state,
                            value=float(count),
                            dataStatus=DataStatus.ISSUER_REPORTED,
                        )
                        for state, count in row.items()
                        if state != "category" and isinstance(count, int)
                    ],
                )
                for row in category_summary
            ],
            sourceRefs=[company.source_id, "src-esx-rulebook"],
            caveats=[
                "Readiness categories are computed deterministically from fixture facts and approved rules.",
                PRE_REVIEW_DISCLAIMER,
            ],
            tableRows=table_rows,
        )
        valid, errors = validate_visualization(visualization)
        if not valid:
            raise ValueError("; ".join(errors))

        summary = summarize_results(results)
        met = summary.get("MET", 0)
        total = sum(summary.values())
        return CompanyExploreResponse(
            responseId=str(uuid4()),
            intent=CompanyExploreIntent.COMPANY_READINESS,
            company=company,
            asOf=self._now_iso(),
            dataStatus=DataStatus.ISSUER_REPORTED,
            summaryFacts=[
                f"{company.official_name} illustrative readiness review covers {total} requirements.",
                f"{met} requirements are currently marked MET using fixture facts.",
            ],
            metrics=[
                CompanyMetric(
                    label="Requirements MET",
                    value=str(met),
                    unit="count",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                ),
                CompanyMetric(
                    label="Requirements NOT MET",
                    value=str(summary.get("NOT_MET", 0)),
                    unit="count",
                    dataStatus=DataStatus.ISSUER_REPORTED,
                ),
            ],
            visualizations=[visualization],
            requirements=results,
            citations=[company.source_id, "src-esx-rulebook"],
            warnings=[PRE_REVIEW_DISCLAIMER],
            verificationStatus="PASSED",
            limitationNotice=LIMITATION_NOTICE,
        )

    def _build_category_summary(self, results: list[RequirementResult]) -> list[dict[str, int | str]]:
        buckets: dict[str, dict[str, int]] = {}
        for result in results:
            bucket = buckets.setdefault(result.category, {})
            bucket[result.state] = bucket.get(result.state, 0) + 1
        return [{"category": category, **counts} for category, counts in buckets.items()]
