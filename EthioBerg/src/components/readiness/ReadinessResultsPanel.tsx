"use client";

import { useMemo, useState } from "react";
import type { DocumentEvaluateResponse, RequirementState } from "@/lib/types";
import { REQUIREMENT_STATE_LABELS } from "@/lib/readiness/labels";

const stateStyles: Record<RequirementState, string> = {
  MET: "bg-[#daf4f0] text-[#0ab39c]",
  NOT_MET: "bg-[#fde8e4] text-[#f06548]",
  MISSING_EVIDENCE: "bg-[#fef4e4] text-[#b8860b]",
  CONFLICT: "bg-[#fde8e4] text-[#f06548]",
  NOT_APPLICABLE: "bg-[#e2e5ed] text-[#878a99]",
  PROFESSIONAL_REVIEW: "bg-[#e1f0fa] text-[#299cdb]",
};

const barColors: Record<string, string> = {
  MET: "bg-[#0ab39c]",
  NOT_MET: "bg-[#f06548]",
  MISSING_EVIDENCE: "bg-[#f7b84b]",
  PROFESSIONAL_REVIEW: "bg-[#299cdb]",
  CONFLICT: "bg-[#f06548]",
};

type FilterState = RequirementState | "ALL";

export default function ReadinessResultsPanel({ result }: { result: DocumentEvaluateResponse }) {
  const [filter, setFilter] = useState<FilterState>("ALL");

  const filteredResults = useMemo(() => {
    if (filter === "ALL") return result.results;
    return result.results.filter((row) => row.state === filter);
  }, [filter, result.results]);

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(result.summary).map(([state, count]) => (
          <div key={state} className="card">
            <div className="card-body py-3">
              <p className="mb-1 text-[11px] uppercase tracking-wide text-[#878a99]">
                {REQUIREMENT_STATE_LABELS[state] ?? state}
              </p>
              <p className="m-0 text-[22px] font-semibold text-[#495057]">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {result.categorySummary.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Readiness by category</h5>
          </div>
          <div className="card-body space-y-4">
            {result.categorySummary.map((row) => {
              const total = Object.entries(row)
                .filter(([key]) => key !== "category")
                .reduce((sum, [, value]) => sum + Number(value ?? 0), 0);
              return (
                <div key={String(row.category)}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-[#495057]">{String(row.category)}</span>
                    <span className="text-[#878a99]">{total} requirements</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded bg-[#f3f3f9]">
                    {Object.entries(row)
                      .filter(([key]) => key !== "category" && Number(row[key] ?? 0) > 0)
                      .map(([state, value]) => (
                        <div
                          key={state}
                          className={`${barColors[state] ?? "bg-[#878a99]"}`}
                          style={{ width: `${(Number(value) / Math.max(total, 1)) * 100}%` }}
                          title={`${REQUIREMENT_STATE_LABELS[state] ?? state}: ${value}`}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header flex-wrap gap-3">
          <h5 className="card-title">
            Requirement checklist · rule version {result.ruleVersion}
          </h5>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterState)}
            className="rounded border border-[#e9ebec] px-3 py-1.5 text-[12px] outline-none focus:border-[#405189]"
          >
            <option value="ALL">All statuses</option>
            {Object.keys(REQUIREMENT_STATE_LABELS).map((state) => (
              <option key={state} value={state}>
                {REQUIREMENT_STATE_LABELS[state]}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                <th className="px-4 py-3 font-semibold text-[#878a99]">Requirement</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Fact</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Threshold</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row) => (
                <tr key={row.ruleId} className="border-b border-[#e9ebec] last:border-0">
                  <td className="px-4 py-3">
                    <p className="m-0 font-medium text-[#495057]">{row.ruleName}</p>
                    <p className="m-0 mt-0.5 font-mono text-[11px] text-[#878a99]">{row.ruleId}</p>
                    {row.sourceSection && (
                      <p className="m-0 mt-1 text-[11px] text-[#878a99]">{row.sourceSection}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${stateStyles[row.state]}`}
                    >
                      {REQUIREMENT_STATE_LABELS[row.state] ?? row.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#495057]">{row.factValue ?? "—"}</td>
                  <td className="px-4 py-3 text-[#878a99]">{row.threshold}</td>
                  <td className="px-4 py-3 text-[#878a99]">{row.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#e9ebec] px-4 py-3 text-[12px] text-[#856404]">
          {result.disclaimer}
        </div>
      </div>
    </>
  );
}
