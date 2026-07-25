import { API_BASE_URL } from "@/lib/api/config";
import type {
  AddSourceInput,
  AddSourceResult,
  AppSettings,
  AuditEvent,
  AuditLogFilters,
  ActorRef,
  ChunkPreview,
  Company,
  CompanyExploreRequest,
  CompanyExploreResponse,
  CompanyResolveResponse,
  DashboardStats,
  DocumentEvaluateResponse,
  EvaluationProgress,
  ExtractedFact,
  GuardrailSettings,
  GuardrailSettingsInput,
  IngestionPipelineStats,
  IngestionSettings,
  IngestionSettingsInput,
  IssuerDocument,
  MarketSegment,
  RagQualityOverview,
  ReadinessEvaluateResponse,
  ReadinessFactInput,
  RegulatoryAskRequest,
  RegulatoryAskResponse,
  RegulatoryCorpusStats,
  RetrievalHealth,
  RetrievalProbeResult,
  RetrievalSettings,
  RetrievalSettingsInput,
  ScraperConfig,
  ScraperStatus,
  RuleDefinition,
  SourceDocument,
} from "@/lib/types";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  actor?: ActorRef,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (actor) {
    headers["X-Actor-Id"] = actor.actorId;
    headers["X-Actor-Name"] = actor.actorName;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

async function requestForm<T>(path: string, form: FormData, actor?: ActorRef): Promise<T> {
  const headers: Record<string, string> = {};
  if (actor) {
    headers["X-Actor-Id"] = actor.actorId;
    headers["X-Actor-Name"] = actor.actorName;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { method: "POST", body: form, headers });
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, response.status);
  }
  return (await response.json()) as T;
}

