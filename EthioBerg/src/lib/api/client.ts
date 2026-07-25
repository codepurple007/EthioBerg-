import type {
  AddSourceInput,
  AddSourceResult,
  AnalysisRun,
  AppSettings,
  AuditEvent,
  AuditLogFilters,
  ActorRef,
  Company,
  DashboardStats,
  RuleDefinition,
  SourceDocument,
  User,
} from "@/lib/types";
import {
  analysisRuns,
  auditEvents,
  companies,
  defaultSettings,
  demoPasswords,
  demoUsers,
  ruleDefinitions,
  sourceDocuments,
} from "@/lib/mock/seed-data";

function nowIso() {
  return new Date().toISOString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

class MockStore {
  users = [...demoUsers];
  sources = [...sourceDocuments];
  companies = [...companies];
  rules = [...ruleDefinitions];
  auditLogs = [...auditEvents];
  runs = [...analysisRuns];
  settings = { ...defaultSettings };
  private auditCounter = auditEvents.length;

  private logAudit(
    actor: ActorRef,
    action: string,
    entityType: string,
    entityId: string,
    result: AuditEvent["result"] = "success",
  ) {
    this.auditCounter += 1;
    const event: AuditEvent = {
      id: `ae${this.auditCounter}`,
      timestamp: nowIso(),
      actorId: actor.actorId,
      actorName: actor.actorName,
      action,
      entityType,
      entityId,
      result,
    };
    this.auditLogs = [event, ...this.auditLogs];
    return event;
  }

  authenticate(email: string, password: string): User | null {
    const user = this.users.find((u) => u.email === email && u.status === "active");
    if (!user || demoPasswords[email] !== password) return null;
    return user;
  }

  getDashboardStats(): DashboardStats {
    return {
      activeSources: this.sources.filter((s) => s.isActive).length,
      pendingReviews: this.runs.filter((r) => r.status === "in_progress").length,
      readinessRuns: this.runs.filter((r) => r.type === "readiness").length,
      qaSessions: this.runs.filter((r) => r.type === "regulatory_qa").length,
      registeredCompanies: this.companies.length,
    };
  }

  getSources(): SourceDocument[] {
    return [...this.sources].sort((a, b) => a.title.localeCompare(b.title));
  }

  getSource(id: string): SourceDocument | undefined {
    return this.sources.find((s) => s.id === id);
  }

  findSourceByChecksum(checksum: string): SourceDocument | undefined {
    return this.sources.find((s) => s.checksum === checksum);
  }

  activateSource(id: string, actor: ActorRef): SourceDocument | null {
    const source = this.sources.find((s) => s.id === id);
    if (!source) return null;
    source.isActive = true;
    if (source.indexStatus === "retired") {
      source.indexStatus = "indexed";
    }
    this.logAudit(actor, "SOURCE_ACTIVATED", "SourceDocument", id);
    return source;
  }

  retireSource(id: string, actor: ActorRef): SourceDocument | null {
    const source = this.sources.find((s) => s.id === id);
    if (!source) return null;
    source.isActive = false;
    source.indexStatus = "retired";
    this.logAudit(actor, "SOURCE_RETIRED", "SourceDocument", id);
    return source;
  }

  indexSource(id: string, actor: ActorRef): SourceDocument | null {
    const source = this.sources.find((s) => s.id === id);
    if (!source) return null;
    source.indexStatus = "indexed";
    this.logAudit(actor, "SOURCE_INDEXED", "SourceDocument", id);
    return source;
  }

  runRetrievalSmokeTest(id: string, actor: ActorRef): { ok: boolean; message: string } {
    const source = this.sources.find((s) => s.id === id);
    if (!source) return { ok: false, message: "Source not found." };
    if (!source.isActive || source.indexStatus !== "indexed") {
      this.logAudit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", id, "failure");
      return {
        ok: false,
        message: "Source must be active and indexed before retrieval smoke test.",
      };
    }
    this.logAudit(actor, "RETRIEVAL_SMOKE_TEST", "SourceDocument", id);
    return {
      ok: true,
      message: `Smoke test passed for "${source.title}" — 3 sample clauses retrieved.`,
    };
  }

  addSource(input: AddSourceInput, actor: ActorRef, forceDuplicate = false): AddSourceResult {
    const duplicate = this.findSourceByChecksum(input.checksum);
    if (duplicate && !forceDuplicate) {
      return {
        ok: false,
        error: "A source with this checksum already exists. Confirm to create a separate version record.",
        duplicateId: duplicate.id,
      };
    }

    const id = `src-${slugify(input.title)}-${Date.now().toString(36)}`;
    const source: SourceDocument = {
      id,
      ...input,
      indexStatus: "pending",
      isActive: false,
    };
    this.sources = [source, ...this.sources];
    this.logAudit(actor, "SOURCE_ADDED", "SourceDocument", id);
    return { ok: true, source };
  }

  getCompanies(): Company[] {
    return this.companies;
  }

  getCompany(id: string): Company | undefined {
    return this.companies.find((c) => c.id === id);
  }

  resolveCompany(query: string): Company | undefined {
    const q = query.trim().toLowerCase();
    return this.companies.find(
      (c) =>
        c.officialName.toLowerCase().includes(q) ||
        c.ticker.toLowerCase() === q ||
        c.aliases.some((a) => a.toLowerCase() === q || a.toLowerCase().includes(q)),
    );
  }

  getRules(segment?: "MAIN" | "GROWTH"): RuleDefinition[] {
    if (segment) return this.rules.filter((r) => r.segment === segment);
    return this.rules;
  }

  approveRule(ruleId: string, actor: ActorRef): RuleDefinition | null {
    const rule = this.rules.find((r) => r.ruleId === ruleId);
    if (!rule || rule.reviewStatus === "APPROVED") return null;
    rule.reviewStatus = "APPROVED";
    this.logAudit(actor, "RULE_APPROVED", "RuleDefinition", ruleId);
    return rule;
  }

  getAuditLogs(filters?: AuditLogFilters): AuditEvent[] {
    let rows = [...this.auditLogs];
    if (filters?.actorId) {
      rows = rows.filter((e) => e.actorId === filters.actorId);
    }
    if (filters?.action) {
      rows = rows.filter((e) => e.action === filters.action);
    }
    if (filters?.result) {
      rows = rows.filter((e) => e.result === filters.result);
    }
    if (filters?.from) {
      const from = new Date(filters.from).getTime();
      rows = rows.filter((e) => new Date(e.timestamp).getTime() >= from);
    }
    if (filters?.to) {
      const to = new Date(filters.to).getTime();
      rows = rows.filter((e) => new Date(e.timestamp).getTime() <= to);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(
        (e) =>
          e.actorName.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.entityId.toLowerCase().includes(q) ||
          e.entityType.toLowerCase().includes(q),
      );
    }
    return rows.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  getAuditActions(): string[] {
    return [...new Set(this.auditLogs.map((e) => e.action))].sort();
  }

  getAnalysisRuns(): AnalysisRun[] {
    return this.runs;
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(partial: Partial<AppSettings>, actor: ActorRef): AppSettings {
    this.settings = { ...this.settings, ...partial };
    this.logAudit(actor, "SETTINGS_UPDATED", "AppSettings", "global");
    return { ...this.settings };
  }
}

export const mockStore = new MockStore();
export const api = mockStore;
