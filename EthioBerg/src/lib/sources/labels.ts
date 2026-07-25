import type { SourceDocument, TrustClass } from "@/lib/types";

export const trustClassLabels: Record<TrustClass, string> = {
  official_regulatory: "Official regulatory",
  official_issuer_filing: "Official issuer filing",
  user_draft: "User draft",
  synthetic_fixture: "Synthetic fixture",
};

export const trustClassStyles: Record<TrustClass, string> = {
  official_regulatory: "bg-[#e2e5ed] text-[#405189]",
  official_issuer_filing: "bg-[#daf4f0] text-[#0ab39c]",
  user_draft: "bg-[#fef4e4] text-[#b8860b]",
  synthetic_fixture: "bg-[#fde8e4] text-[#f06548]",
};

export const issuingBodyLabels: Record<SourceDocument["issuingBody"], string> = {
  ECMA: "ECMA",
  ESX: "ESX",
  FDRE: "FDRE",
  OTHER: "Other",
};

export const indexStatusLabels: Record<SourceDocument["indexStatus"], string> = {
  pending: "Pending index",
  indexed: "Indexed",
  retired: "Retired index",
};

export const indexStatusStyles: Record<SourceDocument["indexStatus"], string> = {
  pending: "bg-[#fef4e4] text-[#b8860b]",
  indexed: "bg-[#daf4f0] text-[#0ab39c]",
  retired: "bg-[#e2e5ed] text-[#878a99]",
};

export const auditActionLabels: Record<string, string> = {
  SOURCE_ACTIVATED: "Source activated",
  SOURCE_RETIRED: "Source retired",
  SOURCE_ADDED: "Source added",
  SOURCE_INDEXED: "Source indexed",
  RETRIEVAL_SMOKE_TEST: "Retrieval smoke test",
  SETTINGS_UPDATED: "Settings updated",
  RULE_APPROVED: "Rule approved",
  READINESS_RUN_STARTED: "Readiness run started",
  DOCUMENT_UPLOADED: "Document uploaded",
  DOCUMENT_EXTRACTED: "Document extracted",
  FACTS_CONFIRMED: "Facts confirmed",
};

export function formatChecksum(checksum: string) {
  if (checksum.length <= 16) return checksum;
  return `${checksum.slice(0, 8)}…${checksum.slice(-8)}`;
}

export async function computeFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
