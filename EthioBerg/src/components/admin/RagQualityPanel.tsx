"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Gauge,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  EvaluationProgress,
  GuardrailSettings,
  GuardrailSettingsInput,
  RagQualityOverview,
  RagQualityRun,
} from "@/lib/types";

function toInput(settings: GuardrailSettings): GuardrailSettingsInput {
  return {
    requireCitationForAnswer: settings.requireCitationForAnswer,
    minCitationCount: settings.minCitationCount,
    blockSyntheticInAnswers: settings.blockSyntheticInAnswers,
    enforceDisclaimer: settings.enforceDisclaimer,
    abstainOnLowConfidence: settings.abstainOnLowConfidence,
  };
}

function percent(value: number) {
  return `${(value * 100).toFixed(0)}%`;
}

export default function RagQualityPanel() {
  const { api, mode } = useEthioApi();
  const [overview, setOverview] = useState<RagQualityOverview | null>(null);
  const [guardrails, setGuardrails] = useState<GuardrailSettingsInput | null>(null);
  const [progress, setProgress] = useState<EvaluationProgress | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingGuardrails, setSavingGuardrails] = useState(false);
  const [savedGuardrails, setSavedGuardrails] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const pollRef = useRef<number | null>(null);

  const showToast = useCallback((kind: "ok" | "error", text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  const load = useCallback(async () => {
    try {
      const next = await api.getQualityOverview();
      setOverview(next);
      setGuardrails(toInput(next.guardrails));
      setProgress(next.progress);
      setSelectedRunId((current) => current ?? next.latestRun?.id ?? null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not load quality data.");
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!progress?.running) {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    pollRef.current = window.setInterval(async () => {
      try {
        const next = await api.getQualityProgress();
        setProgress(next);
        if (!next.running) {
          await load();
          showToast("ok", next.message);
        }
      } catch {
        /* keep polling; a transient failure should not stop the run view */
      }
    }, 2000);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [progress?.running, api, load, showToast]);

  async function handleRunEvaluation() {
    try {
      const result = await api.startQualityEvaluation();
      showToast("ok", result.message);
      setProgress(await api.getQualityProgress());
      if (mode === "mock") await load();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not start the evaluation.");
    }
  }

  async function handleSaveGuardrails() {
    if (!guardrails) return;
    setSavingGuardrails(true);
    try {
      const updated = await api.updateGuardrails(guardrails);
      setGuardrails(toInput(updated));
      setOverview((prev) => (prev ? { ...prev, guardrails: updated } : prev));
      setSavedGuardrails(true);
      window.setTimeout(() => setSavedGuardrails(false), 2500);
      showToast("ok", "Guardrails saved and applied to every new answer.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not save guardrails.");
    } finally {
      setSavingGuardrails(false);
    }
  }

  if (loading || !overview || !guardrails) {
    return <p className="text-[13px] text-[#878a99]">Loading RAG quality dashboard…</p>;
  }

  const selectedRun: RagQualityRun | null =
    overview.history.find((run) => run.id === selectedRunId) ?? overview.latestRun;
  const running = progress?.running ?? false;
  const failures = selectedRun?.results.filter((row) => !row.passed) ?? [];

  return (
    <>
      <PageHeader
        title="RAG Quality"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration" },
          { label: "Quality" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Each run sends all {overview.caseCount} golden questions through the live retrieval and
          answer pipeline, so scores reflect the configuration currently in effect.
        </div>
      )}

      {toast && (
        <div
          className={`mb-4 flex items-start gap-2 rounded border px-4 py-3 text-[13px] ${
            toast.kind === "ok"
              ? "border-[#0ab39c] bg-[#daf4f0] text-[#0ab39c]"
              : "border-[#f06548] bg-[#fde8e4] text-[#f06548]"
          }`}
        >
          {toast.kind === "ok" ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title flex items-center gap-2">
            <Gauge size={16} />
            Golden set evaluation
          </h5>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void handleRunEvaluation()}
              disabled={running}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlayCircle size={14} />
              {running ? "Evaluation running…" : "Run evaluation"}
            </button>
          </div>
        </div>
        <div className="card-body">
          {running && progress && (
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-[12px] text-[#495057]">
                <span>{progress.message}</span>
                <span className="font-mono">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-[#e9ebec]">
                <div
                  className="h-full rounded bg-[#405189] transition-all"
                  style={{
                    width: `${progress.total ? (progress.completed / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {!selectedRun ? (
            <p className="m-0 text-[13px] text-[#878a99]">
              No evaluation has been run yet. Start one to score the pipeline against the{" "}
              {overview.caseCount} golden questions.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
                <Metric
                  label="Cases passed"
                  value={`${selectedRun.passedCases} / ${selectedRun.totalCases}`}
                  tone={selectedRun.passedCases === selectedRun.totalCases ? "good" : "warn"}
                />
                <Metric label="Answer rate" value={percent(selectedRun.answerRate)} />
                <Metric label="Abstention rate" value={percent(selectedRun.abstentionRate)} />
                <Metric
                  label="Citation coverage"
                  value={percent(selectedRun.citationCoverage)}
                  tone={selectedRun.citationCoverage === 1 ? "good" : "warn"}
                />
                <Metric
                  label="Expected source recall"
                  value={percent(selectedRun.expectedSourceRecall)}
                  tone={selectedRun.expectedSourceRecall >= 0.9 ? "good" : "warn"}
                />
                <Metric
                  label="Avg latency"
                  value={`${(selectedRun.avgLatencyMs / 1000).toFixed(2)} s`}
                />
              </div>

              <p className="m-0 mt-3 text-[12px] text-[#878a99]">
                Run {selectedRun.id} · {selectedRun.retrievalMode} · started by{" "}
                {selectedRun.actorName} on {new Date(selectedRun.createdAt).toLocaleString()}
              </p>

              {failures.length > 0 && (
                <div className="mt-4 rounded border border-[#fef4e4] bg-[#fffbf3] px-3 py-3">
                  <p className="m-0 mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase text-[#b8860b]">
                    <TriangleAlert size={14} />
                    {failures.length} case{failures.length === 1 ? "" : "s"} need attention
                  </p>
                  <ul className="m-0 space-y-1 p-0">
                    {failures.map((row) => (
                      <li key={row.caseId} className="list-none text-[12px] text-[#495057]">
                        <span className="font-mono text-[11px] text-[#878a99]">{row.caseId}</span>{" "}
                        — {row.failureReason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRun && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Case results ({selectedRun.results.length})</h5>
            {overview.history.length > 1 && (
              <select
                value={selectedRun.id}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="rounded border border-[#e9ebec] px-3 py-1.5 text-[12px] outline-none focus:border-[#405189]"
              >
                {overview.history.map((run) => (
                  <option key={run.id} value={run.id}>
                    {run.id} — {new Date(run.createdAt).toLocaleString()}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Result</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Question</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Expected</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Actual</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Citations</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Latency</th>
                </tr>
              </thead>
              <tbody>
                {selectedRun.results.map((row) => (
                  <tr key={row.caseId} className="border-b border-[#e9ebec] last:border-0">
                    <td className="px-4 py-3">
                      {row.passed ? (
                        <span className="inline-flex items-center gap-1 rounded bg-[#daf4f0] px-2 py-0.5 text-[11px] font-medium text-[#0ab39c]">
                          <CheckCircle2 size={12} />
                          Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-[#fde8e4] px-2 py-0.5 text-[11px] font-medium text-[#f06548]">
                          <XCircle size={12} />
                          Fail
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="m-0 text-[#495057]">{row.question}</p>
                      <p className="m-0 mt-0.5 font-mono text-[11px] text-[#878a99]">
                        {row.caseId}
                        {row.topChunkId ? ` · top: ${row.topChunkId}` : ""}
                      </p>
                      {row.failureReason && (
                        <p className="m-0 mt-1 text-[12px] text-[#f06548]">{row.failureReason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-[#878a99]">{row.expectation}</td>
                    <td className="px-4 py-3 text-[#495057]">
                      {row.status}
                      <span className="block text-[11px] text-[#878a99]">
                        {row.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#495057]">
                      {row.citationCount}
                      {row.expectation === "answer" && (
                        <span
                          className={`block text-[11px] ${
                            row.expectedSourceHit ? "text-[#0ab39c]" : "text-[#b8860b]"
                          }`}
                        >
                          {row.expectedSourceHit ? "expected source cited" : "expected source missed"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#878a99]">
                      {(row.latencyMs / 1000).toFixed(2)} s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <ShieldCheck size={16} />
              Safety guardrails
            </h5>
          </div>
          <div className="card-body space-y-4">
            <ToggleField
              label="Require citations before answering"
              hint="Without enough verified citations the assistant abstains instead of answering."
              checked={guardrails.requireCitationForAnswer}
              onChange={(checked) =>
                setGuardrails((prev) => (prev ? { ...prev, requireCitationForAnswer: checked } : prev))
              }
            />
            <div className="pl-6">
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Minimum citations per answer
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={guardrails.minCitationCount}
                disabled={!guardrails.requireCitationForAnswer}
                onChange={(e) =>
                  setGuardrails((prev) =>
                    prev ? { ...prev, minCitationCount: Number(e.target.value) } : prev,
                  )
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189] disabled:bg-[#f8f9fa] disabled:text-[#878a99]"
              />
            </div>
            <ToggleField
              label="Abstain on low-confidence retrieval"
              hint="Applies the answer threshold from Retrieval Operations before composing a response."
              checked={guardrails.abstainOnLowConfidence}
              onChange={(checked) =>
                setGuardrails((prev) => (prev ? { ...prev, abstainOnLowConfidence: checked } : prev))
              }
            />
            <ToggleField
              label="Block synthetic data in answers"
              hint="Keeps demo fixtures out of anything presented as an official figure."
              checked={guardrails.blockSyntheticInAnswers}
              onChange={(checked) =>
                setGuardrails((prev) => (prev ? { ...prev, blockSyntheticInAnswers: checked } : prev))
              }
            />
            <ToggleField
              label="Enforce the pre-review disclaimer"
              hint="Every answer carries the notice that it is not legal or investment advice."
              checked={guardrails.enforceDisclaimer}
              onChange={(checked) =>
                setGuardrails((prev) => (prev ? { ...prev, enforceDisclaimer: checked } : prev))
              }
            />

            <div className="flex flex-wrap items-center gap-3 border-t border-[#e9ebec] pt-4">
              <button
                type="button"
                onClick={() => void handleSaveGuardrails()}
                disabled={savingGuardrails}
                className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savedGuardrails ? <CheckCircle2 size={14} /> : null}
                {savingGuardrails ? "Saving…" : "Save guardrails"}
              </button>
              <span className="text-[12px] text-[#878a99]">
                Last changed by {overview.guardrails.updatedBy}
                {overview.guardrails.updatedAt
                  ? ` on ${new Date(overview.guardrails.updatedAt).toLocaleString()}`
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Run history</h5>
            <span className="rounded bg-[#eef1fa] px-2 py-0.5 text-[11px] font-medium text-[#405189]">
              {overview.history.length} run{overview.history.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="card-body">
            {overview.history.length === 0 ? (
              <p className="m-0 text-[13px] text-[#878a99]">
                Completed runs are kept here so you can compare quality across configuration changes.
              </p>
            ) : (
              <ul className="m-0 space-y-2 p-0">
                {overview.history.map((run) => (
                  <li
                    key={run.id}
                    className={`list-none rounded border px-3 py-3 ${
                      run.id === selectedRun?.id
                        ? "border-[#405189] bg-[#f7f8fc]"
                        : "border-[#e9ebec]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedRunId(run.id)}
                      className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[12px] text-[#495057]">{run.id}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                            run.passedCases === run.totalCases
                              ? "bg-[#daf4f0] text-[#0ab39c]"
                              : "bg-[#fef4e4] text-[#b8860b]"
                          }`}
                        >
                          {run.passedCases}/{run.totalCases} passed
                        </span>
                      </div>
                      <p className="m-0 mt-1 text-[11px] text-[#878a99]">
                        {new Date(run.createdAt).toLocaleString()} · citations{" "}
                        {percent(run.citationCoverage)} · recall{" "}
                        {percent(run.expectedSourceRecall)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "good" | "warn" | "neutral";
}) {
  const toneClass =
    tone === "good" ? "text-[#0ab39c]" : tone === "warn" ? "text-[#b8860b]" : "text-[#495057]";
  return (
    <div className="rounded border border-[#e9ebec] px-3 py-2">
      <p className="m-0 text-[11px] font-medium uppercase text-[#878a99]">{label}</p>
      <p className={`m-0 mt-1 text-[18px] font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-[#405189]"
      />
      <span>
        <span className="block text-[13px] font-medium text-[#495057]">{label}</span>
        <span className="block text-[12px] text-[#878a99]">{hint}</span>
      </span>
    </label>
  );
}
