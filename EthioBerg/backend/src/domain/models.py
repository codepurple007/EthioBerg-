from datetime import date
from typing import Any, Literal

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


class IngestionSettings(ApiModel):
    version: int = 1
    parent_chunk_chars: int = Field(default=2400, alias="parentChunkChars")
    child_chunk_chars: int = Field(default=600, alias="childChunkChars")
    chunk_overlap_chars: int = Field(default=80, alias="chunkOverlapChars")
    table_aware_parsing: bool = Field(default=True, alias="tableAwareParsing")
    table_flatten_strategy: str = Field(default="row_per_line", alias="tableFlattenStrategy")
    ocr_fallback_enabled: bool = Field(default=True, alias="ocrFallbackEnabled")
    ocr_languages: list[str] = Field(default_factory=lambda: ["eng", "amh"], alias="ocrLanguages")
    ocr_min_text_chars: int = Field(default=120, alias="ocrMinTextChars")
    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2", alias="embeddingModel")
    notes: str = ""
    updated_at: str = Field(default="", alias="updatedAt")
    updated_by: str = Field(default="system", alias="updatedBy")
    is_active: bool = Field(default=True, alias="isActive")


class IngestionSettingsInput(ApiModel):
    parent_chunk_chars: int = Field(default=2400, ge=400, le=8000, alias="parentChunkChars")
    child_chunk_chars: int = Field(default=600, ge=120, le=4000, alias="childChunkChars")
    chunk_overlap_chars: int = Field(default=80, ge=0, le=1000, alias="chunkOverlapChars")
    table_aware_parsing: bool = Field(default=True, alias="tableAwareParsing")
    table_flatten_strategy: str = Field(default="row_per_line", alias="tableFlattenStrategy")
    ocr_fallback_enabled: bool = Field(default=True, alias="ocrFallbackEnabled")
    ocr_languages: list[str] = Field(default_factory=lambda: ["eng", "amh"], alias="ocrLanguages")
    ocr_min_text_chars: int = Field(default=120, ge=0, le=5000, alias="ocrMinTextChars")
    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2", alias="embeddingModel")
    notes: str = ""


class IngestionPipelineStats(ApiModel):
    total_sources: int = Field(alias="totalSources")
    indexed_sources: int = Field(alias="indexedSources")
    pending_sources: int = Field(alias="pendingSources")
    retired_sources: int = Field(alias="retiredSources")
    corpus_chunks: int = Field(alias="corpusChunks")
    scrape_chunks: int = Field(alias="scrapeChunks")
    last_scrape_at: str | None = Field(default=None, alias="lastScrapeAt")


class ChunkPreviewItem(ApiModel):
    index: int
    role: str
    char_count: int = Field(alias="charCount")
    preview: str


class ChunkPreviewResponse(ApiModel):
    parent_count: int = Field(alias="parentCount")
    child_count: int = Field(alias="childCount")
    items: list[ChunkPreviewItem] = Field(default_factory=list)


class RetrievalSettings(ApiModel):
    retrieval_backend: str = Field(default="auto", alias="retrievalBackend")
    top_k: int = Field(default=5, alias="topK")
    candidate_pool: int = Field(default=40, alias="candidatePool")
    rrf_k: int = Field(default=60, alias="rrfK")
    bm25_weight: float = Field(default=1.0, alias="bm25Weight")
    dense_weight: float = Field(default=1.0, alias="denseWeight")
    article_boost: float = Field(default=0.5, alias="articleBoost")
    rerank_enabled: bool = Field(default=True, alias="rerankEnabled")
    rerank_top_n: int = Field(default=10, alias="rerankTopN")
    min_score: float = Field(default=0.012, alias="minScore")
    updated_at: str = Field(default="", alias="updatedAt")
    updated_by: str = Field(default="system", alias="updatedBy")


class RetrievalSettingsInput(ApiModel):
    retrieval_backend: Literal["auto", "hybrid", "pinecone"] = Field(
        default="auto", alias="retrievalBackend"
    )
    top_k: int = Field(default=5, ge=1, le=20, alias="topK")
    candidate_pool: int = Field(default=40, ge=5, le=200, alias="candidatePool")
    rrf_k: int = Field(default=60, ge=1, le=200, alias="rrfK")
    bm25_weight: float = Field(default=1.0, ge=0.0, le=5.0, alias="bm25Weight")
    dense_weight: float = Field(default=1.0, ge=0.0, le=5.0, alias="denseWeight")
    article_boost: float = Field(default=0.5, ge=0.0, le=5.0, alias="articleBoost")
    rerank_enabled: bool = Field(default=True, alias="rerankEnabled")
    rerank_top_n: int = Field(default=10, ge=1, le=50, alias="rerankTopN")
    min_score: float = Field(default=0.012, ge=0.0, le=1.0, alias="minScore")


class RetrievalComponentHealth(ApiModel):
    name: str
    status: str
    detail: str


