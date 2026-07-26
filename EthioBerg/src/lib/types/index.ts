export type UserRole =
  | "investor_educator"
  | "financial_analyst"
  | "administrator";

export type AdminScope =
  | "full_platform"
  | "ingestion_pipeline"
  | "search_retrieval"
  | "ai_safety_quality";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  adminScopes?: AdminScope[];
  status: "active" | "inactive";
};

export type TrustClass =
  | "official_regulatory"
  | "official_issuer_filing"
  | "user_draft"
  | "synthetic_fixture";

export type DataStatus =
  | "OFFICIAL"
  | "ISSUER_REPORTED"
  | "USER_SUPPLIED"
  | "SYNTHETIC_DEMO"
  | "UNAVAILABLE";

export type MarketSegment = "MAIN" | "GROWTH";

export type RequirementState =
  | "MET"
  | "NOT_MET"
  | "MISSING_EVIDENCE"
  | "CONFLICT"
  | "NOT_APPLICABLE"
  | "PROFESSIONAL_REVIEW";

export type SourceDocument = {
  id: string;
  title: string;
  issuingBody: "ECMA" | "ESX" | "FDRE" | "OTHER";
  version: string;
  publicationDate: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  language: "en" | "am";
  url: string;
  checksum: string;
  trustClass: TrustClass;
  indexStatus: "pending" | "indexed" | "retired";
  isActive: boolean;
};

export type Company = {
  id: string;
  officialName: string;
  aliases: string[];
  ticker: string;
  sector: string;
  segment: MarketSegment;
  listingDate: string;
  sourceId: string;
};

export type Security = {
  id: string;
  companyId: string;
  ticker: string;
  instrumentType: string;
  segment: MarketSegment;
  listingDate: string;
  sourceId: string;
};

export type RuleDefinition = {
  ruleId: string;
  name: string;
  segment: MarketSegment;
  field: string;
  operator: "GTE" | "LTE" | "GT" | "LT" | "EQ" | "RANGE";
  threshold: number;
  thresholdMax?: number;
  unit: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  sourceDocumentId: string;
  sourceSection: string;
  reviewStatus: "DRAFT" | "APPROVED";
  unknownResult: "MISSING_EVIDENCE";
};

export type ExtractedFact = {
  id: string;
  field: string;
  value: number | string | null;
  unit: string;
  period: string | null;
  sourcePage: number | null;
  sourceQuote: string | null;
  confidence: number;
  status: "EXTRACTED" | "USER_CONFIRMED" | "CONFLICT";
};

export type RequirementResult = {
  ruleId: string;
  ruleName: string;
  state: RequirementState;
  factValue: number | string | null;
  threshold: string;
  category: string;
  sourceSection?: string;
  calculation?: string | null;
};

export type Citation = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  section: string;
  page: number | null;
  quote: string;
  chunkId: string;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  result: "success" | "failure";
};

export type AnalysisRun = {
  id: string;
  type: "readiness" | "document_review" | "regulatory_qa" | "company_explorer";
  startedAt: string;
  status: "completed" | "in_progress" | "failed";
  userId: string;
  segment?: MarketSegment;
};

export type AppSettings = {
  syntheticDemoEnabled: boolean;
  activeRuleVersion: string;
  disclaimerText: string;
};

export type DashboardStats = {
  activeSources: number;
  pendingReviews: number;
  readinessRuns: number;
  qaSessions: number;
  registeredCompanies: number;
};

export type ControlledResponse = {
  responseId: string;
  intent: CompanyExploreIntent;
  company: Company;
  asOf: string;
  dataStatus: DataStatus;
  summaryFacts: string[];
  metrics: CompanyMetric[];
  visualizations: ChartVisualization[];
  requirements: RequirementResult[];
  citations: string[];
  warnings: string[];
  verificationStatus: "PASSED" | "FAILED" | "PENDING";
  limitationNotice: string;
};

export type CompanyExploreResponse = ControlledResponse;

export type CompanyExploreIntent =
  | "company_price_history"
  | "company_financial_trend"
  | "company_readiness";

export type CompanyExploreRequest = {
  query?: string;
  companyId?: string;
  intent: CompanyExploreIntent;
};

