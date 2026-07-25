import type { DataStatus } from "@/lib/types";

export const DATA_STATUS_LABELS: Record<DataStatus, string> = {
  OFFICIAL: "Official",
  ISSUER_REPORTED: "Issuer-reported",
  USER_SUPPLIED: "User-supplied",
  SYNTHETIC_DEMO: "Synthetic demo",
  UNAVAILABLE: "Unavailable",
};

export const DATA_STATUS_STYLES: Record<DataStatus, string> = {
  OFFICIAL: "bg-[#daf4f0] text-[#0ab39c]",
  ISSUER_REPORTED: "bg-[#e1f0fa] text-[#299cdb]",
  USER_SUPPLIED: "bg-[#fef4e4] text-[#b8860b]",
  SYNTHETIC_DEMO: "bg-[#fff3cd] text-[#856404]",
  UNAVAILABLE: "bg-[#e2e5ed] text-[#878a99]",
};

export const EXPLORE_INTENT_LABELS = {
  company_price_history: "Price & volume history",
  company_financial_trend: "Financial trend",
  company_readiness: "Listing readiness view",
} as const;

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
