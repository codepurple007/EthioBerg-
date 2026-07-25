"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import DataStatusBanner from "@/components/companies/DataStatusBanner";
import { FinancialTrendChart, PriceVolumeChart } from "@/components/companies/CompanyCharts";
import ReadinessCategoryChart from "@/components/companies/ReadinessCategoryChart";
import { DATA_STATUS_LABELS, downloadCsv } from "@/lib/companies/labels";
import { REQUIREMENT_STATE_LABELS } from "@/lib/readiness/labels";
import type { CompanyExploreResponse } from "@/lib/types";

const stateStyles: Record<string, string> = {
  MET: "bg-[#daf4f0] text-[#0ab39c]",
  NOT_MET: "bg-[#fde8e4] text-[#f06548]",
  MISSING_EVIDENCE: "bg-[#fef4e4] text-[#b8860b]",
  CONFLICT: "bg-[#fde8e4] text-[#f06548]",
  NOT_APPLICABLE: "bg-[#e2e5ed] text-[#878a99]",
  PROFESSIONAL_REVIEW: "bg-[#e1f0fa] text-[#299cdb]",
};

type ExploreResponsePanelProps = {
  response: CompanyExploreResponse;
  hideSyntheticCharts: boolean;
};

export default function ExploreResponsePanel({
  response,
  hideSyntheticCharts,
}: ExploreResponsePanelProps) {
  const [tableOpen, setTableOpen] = useState(false);
  const tableRows = useMemo(
    () => response.visualizations.flatMap((visualization) => visualization.tableRows),
    [response.visualizations],
  );

  function exportCsv() {
    downloadCsv(`${response.company.ticker}-${response.intent}.csv`, [
      ["Date", "Period", "Measure", "Value", "Unit", "Data status"],
      ...tableRows.map((row) => [
        row.date ?? "",
        row.period ?? "",
        row.measure,
        String(row.value),
        row.unit,
        DATA_STATUS_LABELS[row.dataStatus],
      ]),
    ]);
  }

  const showCharts =
    response.visualizations.length > 0 &&
    !(hideSyntheticCharts && response.dataStatus === "SYNTHETIC_DEMO");

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title m-0">{response.company.officialName}</h5>
      </div>
      <div className="card-body space-y-4">
        <DataStatusBanner
          dataStatus={response.dataStatus}
          asOf={response.asOf}
          warnings={response.warnings}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {response.metrics.map((metric) => (
            <div key={metric.label} className="rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-2">
              <p className="m-0 text-[11px] uppercase tracking-wide text-[#878a99]">{metric.label}</p>
              <p className="m-0 mt-1 text-[18px] font-semibold text-[#405189]">
                {metric.value} {metric.unit !== "count" ? metric.unit : ""}
              </p>
              <p className="m-0 mt-1 text-[11px] text-[#878a99]">
                {DATA_STATUS_LABELS[metric.dataStatus]}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#878a99]">
            Summary
          </p>
          <ul className="mb-0 list-disc pl-5 text-[13px] text-[#495057]">
            {response.summaryFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        {!showCharts && response.dataStatus === "UNAVAILABLE" ? (
          <div className="rounded border border-[#e9ebec] bg-[#f8f9fa] px-4 py-3 text-[13px] text-[#495057]">
            No chart is rendered because verified historical market data is unavailable. Official registry
            facts and metric cards are shown instead.
          </div>
        ) : null}

        {!showCharts && response.dataStatus === "SYNTHETIC_DEMO" ? (
          <div className="rounded border border-[#fff3cd] bg-[#fff8e6] px-4 py-3 text-[13px] text-[#856404]">
            Synthetic charts are hidden. Toggle “Show synthetic charts” to preview demo price and volume data.
          </div>
        ) : null}

        {showCharts
          ? response.visualizations.map((visualization) => (
              <div key={visualization.templateId} className="rounded border border-[#e9ebec] p-4">
                <div className="mb-3">
                  <h6 className="m-0 text-[14px] font-semibold text-[#495057]">{visualization.title}</h6>
                  {visualization.subtitle ? (
                    <p className="m-0 mt-1 text-[12px] text-[#878a99]">{visualization.subtitle}</p>
                  ) : null}
                </div>
                {visualization.templateId === "PRICE_VOLUME_V1" ? (
                  <PriceVolumeChart visualization={visualization} />
                ) : null}
                {visualization.templateId === "FINANCIAL_TREND_V1" ? (
                  <FinancialTrendChart visualization={visualization} />
                ) : null}
                {visualization.templateId === "READINESS_CATEGORY_V1" ? (
                  <ReadinessCategoryChart visualization={visualization} />
                ) : null}
              </div>
            ))
          : null}

        {response.requirements.length > 0 ? (
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#878a99]">
              Requirement checklist
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                    <th className="px-4 py-3 font-semibold text-[#878a99]">Requirement</th>
                    <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
                    <th className="px-4 py-3 font-semibold text-[#878a99]">Fact</th>
                    <th className="px-4 py-3 font-semibold text-[#878a99]">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {response.requirements.map((row) => (
                    <tr key={row.ruleId} className="border-b border-[#e9ebec] last:border-0">
                      <td className="px-4 py-3">{row.ruleName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold ${stateStyles[row.state] ?? "bg-[#e2e5ed] text-[#878a99]"}`}
                        >
                          {REQUIREMENT_STATE_LABELS[row.state] ?? row.state}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.factValue ?? "—"}</td>
                      <td className="px-4 py-3">{row.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tableRows.length > 0 ? (
          <div className="rounded border border-[#e9ebec]">
            <button
              type="button"
              onClick={() => setTableOpen((open) => !open)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-[13px] font-medium text-[#495057]">Underlying data table</span>
              {tableOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {tableOpen ? (
              <div className="border-t border-[#e9ebec] px-4 py-3">
                <button
                  type="button"
                  onClick={exportCsv}
                  className="mb-3 inline-flex items-center gap-2 rounded border border-[#405189] px-3 py-1.5 text-[12px] font-medium text-[#405189]"
                >
                  <Download size={14} />
                  Download CSV
                </button>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Period</th>
                        <th className="px-3 py-2">Measure</th>
                        <th className="px-3 py-2">Value</th>
                        <th className="px-3 py-2">Unit</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, index) => (
                        <tr key={`${row.measure}-${index}`} className="border-b border-[#e9ebec] last:border-0">
                          <td className="px-3 py-2">{row.date ?? "—"}</td>
                          <td className="px-3 py-2">{row.period ?? "—"}</td>
                          <td className="px-3 py-2">{row.measure}</td>
                          <td className="px-3 py-2">{row.value}</td>
                          <td className="px-3 py-2">{row.unit}</td>
                          <td className="px-3 py-2">{DATA_STATUS_LABELS[row.dataStatus]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="rounded border border-[#e9ebec] bg-[#f8f9fa] px-4 py-3 text-[12px] text-[#878a99]">
          <p className="m-0 font-medium text-[#495057]">Citations & limitations</p>
          <p className="m-0 mt-1">{response.limitationNotice}</p>
          {response.citations.length > 0 ? (
            <p className="m-0 mt-2">Sources: {response.citations.join(", ")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