export type CompanyResolveResponse = {
  status: "RESOLVED" | "AMBIGUOUS" | "NOT_FOUND";
  company?: Company;
  candidates: Company[];
};

export type CompanyMetric = {
  label: string;
  value: string;
  unit: string;
  dataStatus: DataStatus;
};

export type ChartPoint = {
  date?: string;
  period?: string;
  value: number;
  dataStatus: DataStatus;
};

export type ChartSeries = {
  key: string;
  label: string;
  unit: string;
  dataStatus: DataStatus;
  fixtureId?: string;
  points: ChartPoint[];
};

export type ChartTableRow = {
  date?: string;
  period?: string;
  measure: string;
  value: number;
  unit: string;
  dataStatus: DataStatus;
};

export type ChartVisualization = {
  templateId: string;
  title: string;
  subtitle?: string;
  period: { start: string; end: string };
  dataStatus: DataStatus;
  fixtureId?: string;
  series: ChartSeries[];
  sourceRefs: string[];
  caveats: string[];
  tableRows: ChartTableRow[];
};

export type AddSourceInput = {
  title: string;
  issuingBody: SourceDocument["issuingBody"];
  version: string;
  publicationDate: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  language: SourceDocument["language"];
  url: string;
  checksum: string;
  trustClass: TrustClass;
};

export type AddSourceResult =
  | { ok: true; source: SourceDocument }
  | { ok: false; error: string; duplicateId?: string };

export type AuditLogFilters = {
  actorId?: string;
  action?: string;
  result?: AuditEvent["result"];
  from?: string;
  to?: string;
  search?: string;
};

export type ActorRef = {
  actorId: string;
  actorName: string;
};

export type ReadinessFactInput = {
  field: string;
  value: number | string | null;
  status?: "EXTRACTED" | "USER_CONFIRMED" | "CONFLICT";
};

export type ReadinessEvaluateResponse = {
  segment: MarketSegment;
  ruleVersion: string;
  results: RequirementResult[];
  summary: Record<string, number>;
  disclaimer: string;
};

export type IssuerDocument = {
  id: string;
  filename: string;
  checksum: string;
  segment: MarketSegment;
  mimeType: string;
  pageCount: number;
  uploadTimestamp: string;
  extractionStatus: "pending" | "extracted" | "failed";
  factsConfirmed: boolean;
  facts: ExtractedFact[];
  warnings: string[];
};

export type DocumentEvaluateResponse = ReadinessEvaluateResponse & {
  documentId: string;
  categorySummary: Array<Record<string, string | number>>;
};

export type WorkflowStep = "segment" | "upload" | "facts" | "results";

export type RegulatoryCitation = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  section: string;
  page: number | null;
  chunkId: string;
  quote: string;
};

export type RegulatoryAskRequest = {
  question: string;
  segment?: MarketSegment;
  language?: "en" | "am";
  effectiveAsOf?: string;
};

export type RegulatoryAskResponse = {
  question: string;
  answer: string | null;
  status: "ANSWERED" | "ABSTAINED";
  citations: RegulatoryCitation[];
  limitations: string[];
  retrievalTrace: Array<Record<string, string | number>>;
  verificationStatus: "PASSED" | "FAILED" | "ABSTAINED";
};

export type RegulatoryCorpusStats = {
  chunkCount: number;
  sourceCount: number;
  retrievalMode: string;
};

export type ScrapeSeed = {
  url: string;
  category: string;
};

export type ScraperConfig = {
  chunkSize: number;
  workers: number;
  requestTimeoutSec: number;
  maxPageBytes: number;
  userAgent: string;
  defaultRateDelayMs: number;
  seeds: ScrapeSeed[];
};

export type ScrapeArchiveDocument = {
  id: string;
  source_url: string;
  title: string;
  category: string;
  scraped_at: string;
  content: string;
};

export type IngestionSettings = {
  version: number;
  parentChunkChars: number;
  childChunkChars: number;
  chunkOverlapChars: number;
  tableAwareParsing: boolean;
  tableFlattenStrategy: string;
  ocrFallbackEnabled: boolean;
  ocrLanguages: string[];
  ocrMinTextChars: number;
  embeddingModel: string;
  notes: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
};

