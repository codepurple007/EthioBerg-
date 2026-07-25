"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  TestTube2,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  MarketSegment,
  RetrievalBackend,
  RetrievalHealth,
  RetrievalProbeResult,
  RetrievalSettings,
  RetrievalSettingsInput,
} from "@/lib/types";

function toInput(settings: RetrievalSettings): RetrievalSettingsInput {
  return {
    retrievalBackend: settings.retrievalBackend,
    topK: settings.topK,
    candidatePool: settings.candidatePool,
    rrfK: settings.rrfK,
    bm25Weight: settings.bm25Weight,
    denseWeight: settings.denseWeight,
    articleBoost: settings.articleBoost,
    rerankEnabled: settings.rerankEnabled,
    rerankTopN: settings.rerankTopN,
    minScore: settings.minScore,
  };
}

const statusStyles: Record<string, string> = {
  healthy: "bg-[#daf4f0] text-[#0ab39c]",
  degraded: "bg-[#fef4e4] text-[#b8860b]",
  offline: "bg-[#fde8e4] text-[#f06548]",
};

export default function RetrievalOperationsPanel() {
  const { api, mode } = useEthioApi();
  const [active, setActive] = useState<RetrievalSettings | null>(null);
  const [draft, setDraft] = useState<RetrievalSettingsInput | null>(null);
  const [health, setHealth] = useState<RetrievalHealth | null>(null);
  const [probeQuery, setProbeQuery] = useState(
    "What is the minimum market capitalization for the Main Market?",
  );
  const [probeSegment, setProbeSegment] = useState<MarketSegment | "">("");
  const [probe, setProbe] = useState<RetrievalProbeResult | null>(null);
  const [probing, setProbing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const showToast = useCallback((kind: "ok" | "error", text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, healthReport] = await Promise.all([
        api.getRetrievalSettings(),
        api.getRetrievalHealth(),
      ]);
      setActive(settings);
      setDraft(toInput(settings));
      setHealth(healthReport);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not load retrieval settings.");
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(next: Partial<RetrievalSettingsInput>) {
    setDraft((prev) => (prev ? { ...prev, ...next } : prev));
  }

  async function handleSave() {
    if (!draft) return;
    if (draft.bm25Weight === 0 && draft.denseWeight === 0) {
      showToast("error", "At least one of the lexical or dense weights must be above zero.");
      return;
    }
    if (draft.candidatePool < draft.topK) {
      showToast("error", "The candidate pool must be at least as large as top-K.");
      return;
    }
    if (draft.rerankEnabled && draft.rerankTopN < draft.topK) {
      showToast("error", "Rerank depth must be at least as large as top-K.");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateRetrievalSettings(draft);
      setActive(updated);
      setDraft(toInput(updated));
      setHealth(await api.getRetrievalHealth());
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      showToast("ok", "Retrieval settings saved and applied to live Q&A immediately.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not save retrieval settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProbe() {
    if (!probeQuery.trim()) {
      showToast("error", "Enter a probe query first.");
      return;
    }
    setProbing(true);
    try {
      setProbe(await api.probeRetrieval(probeQuery.trim(), probeSegment || undefined));
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "The retrieval probe failed.");
    } finally {
      setProbing(false);
    }
  }

  if (loading || !draft || !active) {
    return <p className="text-[13px] text-[#878a99]">Loading retrieval operations…</p>;
  }

  return (
    <>
      <PageHeader
        title="Retrieval Operations"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration" },
          { label: "Retrieval" },
        ]}
      />

      {mode === "remote" && health && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Active retrieval mode: {health.retrievalMode}
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

      {health && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <Activity size={16} />
              Retrieval health
            </h5>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
          <div className="card-body">
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Metric label="Indexed chunks" value={health.corpusChunks.toLocaleString()} />
              <Metric label="Active sources" value={`${health.activeSources} / ${health.sourceCount}`} />
              <Metric label="Indexed sources" value={String(health.indexedSources)} />
              <Metric
                label="Serving queries"
                value={health.pineconeServing ? "Pinecone" : "In-process"}
              />
            </div>
            <ul className="m-0 space-y-2 p-0">
              {health.components.map((component) => (
                <li
                  key={component.name}
                  className="flex list-none flex-wrap items-center justify-between gap-2 rounded border border-[#e9ebec] px-3 py-2"
                >
                  <div>
                    <p className="m-0 text-[13px] font-medium text-[#495057]">{component.name}</p>
                    <p className="m-0 mt-0.5 text-[12px] text-[#878a99]">{component.detail}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                      statusStyles[component.status] ?? statusStyles.degraded
                    }`}
                  >
                    {component.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <SlidersHorizontal size={16} />
              Hybrid fusion and reranking
            </h5>
          </div>
          <div className="card-body space-y-4">
            <p className="m-0 text-[12px] text-[#878a99]">
              Candidates come from a lexical index and a dense index, are fused with weighted
              reciprocal-rank fusion, then optionally reranked by reading the full candidate text.
            </p>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Retrieval backend
              </label>
              <select
                value={draft.retrievalBackend}
                onChange={(e) =>
                  patch({ retrievalBackend: e.target.value as RetrievalBackend })
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="auto">Automatic — hosted index when available</option>
                <option value="pinecone">Hosted vector index (Pinecone)</option>
                <option value="hybrid">In-process hybrid (BM25 + TF-IDF + RRF)</option>
              </select>
              <p className="mt-1 mb-0 text-[11px] text-[#878a99]">
                The fusion weights and RRF constant below only apply to the in-process hybrid
                retriever. The hosted index answers faster on large corpora but scores every question
                highly, which makes out-of-scope questions harder to refuse.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Returned results (top-K)"
                value={draft.topK}
                min={1}
                max={20}
                step={1}
                onChange={(value) => patch({ topK: value })}
              />
              <NumberField
                label="Candidate pool"
                value={draft.candidatePool}
                min={5}
                max={200}
                step={1}
                onChange={(value) => patch({ candidatePool: value })}
              />
              <NumberField
                label="Lexical (BM25) weight"
                value={draft.bm25Weight}
                min={0}
                max={5}
                step={0.1}
                onChange={(value) => patch({ bm25Weight: value })}
              />
              <NumberField
                label="Dense vector weight"
                value={draft.denseWeight}
                min={0}
                max={5}
                step={0.1}
                onChange={(value) => patch({ denseWeight: value })}
              />
              <NumberField
                label="RRF constant (k)"
                value={draft.rrfK}
                min={1}
                max={200}
                step={1}
                hint="Higher flattens the influence of rank position."
                onChange={(value) => patch({ rrfK: value })}
              />
              <NumberField
                label="Article-match boost"
                value={draft.articleBoost}
                min={0}
                max={5}
                step={0.1}
                hint="Applied when a query names a specific article."
                onChange={(value) => patch({ articleBoost: value })}
              />
            </div>

            <div className="border-t border-[#e9ebec] pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.rerankEnabled}
                  onChange={(e) => patch({ rerankEnabled: e.target.checked })}
                  className="mt-1 accent-[#405189]"
                />
                <span>
                  <span className="block text-[13px] font-medium text-[#495057]">
                    Rerank fused candidates
                  </span>
                  <span className="block text-[12px] text-[#878a99]">
                    Rescores the top candidates on query-term coverage across the full chunk and its
                    section heading.
                  </span>
                </span>
              </label>
              <div className="mt-3 pl-6">
                <NumberField
                  label="Rerank depth (top-N)"
                  value={draft.rerankTopN}
                  min={1}
                  max={50}
                  step={1}
                  disabled={!draft.rerankEnabled}
                  onChange={(value) => patch({ rerankTopN: value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Answer threshold</h5>
          </div>
          <div className="card-body space-y-4">
            <NumberField
              label="Minimum score to answer"
              value={draft.minScore}
              min={0}
              max={1}
              step={0.001}
              hint="Below this score the assistant abstains instead of answering. On a hosted vector index the built-in floor of 0.45 also applies, so only higher values take effect."
              onChange={(value) => patch({ minScore: value })}
            />

            <div className="rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-3">
              <p className="m-0 text-[12px] font-semibold uppercase text-[#878a99]">
                Currently applied
              </p>
              <p className="m-0 mt-2 font-mono text-[12px] text-[#495057]">
                backend {active.retrievalBackend} · top-K {active.topK} · pool{" "}
                {active.candidatePool} · bm25 {active.bm25Weight} · dense {active.denseWeight} ·
                rrf-k {active.rrfK}
              </p>
              <p className="m-0 mt-1 font-mono text-[12px] text-[#495057]">
                rerank {active.rerankEnabled ? `on (top ${active.rerankTopN})` : "off"} · min score{" "}
                {active.minScore}
              </p>
              <p className="m-0 mt-2 text-[11px] text-[#878a99]">
                Saved by {active.updatedBy}
                {active.updatedAt ? ` on ${new Date(active.updatedAt).toLocaleString()}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saved ? <CheckCircle2 size={14} /> : null}
                {saving ? "Saving…" : "Save and apply"}
              </button>
              <button
                type="button"
                onClick={() => void load()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-4 py-2 text-[13px] text-[#495057] hover:bg-[#f8f9fa]"
              >
                <RefreshCw size={14} />
                Discard changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title flex items-center gap-2">
            <TestTube2 size={16} />
            Retrieval probe
          </h5>
          {probe && (
            <span className="rounded bg-[#eef1fa] px-2 py-0.5 text-[11px] font-medium text-[#405189]">
              {probe.latencyMs.toFixed(0)} ms
            </span>
          )}
        </div>
        <div className="card-body">
          <p className="m-0 mb-3 text-[12px] text-[#878a99]">
            Runs a query through the live retriever with the saved settings and shows the scores
            behind each candidate, without generating an answer.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]">
            <input
              value={probeQuery}
              onChange={(e) => setProbeQuery(e.target.value)}
              placeholder="Ask a regulatory question…"
              className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
            />
            <select
              value={probeSegment}
              onChange={(e) => setProbeSegment(e.target.value as MarketSegment | "")}
              className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
            >
              <option value="">All segments</option>
              <option value="MAIN">Main Market</option>
              <option value="GROWTH">Growth Market</option>
            </select>
            <button
              type="button"
              onClick={() => void handleProbe()}
              disabled={probing}
              className="cursor-pointer rounded border-0 bg-[#0ab39c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#099885] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {probing ? "Probing…" : "Run probe"}
            </button>
          </div>

          {probing && (
            <p className="mt-3 mb-0 text-[12px] text-[#878a99]">
              Querying the live index — a hosted vector search can take several seconds.
            </p>
          )}

          {probe && !probing && (
            <div className="mt-4">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
                <span
                  className={`rounded px-2 py-0.5 font-medium ${
                    probe.passedThreshold
                      ? "bg-[#daf4f0] text-[#0ab39c]"
                      : "bg-[#fef4e4] text-[#b8860b]"
                  }`}
                >
                  {probe.passedThreshold
                    ? "Top result clears the answer threshold"
                    : "Top result is below the answer threshold — the assistant would abstain"}
                </span>
                <span className="text-[#878a99]">{probe.retrievalMode}</span>
              </div>

              {probe.hits.length === 0 ? (
                <p className="m-0 text-[13px] text-[#878a99]">
                  No candidates matched. The assistant would abstain on this question.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                        <th className="px-3 py-2 font-semibold text-[#878a99]">#</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Source / section</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Fused</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">BM25</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Dense</th>
                        <th className="px-3 py-2 font-semibold text-[#878a99]">Boost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {probe.hits.map((hit) => (
                        <tr key={hit.chunkId} className="border-b border-[#e9ebec] last:border-0">
                          <td className="px-3 py-3 text-[#878a99]">{hit.rank}</td>
                          <td className="px-3 py-3">
                            <p className="m-0 font-medium text-[#495057]">{hit.sourceTitle}</p>
                            <p className="m-0 mt-0.5 text-[12px] text-[#878a99]">{hit.section}</p>
                            <p className="m-0 mt-1 text-[12px] text-[#495057]">{hit.preview}</p>
                            <p className="m-0 mt-1 font-mono text-[11px] text-[#878a99]">
                              {hit.chunkId}
                              {hit.reranked ? " · reranked" : ""}
                            </p>
                          </td>
                          <td className="px-3 py-3 font-mono text-[12px] text-[#495057]">
                            {hit.fusedScore.toFixed(4)}
                          </td>
                          <td className="px-3 py-3 font-mono text-[12px] text-[#878a99]">
                            {hit.bm25Score.toFixed(3)}
                          </td>
                          <td className="px-3 py-3 font-mono text-[12px] text-[#878a99]">
                            {hit.denseScore.toFixed(3)}
                          </td>
                          <td className="px-3 py-3 font-mono text-[12px] text-[#878a99]">
                            {hit.articleBoost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#e9ebec] px-3 py-2">
      <p className="m-0 text-[11px] font-medium uppercase text-[#878a99]">{label}</p>
      <p className="m-0 mt-1 text-[18px] font-semibold text-[#495057]">{value}</p>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  hint,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-[#878a99]">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189] disabled:bg-[#f8f9fa] disabled:text-[#878a99]"
      />
      {hint && <p className="mt-1 mb-0 text-[11px] text-[#878a99]">{hint}</p>}
    </div>
  );
}
