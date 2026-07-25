"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Loader2,
  Play,
  TableProperties,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FactEditorTable from "@/components/readiness/FactEditorTable";
import ReadinessResultsPanel from "@/components/readiness/ReadinessResultsPanel";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  DocumentEvaluateResponse,
  IssuerDocument,
  MarketSegment,
  WorkflowStep,
} from "@/lib/types";

const steps: { id: WorkflowStep; label: string; icon: React.ReactNode }[] = [
  { id: "segment", label: "Segment", icon: <ClipboardCheck size={14} /> },
  { id: "upload", label: "Upload", icon: <FileUp size={14} /> },
  { id: "facts", label: "Confirm facts", icon: <TableProperties size={14} /> },
  { id: "results", label: "Results", icon: <Play size={14} /> },
];

export default function ReadinessWorkflow() {
  const { api, mode } = useEthioApi();
  const [step, setStep] = useState<WorkflowStep>("segment");
  const [segment, setSegment] = useState<MarketSegment>("MAIN");
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<IssuerDocument | null>(null);
  const [facts, setFacts] = useState<IssuerDocument["facts"]>([]);
  const [result, setResult] = useState<DocumentEvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUploadAndExtract() {
    if (!file) {
      setError("Select a PDF or DOCX issuer document.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const uploaded = await api.uploadDocument(segment, file);
      const extracted = await api.extractDocument(uploaded.id);
      setDocument(extracted);
      setFacts(extracted.facts);
      setStep("facts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload or extraction failed.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmFacts() {
    if (!document) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateDocumentFacts(document.id, facts, true);
      setDocument(updated);
      setFacts(updated.facts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm facts.");
    } finally {
      setLoading(false);
    }
  }

  async function runEvaluation() {
    if (!document) return;
    setLoading(true);
    setError(null);
    try {
      if (!document.factsConfirmed) {
        const updated = await api.updateDocumentFacts(document.id, facts, true);
        setDocument(updated);
      }
      const evaluation = await api.evaluateDocument(document.id);
      setResult(evaluation);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Listing Readiness"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Listing Readiness" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Full issuer-review flow: upload → extract → confirm facts → deterministic rule evaluation.
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {steps.map((item) => (
          <span
            key={item.id}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium ${
              step === item.id
                ? "bg-[#405189] text-white"
                : "bg-white text-[#878a99] border border-[#e9ebec]"
            }`}
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded border border-[#f7b84b] bg-[#fef4e4] px-4 py-3 text-[13px] text-[#856404]">
          {error}
        </div>
      )}

      {step === "segment" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">1. Select listing segment</h5>
          </div>
          <div className="card-body space-y-4">
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as MarketSegment)}
              className="rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
            >
              <option value="MAIN">ESX Main Market</option>
              <option value="GROWTH">ESX Growth Market</option>
            </select>
            <button
              type="button"
              onClick={() => setStep("upload")}
              className="cursor-pointer rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              Continue to upload
            </button>
          </div>
        </div>
      )}

      {step === "upload" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">2. Upload issuer document</h5>
          </div>
          <div className="card-body space-y-4">
            <p className="m-0 text-[13px] text-[#878a99]">
              Accepted formats: PDF (primary) and DOCX. Files are checksum-stamped and parsed
              page-by-page before structured fact extraction.
            </p>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-[13px]"
            />
            {file && (
              <p className="m-0 text-[12px] text-[#495057]">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => void handleUploadAndExtract()}
                className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                Upload & extract facts
              </button>
              <button
                type="button"
                onClick={() => setStep("segment")}
                className="cursor-pointer rounded border border-[#e9ebec] bg-white px-4 py-2 text-[13px] text-[#495057] hover:bg-[#f8f9fa]"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "facts" && document && (
        <>
          <div className="card mb-4">
            <div className="card-header flex-wrap gap-2">
              <div>
                <h5 className="card-title">3. Inspect and confirm extracted facts</h5>
                <p className="m-0 mt-1 text-[12px] text-[#878a99]">
                  {document.filename} · {document.pageCount} pages · checksum{" "}
                  {document.checksum.slice(0, 10)}…
                </p>
              </div>
              {document.factsConfirmed && (
                <span className="inline-flex items-center gap-1 rounded bg-[#daf4f0] px-2 py-1 text-[11px] font-medium text-[#0ab39c]">
                  <CheckCircle2 size={12} />
                  Facts confirmed
                </span>
              )}
            </div>
            {document.warnings.length > 0 && (
              <div className="border-b border-[#e9ebec] px-4 py-3 text-[12px] text-[#856404]">
                {document.warnings.join(" ")}
              </div>
            )}
            <FactEditorTable facts={facts} onChange={setFacts} />
            <div className="flex flex-wrap gap-2 border-t border-[#e9ebec] px-4 py-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => void confirmFacts()}
                className="cursor-pointer rounded border border-[#0ab39c] bg-[#daf4f0] px-4 py-2 text-[13px] font-medium text-[#0ab39c] hover:bg-[#c9eee7] disabled:opacity-60"
              >
                Confirm facts for evaluation
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void runEvaluation()}
                className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Run readiness evaluation
              </button>
            </div>
          </div>
        </>
      )}

      {step === "results" && result && <ReadinessResultsPanel result={result} />}
    </>
  );
}