export type IngestionSettingsInput = Omit<
  IngestionSettings,
  "version" | "updatedAt" | "updatedBy" | "isActive"
>;

export type OcrCapability = {
  available: boolean;
  version: string;
  languages: string[];
  detail: string;
};

export type IngestionPipelineStats = {
  totalSources: number;
  indexedSources: number;
  pendingSources: number;
  retiredSources: number;
  corpusChunks: number;
  scrapeChunks: number;
  lastScrapeAt: string | null;
  ocr: OcrCapability;
};

export type ChunkPreviewItem = {
  index: number;
  role: "parent" | "child";
  charCount: number;
  preview: string;
};

export type ChunkPreview = {
  parentCount: number;
  childCount: number;
  items: ChunkPreviewItem[];
};

export type RetrievalBackend = "auto" | "hybrid" | "pinecone";

export type RetrievalSettings = {
  retrievalBackend: RetrievalBackend;
  topK: number;
  candidatePool: number;
  rrfK: number;
  bm25Weight: number;
  denseWeight: number;
  articleBoost: number;
  rerankEnabled: boolean;
  rerankTopN: number;
  minScore: number;
  updatedAt: string;
  updatedBy: string;
};

export type RetrievalSettingsInput = Omit<RetrievalSettings, "updatedAt" | "updatedBy">;

export type RetrievalComponentHealth = {
  name: string;
  status: "healthy" | "degraded" | "offline";
  detail: string;
};

export type RetrievalHealth = {
  retrievalMode: string;
  corpusChunks: number;
  sourceCount: number;
  activeSources: number;
  indexedSources: number;
  pineconeConfigured: boolean;
  pineconeServing: boolean;
  components: RetrievalComponentHealth[];
};

export type RetrievalProbeHit = {
  rank: number;
  chunkId: string;
  sourceTitle: string;
  section: string;
  fusedScore: number;
  bm25Score: number;
  denseScore: number;
  articleBoost: number;
  reranked: boolean;
  preview: string;
};

export type RetrievalProbeResult = {
  query: string;
  retrievalMode: string;
  latencyMs: number;
  candidatesConsidered: number;
  passedThreshold: boolean;
  settings: RetrievalSettings;
  hits: RetrievalProbeHit[];
};

export type GuardrailSettings = {
  requireCitationForAnswer: boolean;
  minCitationCount: number;
  blockSyntheticInAnswers: boolean;
  enforceDisclaimer: boolean;
  abstainOnLowConfidence: boolean;
  updatedAt: string;
  updatedBy: string;
};

export type GuardrailSettingsInput = Omit<GuardrailSettings, "updatedAt" | "updatedBy">;

export type EvalCaseResult = {
  caseId: string;
  question: string;
  expectation: "answer" | "abstain";
  status: string;
  passed: boolean;
  citationCount: number;
  expectedSourceHit: boolean;
  verificationStatus: string;
  latencyMs: number;
  topChunkId: string | null;
  failureReason: string | null;
};

export type RagQualityRun = {
  id: string;
  createdAt: string;
  actorName: string;
  retrievalMode: string;
  totalCases: number;
  passedCases: number;
  answerRate: number;
  abstentionRate: number;
  citationCoverage: number;
  expectedSourceRecall: number;
  verificationPassRate: number;
  avgLatencyMs: number;
  results: EvalCaseResult[];
};

export type EvaluationProgress = {
  running: boolean;
  runId: string | null;
  completed: number;
  total: number;
  startedAt: string | null;
  message: string;
};

export type RagQualityOverview = {
  guardrails: GuardrailSettings;
  caseCount: number;
  latestRun: RagQualityRun | null;
  history: RagQualityRun[];
  progress: EvaluationProgress;
};

export type ScraperStatus = {
  archive: {
    totalChunks: number;
    lastSyncDate: string | null;
    status: string;
    pineconeChunks?: number;
  };
  scrape: {
    running: boolean;
    jobId: string | null;
    pagesSynced: number;
    chunksSynced: number;
    logTail: string;
  };
  config: {
    seedCount: number;
    workers: number;
  };
};
