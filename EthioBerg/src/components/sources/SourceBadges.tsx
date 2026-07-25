import type { SourceDocument, TrustClass } from "@/lib/types";
import {
  indexStatusLabels,
  indexStatusStyles,
  trustClassLabels,
  trustClassStyles,
} from "@/lib/sources/labels";

export function TrustClassBadge({ trustClass }: { trustClass: TrustClass }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${trustClassStyles[trustClass]}`}
    >
      {trustClassLabels[trustClass]}
    </span>
  );
}

export function IndexStatusBadge({ status }: { status: SourceDocument["indexStatus"] }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${indexStatusStyles[status]}`}
    >
      {indexStatusLabels[status]}
    </span>
  );
}

export function ActiveStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${
        isActive ? "bg-[#daf4f0] text-[#0ab39c]" : "bg-[#e2e5ed] text-[#878a99]"
      }`}
    >
      {isActive ? "Active" : "Retired"}
    </span>
  );
}
