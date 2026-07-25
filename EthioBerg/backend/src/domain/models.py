from datetime import date
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from src.domain.enums import (
    CompanyExploreIntent,
    DataStatus,
    FactStatus,
    IndexStatus,
    MarketSegment,
    RequirementState,
    ReviewStatus,
    RuleOperator,
    TrustClass,
)


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, use_enum_values=True)


class SourceDocument(ApiModel):
    id: str
    title: str
    issuing_body: str = Field(alias="issuingBody")
    version: str
    publication_date: str = Field(alias="publicationDate")
    effective_from: str = Field(alias="effectiveFrom")
    effective_to: str | None = Field(default=None, alias="effectiveTo")
    language: str
    url: str
    checksum: str
    trust_class: TrustClass = Field(alias="trustClass")
    index_status: IndexStatus = Field(alias="indexStatus")
    is_active: bool = Field(alias="isActive")


class AddSourceInput(ApiModel):
    title: str
    issuing_body: str = Field(alias="issuingBody")
    version: str
    publication_date: str = Field(alias="publicationDate")
    effective_from: str = Field(alias="effectiveFrom")
    effective_to: str | None = Field(default=None, alias="effectiveTo")
    language: str
    url: str = ""
    checksum: str
    trust_class: TrustClass = Field(alias="trustClass")


class Company(ApiModel):
    id: str
    official_name: str = Field(alias="officialName")
    aliases: list[str]
    ticker: str
    sector: str
    segment: MarketSegment
    listing_date: str = Field(alias="listingDate")
    source_id: str = Field(alias="sourceId")


class RuleDefinition(ApiModel):
    rule_id: str = Field(alias="ruleId")
    name: str
    segment: MarketSegment
    field: str
    operator: RuleOperator
    threshold: float
    threshold_max: float | None = Field(default=None, alias="thresholdMax")
    unit: str
    effective_from: str = Field(alias="effectiveFrom")
    effective_to: str | None = Field(default=None, alias="effectiveTo")
    source_document_id: str = Field(alias="sourceDocumentId")
    source_section: str = Field(alias="sourceSection")
    review_status: ReviewStatus = Field(alias="reviewStatus")
    unknown_result: RequirementState = Field(default=RequirementState.MISSING_EVIDENCE, alias="unknownResult")
    category: str = "General"


class RuleDefinitionFile(ApiModel):
    rules: list[RuleDefinition]


class ExtractedFactInput(ApiModel):
    field: str
    value: float | int | str | None = None
    status: FactStatus = FactStatus.EXTRACTED


class ExtractedFact(ApiModel):
    id: str
    field: str
    value: float | int | str | None = None
    unit: str
    period: str | None = None
    source_page: int | None = Field(default=None, alias="sourcePage")
    source_quote: str | None = Field(default=None, alias="sourceQuote")
    confidence: float
    status: FactStatus


class UpdateFactsInput(ApiModel):
    facts: list[ExtractedFact]
    confirm_for_evaluation: bool = Field(default=False, alias="confirmForEvaluation")


class IssuerDocument(ApiModel):
    id: str
    filename: str
    checksum: str
    segment: MarketSegment
    mime_type: str = Field(alias="mimeType")
    page_count: int = Field(alias="pageCount")
    upload_timestamp: str = Field(alias="uploadTimestamp")
    extraction_status: str = Field(alias="extractionStatus")
    facts_confirmed: bool = Field(alias="factsConfirmed")
    facts: list[ExtractedFact] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class RequirementResult(ApiModel):
    rule_id: str = Field(alias="ruleId")
    rule_name: str = Field(alias="ruleName")
    state: RequirementState
    fact_value: float | int | str | None = Field(alias="factValue")
    threshold: str
    category: str
    source_section: str = Field(alias="sourceSection")
    calculation: str | None = None


class DocumentEvaluateResponse(ApiModel):
    document_id: str = Field(alias="documentId")
    segment: MarketSegment
    rule_version: str = Field(alias="ruleVersion")
    results: list[RequirementResult]
    summary: dict[str, int]
    category_summary: list[dict[str, int | str]] = Field(alias="categorySummary")
    disclaimer: str


class ReadinessEvaluateRequest(ApiModel):
    segment: MarketSegment
    facts: list[ExtractedFactInput]
    as_of: date | None = None


class ReadinessEvaluateResponse(ApiModel):
    segment: MarketSegment
    rule_version: str = Field(alias="ruleVersion")
    results: list[RequirementResult]
    summary: dict[str, int]
    disclaimer: str