class RetrievalHealth(ApiModel):
    retrieval_mode: str = Field(alias="retrievalMode")
    corpus_chunks: int = Field(alias="corpusChunks")
    source_count: int = Field(alias="sourceCount")
    active_sources: int = Field(alias="activeSources")
    indexed_sources: int = Field(alias="indexedSources")
    pinecone_configured: bool = Field(alias="pineconeConfigured")
    pinecone_serving: bool = Field(default=False, alias="pineconeServing")
    components: list[RetrievalComponentHealth] = Field(default_factory=list)


class RetrievalProbeRequest(ApiModel):
    query: str
    segment: MarketSegment | None = None
    language: str | None = None


class RetrievalProbeHit(ApiModel):
    rank: int
    chunk_id: str = Field(alias="chunkId")
    source_title: str = Field(alias="sourceTitle")
    section: str
    fused_score: float = Field(alias="fusedScore")
    bm25_score: float = Field(alias="bm25Score")
    dense_score: float = Field(alias="denseScore")
    article_boost: float = Field(alias="articleBoost")
    reranked: bool = False
    preview: str


class RetrievalProbeResponse(ApiModel):
    query: str
    retrieval_mode: str = Field(alias="retrievalMode")
    latency_ms: float = Field(alias="latencyMs")
    candidates_considered: int = Field(alias="candidatesConsidered")
    passed_threshold: bool = Field(alias="passedThreshold")
    settings: RetrievalSettings
    hits: list[RetrievalProbeHit] = Field(default_factory=list)


class GuardrailSettings(ApiModel):
    require_citation_for_answer: bool = Field(default=True, alias="requireCitationForAnswer")
    min_citation_count: int = Field(default=1, alias="minCitationCount")
    block_synthetic_in_answers: bool = Field(default=True, alias="blockSyntheticInAnswers")
    enforce_disclaimer: bool = Field(default=True, alias="enforceDisclaimer")
    abstain_on_low_confidence: bool = Field(default=True, alias="abstainOnLowConfidence")
    updated_at: str = Field(default="", alias="updatedAt")
    updated_by: str = Field(default="system", alias="updatedBy")


class GuardrailSettingsInput(ApiModel):
    require_citation_for_answer: bool = Field(default=True, alias="requireCitationForAnswer")
    min_citation_count: int = Field(default=1, ge=0, le=10, alias="minCitationCount")
    block_synthetic_in_answers: bool = Field(default=True, alias="blockSyntheticInAnswers")
    enforce_disclaimer: bool = Field(default=True, alias="enforceDisclaimer")
    abstain_on_low_confidence: bool = Field(default=True, alias="abstainOnLowConfidence")


class EvalCaseResult(ApiModel):
    case_id: str = Field(alias="caseId")
    question: str
    expectation: str
    status: str
    passed: bool
    citation_count: int = Field(alias="citationCount")
    expected_source_hit: bool = Field(alias="expectedSourceHit")
    verification_status: str = Field(alias="verificationStatus")
    latency_ms: float = Field(alias="latencyMs")
    top_chunk_id: str | None = Field(default=None, alias="topChunkId")
    failure_reason: str | None = Field(default=None, alias="failureReason")


class RagQualityRun(ApiModel):
    id: str
    created_at: str = Field(alias="createdAt")
    actor_name: str = Field(alias="actorName")
    retrieval_mode: str = Field(alias="retrievalMode")
    total_cases: int = Field(alias="totalCases")
    passed_cases: int = Field(alias="passedCases")
    answer_rate: float = Field(alias="answerRate")
    abstention_rate: float = Field(alias="abstentionRate")
    citation_coverage: float = Field(alias="citationCoverage")
    expected_source_recall: float = Field(alias="expectedSourceRecall")
    verification_pass_rate: float = Field(alias="verificationPassRate")
    avg_latency_ms: float = Field(alias="avgLatencyMs")
    results: list[EvalCaseResult] = Field(default_factory=list)


class EvaluationProgress(ApiModel):
    running: bool = False
    run_id: str | None = Field(default=None, alias="runId")
    completed: int = 0
    total: int = 0
    started_at: str | None = Field(default=None, alias="startedAt")
    message: str = ""


class RagQualityOverview(ApiModel):
    guardrails: GuardrailSettings
    case_count: int = Field(alias="caseCount")
    latest_run: RagQualityRun | None = Field(default=None, alias="latestRun")
    history: list[RagQualityRun] = Field(default_factory=list)
    progress: EvaluationProgress = Field(default_factory=EvaluationProgress)


class ScrapeSeedInput(ApiModel):
    url: str
    category: str = "web_scrape"


class ScraperConfigInput(ApiModel):
    chunk_size: int = Field(default=500, alias="chunkSize")
    workers: int = 4
    request_timeout_sec: int = Field(default=10, alias="requestTimeoutSec")
    max_page_bytes: int = Field(default=31457280, alias="maxPageBytes")
    user_agent: str = Field(default="EthioBerg-WebScraper/1.0", alias="userAgent")
    default_rate_delay_ms: int = Field(default=250, alias="defaultRateDelayMs")
    seeds: list[ScrapeSeedInput] = Field(default_factory=list)
