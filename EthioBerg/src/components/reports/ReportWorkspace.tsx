"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileOutput,
  FileText,
  Info,
  Loader2,
  Quote,
  ShieldAlert,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type { ReportCandidate, ReportCaveat, ReportPreview } from "@/lib/types";

const stateStyles: Record<string, { label: string; className: string }> = {
  MET: { label: "Met", className: "bg-[#daf4f0] text-[#0ab39c]" },
  NOT_MET: { label: "Not met", className: "bg-[#fdf0ee] text-[#f06548]" },
  MISSING_EVIDENCE: { label: "Missing evidence", className: "bg-[#fef4e4] text-[#856404]" },
  CONFLICT: { label: "Conflict", className: "bg-[#fdf0ee] text-[#f06548]" },
  PROFESSIONAL_REVIEW: { label: "Professional review", className: "bg-[#e1f0fa] text-[#299cdb]" },
  NOT_APPLICABLE: { label: "Not applicable", className: "bg-[#f8f9fa] text-[#878a99]" },
};

const caveatStyles: Record<ReportCaveat["severity"], string> = {
  critical: "border-[#f06548] bg-[#fdf0ee] text-[#f06548]",
  warning: "border-[#f7b84b] bg-[#fef4e4] text-[#856404]",
  info: "border-[#299cdb] bg-[#e1f0fa] text-[#495057]",
};

