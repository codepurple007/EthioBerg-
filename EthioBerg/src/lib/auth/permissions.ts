import type { AdminScope, User, UserRole } from "@/lib/types";

export type Permission =
  | "view_dashboard"
  | "view_public_information"
  | "review_documents"
  | "run_readiness"
  | "ask_basic_regulatory"
  | "ask_advanced_regulatory"
  | "inspect_retrieval_trace"
  | "explore_companies"
  | "export_reports"
  | "manage_sources"
  | "manage_scraper"
  | "manage_ingestion_config"
  | "manage_retrieval_config"
  | "view_retrieval_health"
  | "view_rag_quality"
  | "manage_safety_guardrails"
  | "approve_rules"
  | "manage_synthetic_demo"
  | "view_audit";

const rolePermissions: Record<UserRole, Permission[]> = {
  investor_educator: [
    "view_dashboard",
    "view_public_information",
    "ask_basic_regulatory",
    "explore_companies",
  ],
  financial_analyst: [
    "view_dashboard",
    "review_documents",
    "run_readiness",
    "ask_basic_regulatory",
    "ask_advanced_regulatory",
    "inspect_retrieval_trace",
    "explore_companies",
    "export_reports",
  ],
  administrator: [
    "view_dashboard",
    "review_documents",
    "run_readiness",
    "ask_basic_regulatory",
    "ask_advanced_regulatory",
    "inspect_retrieval_trace",
    "explore_companies",
    "export_reports",
  ],
};

const scopePermissions: Record<AdminScope, Permission[]> = {
  full_platform: [
    "manage_sources",
    "manage_scraper",
    "manage_ingestion_config",
    "manage_retrieval_config",
    "view_retrieval_health",
    "view_rag_quality",
    "manage_safety_guardrails",
    "approve_rules",
    "manage_synthetic_demo",
    "view_audit",
  ],
  ingestion_pipeline: ["manage_sources", "manage_scraper", "manage_ingestion_config"],
  search_retrieval: ["manage_retrieval_config", "view_retrieval_health"],
  ai_safety_quality: ["view_rag_quality", "manage_safety_guardrails", "view_audit"],
};

export function hasPermission(user: User, permission: Permission): boolean {
  if (rolePermissions[user.role]?.includes(permission)) return true;
  return (user.adminScopes ?? []).some((scope) => scopePermissions[scope].includes(permission));
}

export type MenuItem = {
  label: string;
  href: string;
  icon: string;
  permission?: Permission;
  adminOnly?: boolean;
};

export const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", permission: "view_dashboard" },
      { label: "Source Library", href: "/sources", icon: "Library", permission: "manage_sources" },
      { label: "Document Review", href: "/documents/review", icon: "FileSearch", permission: "review_documents" },
      { label: "Listing Readiness", href: "/readiness", icon: "ClipboardCheck", permission: "run_readiness" },
      { label: "Regulatory Q&A", href: "/regulatory-qa", icon: "MessageSquareQuote", permission: "ask_basic_regulatory" },
      { label: "Company Explorer", href: "/companies", icon: "Building2", permission: "explore_companies" },
      { label: "Reports", href: "/reports", icon: "FileOutput", permission: "export_reports" },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { label: "Web Scraper", href: "/admin/scraper", icon: "Globe", permission: "manage_scraper" },
      { label: "Ingestion", href: "/admin/ingestion", icon: "Library", permission: "manage_ingestion_config" },
      { label: "Retrieval Operations", href: "/admin/retrieval", icon: "Settings", permission: "manage_retrieval_config" },
      { label: "RAG Quality", href: "/admin/quality", icon: "ScrollText", permission: "view_rag_quality" },
      { label: "Settings", href: "/admin/settings", icon: "Settings", permission: "manage_synthetic_demo" },
      { label: "Audit Log", href: "/admin/audit", icon: "ScrollText", permission: "view_audit" },
    ],
  },
];

export function getMenuForUser(user: User) {
  return menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(user, item.permission);
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export const roleLabels: Record<UserRole, string> = {
  investor_educator: "Investor / Educator",
  financial_analyst: "Financial Analyst / Compliance Officer",
  administrator: "Administrator",
};

export const adminScopeLabels: Record<AdminScope, string> = {
  full_platform: "Platform Administrator",
  ingestion_pipeline: "Data & Ingestion Administrator",
  search_retrieval: "Search & Retrieval Administrator",
  ai_safety_quality: "AI Safety & Quality Administrator",
};

export const adminScopeShortLabels: Record<AdminScope, string> = {
  full_platform: "Full platform",
  ingestion_pipeline: "Data & ingestion",
  search_retrieval: "Search & retrieval",
  ai_safety_quality: "AI safety & quality",
};

/** Display title for a user, naming an administrator's area of responsibility. */
export function getRoleLabel(user: User): string {
  if (user.role !== "administrator") return roleLabels[user.role];

  const scopes = user.adminScopes ?? [];
  if (scopes.length === 0) return roleLabels.administrator;
  if (scopes.includes("full_platform")) return adminScopeLabels.full_platform;
  if (scopes.length === 1) return adminScopeLabels[scopes[0]];
  return `${scopes.map((scope) => adminScopeShortLabels[scope]).join(", ")} Administrator`;
}
