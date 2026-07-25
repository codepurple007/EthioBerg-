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
  IssuerDocument,
  MarketSegment,
  ReadinessEvaluateResponse,
  ReadinessFactInput,
  RegulatoryAskRequest,
  RequirementResult,
  RequirementState,
  RuleDefinition,
  SourceDocument,
  User,
} from "@/lib/types";
import { mockStore } from "@/lib/api/client";
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
  return {
    getDashboardStats: () => toPromise(mockStore.getDashboardStats()),
    getSources: () => toPromise(mockStore.getSources()),
    addSource: (input: AddSourceInput, forceDuplicate = false) =>
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
  };
}

let remoteAvailable: boolean | null = USE_MOCK ? false : null;

export async function resolveApiMode(): Promise<"remote" | "mock"> {
  if (USE_MOCK) return "mock";
  if (remoteAvailable === null) {
    remoteAvailable = await checkApiHealth();
  }
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