function stateBadge(state: string) {
  const style = stateStyles[state] ?? {
    label: state,
    className: "bg-[#f8f9fa] text-[#878a99]",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${style.className}`}>
      {style.label}
    </span>
  );
}

function formatValue(value: number | string | null): string {
  if (value === null) return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value;
}

function formatTimestamp(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function ReportWorkspace() {
  const { api, mode } = useEthioApi();
  const [candidates, setCandidates] = useState<ReportCandidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    const list = await api.getReportCandidates();
    setCandidates(list);
    setSelectedId((current) => current ?? list.find((item) => item.ready)?.documentId ?? null);
  }, [api]);

  useEffect(() => {
    setLoading(true);
    loadCandidates()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadCandidates]);

  useEffect(() => {
    if (!selectedId) {
      setPreview(null);
      return;
    }
    let active = true;
    setPreviewing(true);
    setError(null);
    api
      .getReportPreview(selectedId)
      .then((result) => {
        if (active) setPreview(result);
      })
      .catch((err: Error) => {
        if (active) {
          setPreview(null);
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) setPreviewing(false);
      });
    return () => {
      active = false;
    };
  }, [api, selectedId]);

  async function handleExport() {
    if (!selectedId) return;
    setExporting(true);
    setError(null);
    try {
      const { filename, blob } = await api.exportReportDocx(selectedId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setToast(`Downloaded ${filename}`);
      window.setTimeout(() => setToast(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not export the report.");
    } finally {
      setExporting(false);
    }
  }

  const selected = candidates.find((item) => item.documentId === selectedId) ?? null;

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[{ label: "EthioBerg", href: "/dashboard" }, { label: "Reports" }]}
      />

      {toast && (
        <div className="mb-4 flex items-start gap-2 rounded border border-[#0ab39c] bg-[#daf4f0] px-4 py-3 text-[13px] text-[#0ab39c]">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded border border-[#f06548] bg-[#fdf0ee] px-4 py-3 text-[13px] text-[#f06548]">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
        <div className="card h-fit">
          <div className="card-header">
            <h5 className="card-title inline-flex items-center gap-2">
              <FileText size={16} />
              Uploaded documents
            </h5>
          </div>
          <div className="card-body">
            {loading && <p className="m-0 text-[13px] text-[#878a99]">Loading documents…</p>}
            {!loading && candidates.length === 0 && (
              <p className="m-0 text-[13px] text-[#878a99]">
                No documents have been uploaded yet. Upload one under Listing Readiness, confirm
                its extracted figures, and it will appear here.
              </p>
            )}
            <ul className="m-0 list-none space-y-2 p-0">
              {candidates.map((candidate) => {
                const active = candidate.documentId === selectedId;
                return (
                  <li key={candidate.documentId}>
                    <button
                      type="button"
                      disabled={!candidate.ready}
                      onClick={() => setSelectedId(candidate.documentId)}
                      className={`w-full rounded border px-3 py-2 text-left text-[12px] transition-colors ${
                        active
                          ? "border-[#405189] bg-[#f0f2f8]"
                          : "border-[#e9ebec] bg-white hover:bg-[#f8f9fa]"
                      } ${candidate.ready ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                    >
                      <span className="block truncate font-medium text-[#495057]">
                        {candidate.filename}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#878a99]">
                        {candidate.segment} · {candidate.factCount} figure
                        {candidate.factCount === 1 ? "" : "s"} ·{" "}
                        {formatTimestamp(candidate.uploadTimestamp)}
                      </span>
                      {!candidate.ready && (
                        <span className="mt-1 block text-[11px] text-[#856404]">
                          {candidate.blockedReason}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {previewing && (
            <div className="card">
              <div className="card-body inline-flex items-center gap-2 text-[13px] text-[#878a99]">
                <Loader2 size={15} className="animate-spin" />
                Building report preview…
              </div>
            </div>
          )}

          {!previewing && !preview && !loading && (
            <div className="card">
              <div className="card-body text-[13px] text-[#878a99]">
                {selected
                  ? "This document is not ready for a report yet."
                  : "Select a document to preview its pre-review report."}
              </div>
            </div>
          )}

          {!previewing && preview && (
            <>
              <div className="card">
                <div className="card-header flex-wrap gap-2">
                  <h5 className="card-title inline-flex items-center gap-2">
                    <FileOutput size={16} />
                    Pre-review analysis report
                  </h5>
                  <button
                    type="button"
                    disabled={exporting}
                    onClick={() => void handleExport()}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#405189] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#364574] disabled:opacity-50"
                  >
                    {exporting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {exporting ? "Preparing…" : "Export DOCX"}
                  </button>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex items-start gap-2 rounded border border-[#f7b84b] bg-[#fef4e4] px-4 py-3">
                    <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[#b8860b]" />
                    <p className="m-0 text-[13px] leading-relaxed text-[#856404]">
                      {preview.disclaimer}
                    </p>
                  </div>

                  {mode === "mock" && (
                    <p className="m-0 rounded border border-[#f06548] bg-[#fdf0ee] px-3 py-2 text-[12px] text-[#f06548]">
                      Demo mode: this report is sample data and the export is a plain-text
                      placeholder, not a DOCX.
                    </p>
                  )}

                  <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px] md:grid-cols-4">
                    {[
                      ["Document", preview.filename],
                      ["Market segment", preview.segment],
                      ["Rule version", preview.ruleVersion],
                      ["Pages", String(preview.pageCount)],
                      ["Uploaded", formatTimestamp(preview.uploadTimestamp)],
                      ["Generated", formatTimestamp(preview.generatedAt)],
                      ["Generated by", preview.generatedBy],
                      ["Checksum", preview.checksum.slice(0, 16) + "…"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="m-0 text-[#878a99]">{label}</dt>
                        <dd className="m-0 mt-0.5 break-words font-medium text-[#495057]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(preview.summary).map(([state, count]) => (
                      <span
                        key={state}
                        className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium ${
                          stateStyles[state]?.className ?? "bg-[#f8f9fa] text-[#878a99]"
                        }`}
                      >
                        {stateStyles[state]?.label ?? state}
                        <span className="font-semibold">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Requirements</h5>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Requirement</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Outcome</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Value found</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Threshold</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.requirements.map((requirement) => (
                        <tr key={requirement.ruleId} className="border-b border-[#e9ebec]">
                          <td className="px-3 py-2 align-top text-[#495057]">
                            {requirement.ruleName}
                            <span className="mt-0.5 block text-[11px] text-[#878a99]">
                              {requirement.category}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">{stateBadge(requirement.state)}</td>
                          <td className="px-3 py-2 align-top text-[#495057]">
                            {formatValue(requirement.factValue)}
                          </td>
                          <td className="px-3 py-2 align-top text-[#495057]">
                            {requirement.threshold}
                          </td>
                          <td className="px-3 py-2 align-top text-[#878a99]">
                            {requirement.sourceSection}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title inline-flex items-center gap-2">
                    <Quote size={16} />
                    Evidence
                  </h5>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Figure</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Value</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Page</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Confidence</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Quotation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.evidence.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-[#878a99]">
                            No figures were traced to the source document.
                          </td>
                        </tr>
                      )}
                      {preview.evidence.map((item) => (
                        <tr key={item.field} className="border-b border-[#e9ebec]">
                          <td className="px-3 py-2 align-top text-[#495057]">{item.field}</td>
                          <td className="px-3 py-2 align-top text-[#495057]">
                            {formatValue(item.value)} {item.unit}
                          </td>
                          <td className="px-3 py-2 align-top text-[#878a99]">
                            {item.sourcePage ?? "not traced"}
                          </td>
                          <td className="px-3 py-2 align-top text-[#878a99]">
                            {Math.round(item.confidence * 100)}%
                          </td>
                          <td className="max-w-sm px-3 py-2 align-top text-[#878a99]">
                            {item.sourceQuote ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Citations</h5>
                  </div>
                  <div className="card-body">
                    <ul className="m-0 list-none space-y-3 p-0">
                      {preview.citations.map((citation) => (
                        <li
                          key={citation.ruleId}
                          className="border-b border-[#e9ebec] pb-3 text-[12px] last:border-0 last:pb-0"
                        >
                          <p className="m-0 font-medium text-[#495057]">{citation.ruleName}</p>
                          <p className="m-0 mt-0.5 text-[#878a99]">
                            {citation.sourceTitle} ({citation.issuingBody}) · {citation.section}
                          </p>
                          <p className="m-0 mt-0.5 text-[#878a99]">
                            Version {citation.sourceVersion}
                            {citation.publicationDate
                              ? ` · published ${citation.publicationDate}`
                              : ""}
                          </p>
                          {citation.url && (
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#405189] hover:underline"
                            >
                              {citation.url}
                            </a>
                          )}
                        </li>
                      ))}
                      {preview.citations.length === 0 && (
                        <li className="text-[12px] text-[#878a99]">
                          No citations are available for the rules applied.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Caveats and limitations</h5>
                  </div>
                  <div className="card-body space-y-2">
                    {preview.caveats.length === 0 && (
                      <p className="m-0 inline-flex items-start gap-2 text-[12px] text-[#0ab39c]">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                        Every requirement was assessed against a confirmed figure traced to the
                        document.
                      </p>
                    )}
                    {preview.caveats.map((caveat, index) => (
                      <div
                        key={`${caveat.severity}-${index}`}
                        className={`flex items-start gap-2 rounded border px-3 py-2 text-[12px] ${caveatStyles[caveat.severity]}`}
                      >
                        {caveat.severity === "info" ? (
                          <Info size={15} className="mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                        )}
                        <span>{caveat.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
