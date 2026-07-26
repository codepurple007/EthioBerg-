import type {
  AddSourceInput,
  AddSourceResult,
  AppSettings,
  AuditEvent,
  AuditLogFilters,
  ActorRef,
  Company,
  CompanyExploreRequest,
  DashboardStats,
  DocumentEvaluateResponse,
  ExtractedFact,
  GuardrailSettingsInput,
  IngestionSettingsInput,
  IssuerDocument,
  MarketSegment,
  ReadinessEvaluateResponse,
  ReadinessFactInput,
  RegulatoryAskRequest,
  RetrievalSettingsInput,
  ScraperConfig,
  RequirementResult,
  RequirementState,
  RuleDefinition,
  SourceDocument,
  User,
} from "@/lib/types";
import { mockStore } from "@/lib/api/client";
import { mockPlatformStore } from "@/lib/api/mock-platform";
import { mockDocumentStore } from "@/lib/api/mock-documents";
import { askMockRegulatoryQuestion, getMockRegulatoryCorpusStats } from "@/lib/api/mock-regulatory";
import { exploreMockCompany, resolveMockCompany } from "@/lib/api/mock-companies-explorer";
import { checkApiHealth, createHttpApi } from "@/lib/api/http-client";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function toPromise<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function buildMockResults(segment: MarketSegment, facts: ReadinessFactInput[]): RequirementResult[] {
  const rules = mockStore.getRules(segment).filter((r) => r.reviewStatus === "APPROVED");
  return rules.map((rule) => {
    const fact = facts.find((f) => f.field === rule.field);
    const value = fact?.value ?? null;
    let state: RequirementState = "MISSING_EVIDENCE";
    if (fact?.status === "CONFLICT") state = "CONFLICT";
    else if (value !== null && typeof value === "number") {
      state = value >= rule.threshold ? "MET" : "NOT_MET";
    }
    return {
      ruleId: rule.ruleId,
      ruleName: rule.name,
      state,
      factValue: value,
      threshold: `≥ ${rule.threshold} ${rule.unit}`,
      category: "General",
    };
  });
}

