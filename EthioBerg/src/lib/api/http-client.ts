import { API_BASE_URL } from "@/lib/api/config";
import type {
  AddSourceInput,
  AddSourceResult,
  AppSettings,
  AuditEvent,
  AuditLogFilters,
  ActorRef,
  Company,
  CompanyExploreRequest,
  CompanyExploreResponse,
  CompanyResolveResponse,
  DashboardStats,
  DocumentEvaluateResponse,
  ExtractedFact,
  IssuerDocument,
  MarketSegment,
  ReadinessEvaluateResponse,
  ReadinessFactInput,
  RegulatoryAskRequest,
  RegulatoryAskResponse,
  RegulatoryCorpusStats,
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
    addSource: (input: AddSourceInput, forceDuplicate = false) =>
      request<AddSourceResult>(`/api/v1/sources?forceDuplicate=${forceDuplicate}`, {
        method: "POST",
        body: JSON.stringify(input),
      }, actor),
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
  };
}

export type HttpApi = ReturnType<typeof createHttpApi>;