export function createHttpApi(actor?: ActorRef) {
  return {
    getDashboardStats: () => request<DashboardStats>("/api/v1/dashboard/stats"),
    getSources: () => request<SourceDocument[]>("/api/v1/sources"),
    addSource: (input: AddSourceInput, file: File, forceDuplicate = false) => {
      const form = new FormData();
      form.append("title", input.title);
      form.append("issuingBody", input.issuingBody);
      form.append("version", input.version);
      form.append("publicationDate", input.publicationDate);
      form.append("effectiveFrom", input.effectiveFrom);
      if (input.effectiveTo) form.append("effectiveTo", input.effectiveTo);
      form.append("language", input.language);
      if (input.url) form.append("url", input.url);
      form.append("checksum", input.checksum);
      form.append("trustClass", input.trustClass);
      form.append("file", file);
      return requestForm<AddSourceResult>(
        `/api/v1/sources/upload?forceDuplicate=${forceDuplicate}`,
        form,
        actor,
      );
    },
    activateSource: (id: string) =>
      request<SourceDocument>(`/api/v1/sources/${id}/activate`, { method: "PATCH" }, actor),
    retireSource: (id: string) =>
      request<SourceDocument>(`/api/v1/sources/${id}/retire`, { method: "PATCH" }, actor),
    indexSource: (id: string) =>
      request<SourceDocument>(`/api/v1/sources/${id}/index`, { method: "PATCH" }, actor),
    runRetrievalSmokeTest: (id: string) =>
      request<{ ok: boolean; message: string }>(`/api/v1/sources/${id}/smoke-test`, {
        method: "POST",
      }, actor),
    getCompanies: () => request<Company[]>("/api/v1/companies"),
    resolveCompany: (query: string) =>
      request<CompanyResolveResponse>(`/api/v1/companies/resolve?query=${encodeURIComponent(query)}`),
    exploreCompany: (payload: CompanyExploreRequest) =>
      request<CompanyExploreResponse>("/api/v1/companies/explore", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getRules: (segment?: MarketSegment) =>
      request<RuleDefinition[]>(
        segment ? `/api/v1/rules?segment=${segment}` : "/api/v1/rules",
      ),
    approveRule: (ruleId: string) =>
      request<RuleDefinition>(`/api/v1/rules/${ruleId}/approve`, { method: "PATCH" }, actor),
    getSettings: () => request<AppSettings>("/api/v1/settings"),
    updateSettings: (partial: Partial<AppSettings>) =>
      request<AppSettings>("/api/v1/settings", {
        method: "PATCH",
        body: JSON.stringify(partial),
      }, actor),
    getAuditLogs: (filters?: AuditLogFilters) => {
      const params = new URLSearchParams();
      if (filters?.actorId) params.set("actorId", filters.actorId);
      if (filters?.action) params.set("action", filters.action);
      if (filters?.result) params.set("result", filters.result);
      if (filters?.search) params.set("search", filters.search);
      const query = params.toString();
      return request<AuditEvent[]>(`/api/v1/audit${query ? `?${query}` : ""}`);
    },
    evaluateReadiness: (segment: MarketSegment, facts: ReadinessFactInput[]) =>
      request<ReadinessEvaluateResponse>("/api/v1/readiness/evaluate", {
        method: "POST",
        body: JSON.stringify({ segment, facts }),
      }),
    listDocuments: () => request<IssuerDocument[]>("/api/v1/documents"),
    getDocument: (documentId: string) =>
      request<IssuerDocument>(`/api/v1/documents/${documentId}`),
    uploadDocument: (segment: MarketSegment, file: File) => {
      const form = new FormData();
      form.append("segment", segment);
      form.append("file", file);
      return requestForm<IssuerDocument>("/api/v1/documents/upload", form, actor);
    },
    extractDocument: (documentId: string) =>
      request<IssuerDocument>(`/api/v1/documents/${documentId}/extract`, { method: "POST" }, actor),
    updateDocumentFacts: (
      documentId: string,
      facts: ExtractedFact[],
      confirmForEvaluation: boolean,
    ) =>
      request<IssuerDocument>(`/api/v1/documents/${documentId}/facts`, {
        method: "PUT",
        body: JSON.stringify({ facts, confirmForEvaluation }),
      }, actor),
    evaluateDocument: (documentId: string) =>
      request<DocumentEvaluateResponse>(
        `/api/v1/documents/${documentId}/evaluate`,
        { method: "POST" },
        actor,
      ),
    getRegulatoryCorpusStats: () =>
      request<RegulatoryCorpusStats>("/api/v1/regulatory/corpus/stats"),
    askRegulatoryQuestion: (payload: RegulatoryAskRequest) =>
      request<RegulatoryAskResponse>("/api/v1/regulatory/ask", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getScraperConfig: () => request<Record<string, unknown>>("/api/v1/scraper/config"),
    updateScraperConfig: (payload: ScraperConfig) =>
      request<Record<string, unknown>>("/api/v1/scraper/config", {
        method: "PUT",
        body: JSON.stringify(payload),
      }, actor),
    getScraperStatus: () => request<ScraperStatus>("/api/v1/scraper/status"),
    getScraperDocuments: (page = 1) =>
      request<{
        documents: Array<Record<string, string>>;
        pagination: { page: number; pageSize: number; totalPages: number; totalChunks: number };
      }>(`/api/v1/scraper/documents?page=${page}&pageSize=20`),
    startScraper: () =>
      request<{ ok: boolean; message: string }>("/api/v1/scraper/run", { method: "POST" }, actor),
    stopScraper: () =>
      request<{ ok: boolean; message: string }>("/api/v1/scraper/run", { method: "DELETE" }, actor),
    clearScraperArchive: () =>
      request<{ ok: boolean; message: string }>("/api/v1/scraper/archive", { method: "DELETE" }, actor),
    getIngestionSettings: () => request<IngestionSettings>("/api/v1/ingestion/settings"),
    updateIngestionSettings: (payload: IngestionSettingsInput) =>
      request<IngestionSettings>("/api/v1/ingestion/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      }, actor),
    getIngestionVersions: () => request<IngestionSettings[]>("/api/v1/ingestion/settings/versions"),
    restoreIngestionVersion: (version: number) =>
      request<IngestionSettings>(
        `/api/v1/ingestion/settings/versions/${version}/restore`,
        { method: "POST" },
        actor,
      ),
    getIngestionStats: () => request<IngestionPipelineStats>("/api/v1/ingestion/stats"),
    previewChunking: (text?: string) =>
      request<ChunkPreview>("/api/v1/ingestion/preview", {
        method: "POST",
        body: JSON.stringify(text ? { text } : {}),
      }),
    getRetrievalSettings: () => request<RetrievalSettings>("/api/v1/retrieval/settings"),
    updateRetrievalSettings: (payload: RetrievalSettingsInput) =>
      request<RetrievalSettings>("/api/v1/retrieval/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      }, actor),
    getRetrievalHealth: () => request<RetrievalHealth>("/api/v1/retrieval/health"),
    probeRetrieval: (query: string, segment?: MarketSegment) =>
      request<RetrievalProbeResult>("/api/v1/retrieval/probe", {
        method: "POST",
        body: JSON.stringify({ query, segment: segment ?? null }),
      }),
    getQualityOverview: () => request<RagQualityOverview>("/api/v1/quality/overview"),
    startQualityEvaluation: () =>
      request<{ ok: boolean; message: string }>("/api/v1/quality/evaluate", { method: "POST" }, actor),
    getQualityProgress: () => request<EvaluationProgress>("/api/v1/quality/progress"),
    updateGuardrails: (payload: GuardrailSettingsInput) =>
      request<GuardrailSettings>("/api/v1/quality/guardrails", {
        method: "PUT",
        body: JSON.stringify(payload),
      }, actor),
  };
}

export type HttpApi = ReturnType<typeof createHttpApi>;
