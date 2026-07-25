import type { DataStatus } from "@/lib/types";
import { DATA_STATUS_LABELS, DATA_STATUS_STYLES } from "@/lib/companies/labels";

type DataStatusBannerProps = {
  dataStatus: DataStatus;
  asOf: string;
  warnings?: string[];
};

export default function DataStatusBanner({ dataStatus, asOf, warnings = [] }: DataStatusBannerProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded border border-[#e9ebec] bg-white px-4 py-3">
        <span
          className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${DATA_STATUS_STYLES[dataStatus]}`}
        >
          {DATA_STATUS_LABELS[dataStatus]}
        </span>
        <span className="text-[12px] text-[#878a99]">As of {new Date(asOf).toLocaleString("en-ET")}</span>
        {dataStatus === "SYNTHETIC_DEMO" ? (
          <span className="text-[12px] font-medium text-[#856404]">
            Synthetic demo data — not ESX market data.
          </span>
        ) : null}
      </div>
      {warnings.map((warning) => (
        <div
          key={warning}
          className="rounded border border-[#f7b84b]/40 bg-[#fff8e6] px-4 py-2 text-[12px] text-[#856404]"
        >
          {warning}
        </div>
      ))}
    </div>
  );
}
