import type { UserRole } from "@/lib/types";

export type Permission =
  | "view_dashboard"
  | "manage_sources"
  | "review_documents"
  | "run_readiness"
  | "ask_regulatory"
  | "explore_companies"
  | "export_reports"
  | "admin_settings"
  | "view_audit";

const rolePermissions: Record<UserRole, Permission[]> = {
  listing_adviser: [
    "view_dashboard",
    "review_documents",
    "run_readiness",
    "ask_regulatory",
    "explore_companies",
    "export_reports",
  ],
  issuer: [
    "view_dashboard",
    "review_documents",
    "run_readiness",
    "ask_regulatory",
    "explore_companies",
  ],
  compliance_officer: [
    "view_dashboard",
    "review_documents",
    "run_readiness",
    "ask_regulatory",
    "explore_companies",
    "export_reports",
  ],
  investor: ["view_dashboard", "ask_regulatory", "explore_companies"],
  administrator: [
    "view_dashboard",
    "manage_sources",
    "review_documents",
    "run_readiness",
    "ask_regulatory",
    "explore_companies",
    "export_reports",
    "admin_settings",
    "view_audit",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
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
      { label: "Regulatory Q&A", href: "/regulatory-qa", icon: "MessageSquareQuote", permission: "ask_regulatory" },
      { label: "Company Explorer", href: "/companies", icon: "Building2", permission: "explore_companies" },
      { label: "Reports", href: "/reports", icon: "FileOutput", permission: "export_reports" },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "Settings", permission: "admin_settings" },
      { label: "Audit Log", href: "/admin/audit", icon: "ScrollText", permission: "view_audit" },
    ],
  },
];

export function getMenuForRole(role: UserRole) {
  return menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.permission) return true;
        return hasPermission(role, item.permission);
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export const roleLabels: Record<UserRole, string> = {
  listing_adviser: "Listing Adviser",
  issuer: "Prospective Issuer",
  compliance_officer: "Compliance Officer",
  investor: "Investor / Educator",
  administrator: "Administrator",
};
