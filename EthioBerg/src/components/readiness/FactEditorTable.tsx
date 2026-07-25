"use client";

import type { ExtractedFact } from "@/lib/types";
import { LISTING_FIELD_LABELS } from "@/lib/readiness/labels";

type FactEditorTableProps = {
  facts: ExtractedFact[];
  onChange: (facts: ExtractedFact[]) => void;
  readOnly?: boolean;
};

export default function FactEditorTable({ facts, onChange, readOnly = false }: FactEditorTableProps) {
  function updateFact(id: string, patch: Partial<ExtractedFact>) {
    onChange(facts.map((fact) => (fact.id === id ? { ...fact, ...patch } : fact)));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
            <th className="px-4 py-3 font-semibold text-[#878a99]">Field</th>
            <th className="px-4 py-3 font-semibold text-[#878a99]">Value</th>
            <th className="px-4 py-3 font-semibold text-[#878a99]">Unit</th>
            <th className="px-4 py-3 font-semibold text-[#878a99]">Evidence</th>
            <th className="px-4 py-3 font-semibold text-[#878a99]">Confidence</th>
            <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
          </tr>
        </thead>
        <tbody>
          {facts.map((fact) => (
            <tr key={fact.id} className="border-b border-[#e9ebec] align-top last:border-0">
              <td className="px-4 py-3 font-medium text-[#495057]">
                {LISTING_FIELD_LABELS[fact.field] ?? fact.field}
                <p className="m-0 mt-0.5 font-mono text-[11px] text-[#878a99]">{fact.field}</p>
              </td>
              <td className="px-4 py-3">
                {readOnly ? (
                  <span className="text-[#495057]">{fact.value ?? "—"}</span>
                ) : (
                  <input
                    value={fact.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const numeric = raw === "" ? null : Number(raw);
                      updateFact(fact.id, {
                        value: raw === "" || Number.isNaN(numeric!) ? raw || null : numeric,
                        status: "EXTRACTED",
                      });
                    }}
                    className="w-full min-w-[120px] rounded border border-[#e9ebec] px-2 py-1.5 text-[13px] outline-none focus:border-[#405189]"
                  />
                )}
              </td>
              <td className="px-4 py-3 text-[#878a99]">{fact.unit}</td>
              <td className="px-4 py-3 text-[#878a99]">
                {fact.sourcePage && <span className="block text-[11px]">Page {fact.sourcePage}</span>}
                <span className="block text-[12px] leading-relaxed text-[#495057]">
                  {fact.sourceQuote ?? "No evidence located."}
                </span>
              </td>
              <td className="px-4 py-3 text-[#495057]">
                {(fact.confidence * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${
                    fact.status === "USER_CONFIRMED"
                      ? "bg-[#daf4f0] text-[#0ab39c]"
                      : fact.status === "CONFLICT"
                        ? "bg-[#fde8e4] text-[#f06548]"
                        : "bg-[#fef4e4] text-[#b8860b]"
                  }`}
                >
                  {fact.status.replaceAll("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