class AppSettings(ApiModel):
    synthetic_demo_enabled: bool = Field(alias="syntheticDemoEnabled")
    active_rule_version: str = Field(alias="activeRuleVersion")
    disclaimer_text: str = Field(alias="disclaimerText")


class UpdateSettingsInput(ApiModel):
    synthetic_demo_enabled: bool | None = Field(default=None, alias="syntheticDemoEnabled")
    active_rule_version: str | None = Field(default=None, alias="activeRuleVersion")


class AuditEvent(ApiModel):
    id: str
    timestamp: str
    actor_id: str = Field(alias="actorId")
    actor_name: str = Field(alias="actorName")
    action: str
    entity_type: str = Field(alias="entityType")
    entity_id: str = Field(alias="entityId")
    result: str


class ActorRef(ApiModel):
    actor_id: str = Field(alias="actorId")
    actor_name: str = Field(alias="actorName")


class DashboardStats(ApiModel):
    active_sources: int = Field(alias="activeSources")
    pending_reviews: int = Field(alias="pendingReviews")
    readiness_runs: int = Field(alias="readinessRuns")
    qa_sessions: int = Field(alias="qaSessions")
    registered_companies: int = Field(alias="registeredCompanies")


class MessageResponse(ApiModel):
    ok: bool
    message: str


class AddSourceResponse(ApiModel):
    ok: bool
    source: SourceDocument | None = None
    error: str | None = None
    duplicate_id: str | None = Field(default=None, alias="duplicateId")


class RegulatoryCitation(ApiModel):
    id: str
    source_id: str = Field(alias="sourceId")
    source_title: str = Field(alias="sourceTitle")
    section: str
    page: int | None = None
    chunk_id: str = Field(alias="chunkId")
    quote: str


class RegulatoryAskRequest(ApiModel):
    question: str
    segment: MarketSegment | None = None
    language: str | None = None
    effective_as_of: date | None = Field(default=None, alias="effectiveAsOf")


class RegulatoryAskResponse(ApiModel):
    question: str
    answer: str | None = None
    status: str
    citations: list[RegulatoryCitation] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    retrieval_trace: list[dict[str, float | str]] = Field(default_factory=list, alias="retrievalTrace")
    verification_status: str = Field(alias="verificationStatus")


class RegulatoryCorpusStats(ApiModel):
    chunk_count: int = Field(alias="chunkCount")
    source_count: int = Field(alias="sourceCount")
    retrieval_mode: str = Field(alias="retrievalMode")


class CompanyMetric(ApiModel):
    label: str
    value: str
    unit: str
    data_status: DataStatus = Field(alias="dataStatus")


class ChartPoint(ApiModel):
    date: str | None = None
    period: str | None = None
    value: float
    data_status: DataStatus = Field(alias="dataStatus")


class ChartSeries(ApiModel):
    key: str
    label: str
    unit: str
    data_status: DataStatus = Field(alias="dataStatus")
    fixture_id: str | None = Field(default=None, alias="fixtureId")
    points: list[ChartPoint]


class ChartTableRow(ApiModel):
    date: str | None = None
    period: str | None = None
    measure: str
    value: float
    unit: str
    data_status: DataStatus = Field(alias="dataStatus")


class ChartVisualization(ApiModel):
    template_id: str = Field(alias="templateId")
    title: str
    subtitle: str | None = None
    period: dict[str, str]
    data_status: DataStatus = Field(alias="dataStatus")
    fixture_id: str | None = Field(default=None, alias="fixtureId")
    series: list[ChartSeries] = Field(default_factory=list)
    source_refs: list[str] = Field(default_factory=list, alias="sourceRefs")
    caveats: list[str] = Field(default_factory=list)
    table_rows: list[ChartTableRow] = Field(default_factory=list, alias="tableRows")


class CompanyResolveResponse(ApiModel):
    status: str
    company: Company | None = None
    candidates: list[Company] = Field(default_factory=list)


class CompanyExploreRequest(ApiModel):
    query: str | None = None
    company_id: str | None = Field(default=None, alias="companyId")
    intent: CompanyExploreIntent


class CompanyExploreResponse(ApiModel):
    response_id: str = Field(alias="responseId")
    intent: CompanyExploreIntent
    company: Company
    as_of: str = Field(alias="asOf")
    data_status: DataStatus = Field(alias="dataStatus")
    summary_facts: list[str] = Field(default_factory=list, alias="summaryFacts")
    metrics: list[CompanyMetric] = Field(default_factory=list)
    visualizations: list[ChartVisualization] = Field(default_factory=list)
    requirements: list[RequirementResult] = Field(default_factory=list)
    citations: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    verification_status: str = Field(alias="verificationStatus")
    limitation_notice: str = Field(alias="limitationNotice")