function createMockApi(actor?: ActorRef) {
  const actorName = () => actor?.actorName ?? "Demo Administrator";
  return {
    getDashboardStats: () => toPromise(mockStore.getDashboardStats()),
    getSources: () => toPromise(mockStore.getSources()),
    addSource: (input: AddSourceInput, _file: File, forceDuplicate = false) =>
      toPromise(mockStore.addSource(input, actor!, forceDuplicate)),
    activateSource: (id: string) => toPromise(mockStore.activateSource(id, actor!)),
    retireSource: (id: string) => toPromise(mockStore.retireSource(id, actor!)),
    indexSource: (id: string) => toPromise(mockStore.indexSource(id, actor!)),
    runRetrievalSmokeTest: (id: string) => toPromise(mockStore.runRetrievalSmokeTest(id, actor!)),
    getCompanies: () => toPromise(mockStore.getCompanies()),
    resolveCompany: (query: string) => toPromise(resolveMockCompany(query)),
    exploreCompany: (payload: CompanyExploreRequest) => toPromise(exploreMockCompany(payload)),
    getRules: (segment?: MarketSegment) => toPromise(mockStore.getRules(segment)),
    approveRule: async (ruleId: string) => {
      const rule = await toPromise(mockStore.approveRule(ruleId, actor!));
      if (!rule) throw new Error("Rule not found or already approved.");
      return rule;
    },
    getSettings: () => toPromise(mockStore.getSettings()),
    updateSettings: (partial: Partial<AppSettings>) =>
      toPromise(mockStore.updateSettings(partial, actor!)),
    getAuditLogs: (filters?: AuditLogFilters) => toPromise(mockStore.getAuditLogs(filters)),
    evaluateReadiness: (segment: MarketSegment, facts: ReadinessFactInput[]) => {
      const results = buildMockResults(segment, facts);
      return toPromise({
        segment,
        ruleVersion: mockStore.getSettings().activeRuleVersion,
        results,
        summary: results.reduce<Record<string, number>>((acc, row) => {
          acc[row.state] = (acc[row.state] ?? 0) + 1;
          return acc;
        }, {}),
        disclaimer: "Pre-review only — not ECMA or ESX approval.",
      } satisfies ReadinessEvaluateResponse);
    },
    listDocuments: () => toPromise(mockDocumentStore.list()),
    getDocument: (documentId: string) => toPromise(mockDocumentStore.get(documentId)),
    uploadDocument: (segment: MarketSegment, file: File) =>
      toPromise(mockDocumentStore.upload(file.name, segment)),
    extractDocument: (documentId: string) => toPromise(mockDocumentStore.extract(documentId)),
    updateDocumentFacts: (
      documentId: string,
      facts: ExtractedFact[],
      confirmForEvaluation: boolean,
    ) => toPromise(mockDocumentStore.updateFacts(documentId, facts, confirmForEvaluation)),
    evaluateDocument: async (documentId: string) => {
      const doc = mockDocumentStore.get(documentId);
      if (!doc.factsConfirmed) {
        throw new Error("Facts must be user-confirmed before evaluation.");
      }
      const results = buildMockResults(
        doc.segment,
        doc.facts.map((f) => ({
          field: f.field,
          value: f.value,
          status: f.status,
        })),
      );
      const summary = results.reduce<Record<string, number>>((acc, row) => {
        acc[row.state] = (acc[row.state] ?? 0) + 1;
        return acc;
      }, {});
      return {
        documentId,
        segment: doc.segment,
        ruleVersion: mockStore.getSettings().activeRuleVersion,
        results,
        summary,
        categorySummary: [{ category: "General", ...summary }],
        disclaimer: "Pre-review only — not ECMA or ESX approval.",
      } satisfies DocumentEvaluateResponse;
    },
    getRegulatoryCorpusStats: () => toPromise(getMockRegulatoryCorpusStats()),
    askRegulatoryQuestion: (payload: RegulatoryAskRequest) =>
      toPromise(askMockRegulatoryQuestion(payload)),
    getScraperConfig: () =>
      toPromise({
        chunkSize: 500,
        workers: 4,
        requestTimeoutSec: 10,
        maxPageBytes: 31457280,
        userAgent: "EthioBerg-WebScraper/1.0 (mock)",
        defaultRateDelayMs: 250,
        seeds: [{ url: "https://esx.et/", category: "esx.et" }],
      }),
    updateScraperConfig: (payload: ScraperConfig) => toPromise(payload),
    getScraperStatus: () =>
      toPromise({
        archive: { totalChunks: 0, lastSyncDate: null, status: "IDLE" },
        scrape: {
          running: false,
          status: "idle",
          jobId: null,
          pagesSynced: 0,
          chunksSynced: 0,
          startedAt: null,
          finishedAt: null,
          logTail: "",
        },
        config: { seedCount: 1, workers: 4 },
      }),
    getScraperDocuments: () =>
      toPromise({
        documents: [],
        pagination: { page: 1, pageSize: 20, totalPages: 1, totalChunks: 0 },
      }),
    startScraper: () => toPromise({ ok: true, message: "Mock scrape started." }),
    stopScraper: () => toPromise({ ok: true, message: "Mock scrape stopped." }),
    clearScraperArchive: () => toPromise({ ok: true, message: "Mock archive cleared." }),
    getIngestionSettings: () => toPromise(mockPlatformStore.getIngestionSettings()),
    updateIngestionSettings: (payload: IngestionSettingsInput) =>
      toPromise(mockPlatformStore.updateIngestionSettings(payload, actorName())),
    getIngestionVersions: () => toPromise(mockPlatformStore.getIngestionVersions()),
    restoreIngestionVersion: (version: number) =>
      toPromise(mockPlatformStore.restoreIngestionVersion(version, actorName())),
    getIngestionStats: () => toPromise(mockPlatformStore.getIngestionStats()),
    previewChunking: (text?: string) => toPromise(mockPlatformStore.previewChunking(text)),
    getRetrievalSettings: () => toPromise(mockPlatformStore.getRetrievalSettings()),
    updateRetrievalSettings: (payload: RetrievalSettingsInput) =>
      toPromise(mockPlatformStore.updateRetrievalSettings(payload, actorName())),
    getRetrievalHealth: () => toPromise(mockPlatformStore.getRetrievalHealth()),
    probeRetrieval: (query: string, _segment?: MarketSegment) =>
      toPromise(mockPlatformStore.probeRetrieval(query)),
    getQualityOverview: () => toPromise(mockPlatformStore.getQualityOverview()),
    startQualityEvaluation: () => {
      mockPlatformStore.runEvaluation(actorName());
      return toPromise({ ok: true, message: "Demo evaluation completed." });
    },
    getQualityProgress: () => toPromise(mockPlatformStore.getQualityProgress()),
    updateGuardrails: (payload: GuardrailSettingsInput) =>
      toPromise(mockPlatformStore.updateGuardrails(payload, actorName())),
  };
}

/** True when this build is pinned to demo data and should never call a backend. */
export const isMockForced = () => USE_MOCK;

let remoteAvailable = false;

export async function resolveApiMode(): Promise<"remote" | "mock"> {
  if (USE_MOCK) return "mock";
  // Only success is cached. A sleeping free-tier backend fails the first check
  // and needs about a minute to wake; caching that failure would strand the
  // session in demo data while the real API was coming up behind it.
  if (remoteAvailable) return "remote";
  remoteAvailable = await checkApiHealth();
  return remoteAvailable ? "remote" : "mock";
}

export function createEthioBergApi(actor?: ActorRef, mode: "remote" | "mock" = "remote") {
  if (mode === "mock" || !actor) {
    return createMockApi(actor);
  }
  return createHttpApi(actor);
}

export function getAuthApi() {
  return {
    authenticate: (email: string, password: string): User | null =>
      mockStore.authenticate(email, password),
    getAnalysisRuns: () => mockStore.getAnalysisRuns(),
  };
}

export type EthioBergApi = ReturnType<typeof createEthioBergApi>;
