"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Globe,
  Loader2,
  Play,
  RefreshCw,
  Square,
  Trash2,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { API_BASE_URL } from "@/lib/api/config";
import type { ScrapeArchiveDocument, ScraperConfig, ScraperStatus } from "@/lib/types";
import { useEthioApi } from "@/providers/ApiProvider";

function mapConfig(raw: Record<string, unknown>): ScraperConfig {
  return {
    chunkSize: Number(raw.chunk_size ?? raw.chunkSize ?? 500),
    workers: Number(raw.workers ?? 4),
    requestTimeoutSec: Number(raw.request_timeout_sec ?? raw.requestTimeoutSec ?? 10),
    maxPageBytes: Number(raw.max_page_bytes ?? raw.maxPageBytes ?? 31457280),
    userAgent: String(raw.user_agent ?? raw.userAgent ?? "EthioBerg-WebScraper/1.0"),
    defaultRateDelayMs: Number(raw.default_rate_delay_ms ?? raw.defaultRateDelayMs ?? 250),
    seeds: Array.isArray(raw.seeds)
      ? raw.seeds.map((item) => {
          const seed = item as Record<string, string>;
          return { url: seed.url, category: seed.category || "web_scrape" };
        })
      : [],
  };
}

function runSummary(scrape: ScraperStatus["scrape"]): string | null {
  const counts = `${scrape.pagesSynced} page${scrape.pagesSynced === 1 ? "" : "s"}, ${scrape.chunksSynced} chunk${scrape.chunksSynced === 1 ? "" : "s"}`;
  if (scrape.running) return `Scraping now — ${counts} so far.`;

  const finished = scrape.finishedAt ? new Date(scrape.finishedAt).toLocaleString() : null;
  const when = finished ? ` at ${finished}` : "";
  switch (scrape.status) {
    case "completed":
      return `Last run finished${when} — ${counts}.`;
    case "stopped":
      return `Last run was stopped${when} — ${counts} before stopping.`;
    case "failed":
      return `Last run failed${when} after ${counts}. See the log below.`;
    default:
      return null;
  }
}

function toPayload(config: ScraperConfig) {
  return {
    chunkSize: config.chunkSize,
    workers: config.workers,
    requestTimeoutSec: config.requestTimeoutSec,
    maxPageBytes: config.maxPageBytes,
    userAgent: config.userAgent,
    defaultRateDelayMs: config.defaultRateDelayMs,
    seeds: config.seeds,
  };
}

export default function ScraperControlPanel() {
  const { api, mode } = useEthioApi();
  const [config, setConfig] = useState<ScraperConfig | null>(null);
  const [status, setStatus] = useState<ScraperStatus | null>(null);
  const [documents, setDocuments] = useState<ScrapeArchiveDocument[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newSeedUrl, setNewSeedUrl] = useState("");
  const [newSeedCategory, setNewSeedCategory] = useState("esx.et");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<"success" | "info">("info");
  const [saved, setSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wasRunning = useRef(false);

  const showToast = (message: string, kind: "success" | "info" = "info") => {
    setToastKind(kind);
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  };

  const loadDocuments = useCallback(async () => {
    const docs = await api.getScraperDocuments(page);
    setDocuments(docs.documents as ScrapeArchiveDocument[]);
    setTotalPages(docs.pagination.totalPages);
  }, [api, page]);

  const refresh = useCallback(async () => {
    const [cfg, st] = await Promise.all([
      api.getScraperConfig(),
      api.getScraperStatus(),
      loadDocuments(),
    ]);
    setConfig(mapConfig(cfg as Record<string, unknown>));
    setStatus(st);
  }, [api, loadDocuments]);

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(async () => {
      let next: ScraperStatus;
      try {
        next = await api.getScraperStatus();
      } catch {
        return;
      }
      setStatus(next);
      // A run's last chunks land as it stops, so poll the archive through the
      // run and once more after it ends rather than only while it is running.
      if (next.scrape.running || wasRunning.current) {
        await loadDocuments().catch(() => undefined);
      }
      wasRunning.current = next.scrape.running;
    }, 3000);
    return () => window.clearInterval(id);
  }, [api, loadDocuments]);

  async function saveConfig(next: ScraperConfig) {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const savedConfig = await api.updateScraperConfig(toPayload(next));
      const mapped = mapConfig(savedConfig as Record<string, unknown>);
      setConfig(mapped);
      const savedTime = new Date().toLocaleString();
      setLastSavedAt(savedTime);
      setSaved(true);
      showToast(
        `Configuration saved — ${mapped.seeds.length} seed URL${mapped.seeds.length === 1 ? "" : "s"}, ${mapped.workers} worker${mapped.workers === 1 ? "" : "s"}.`,
        "success",
      );
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save config.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStart() {
    setBusy(true);
    setError(null);
    try {
      const result = await api.startScraper();
      showToast(result.message);
      // A short run can finish before the first poll, so arm the post-run
      // archive refresh here rather than waiting for the poller to see it run.
      wasRunning.current = true;
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start scrape.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStop() {
    setBusy(true);
    try {
      const result = await api.stopScraper();
      showToast(result.message);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Clear all scraped chunks from the database?")) return;
    setBusy(true);
    try {
      const result = await api.clearScraperArchive();
      showToast(result.message);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not clear archive.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !config) {
    return <p className="text-[13px] text-[#878a99]">Loading web scraper…</p>;
  }

  const running = status?.scrape.running ?? false;
  const summary = status ? runSummary(status.scrape) : null;

  return (
    <>
      <PageHeader
        title="Web Scraper"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration" },
          { label: "Web Scraper" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Re-scraping the same URL replaces its previous chunks in SQLite and Pinecone — safe to run daily or weekly.
        </div>
      )}

      {toast && (
        <div
          className={`mb-4 flex items-start gap-2 rounded px-4 py-3 text-[13px] ${
            toastKind === "success"
              ? "border border-[#0ab39c] bg-[#daf4f0] text-[#0ab39c]"
              : "border border-[#299cdb] bg-[#e1f0fa] text-[#495057]"
          }`}
        >
          {toastKind === "success" ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : null}
          <span>{toast}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded border border-[#f7b84b] bg-[#fef4e4] px-4 py-3 text-[13px] text-[#856404]">
          {error}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Archive status", value: status?.archive.status ?? "IDLE" },
          { label: "DB chunks", value: status?.archive.totalChunks ?? 0 },
          { label: "Pinecone chunks", value: status?.archive.pineconeChunks ?? "—" },
          { label: "Seed URLs", value: config.seeds.length },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="card-body py-3">
              <p className="mb-1 text-[12px] text-[#878a99]">{item.label}</p>
              <p className="m-0 text-[20px] font-semibold text-[#495057]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title inline-flex items-center gap-2">
              <Globe size={16} />
              Crawler configuration
            </h5>
          </div>
          <div className="card-body space-y-4">
            <div className="flex flex-wrap gap-2">
              <input
                value={newSeedUrl}
                onChange={(e) => setNewSeedUrl(e.target.value)}
                placeholder="https://esx.et/..."
                className="min-w-[220px] flex-1 rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
              <input
                value={newSeedCategory}
                onChange={(e) => setNewSeedCategory(e.target.value)}
                placeholder="category"
                className="w-32 rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newSeedUrl.trim()) return;
                  const next = {
                    ...config,
                    seeds: [...config.seeds, { url: newSeedUrl.trim(), category: newSeedCategory.trim() || "web_scrape" }],
                  };
                  setConfig(next);
                  setNewSeedUrl("");
                }}
                className="cursor-pointer rounded border border-[#e9ebec] bg-white px-3 py-2 text-[12px] hover:bg-[#f8f9fa]"
              >
                Add seed
              </button>
            </div>

            <ul className="m-0 max-h-40 list-none space-y-2 overflow-y-auto p-0">
              {config.seeds.map((seed, index) => (
                <li key={`${seed.url}-${index}`} className="flex items-center justify-between gap-2 rounded bg-[#f8f9fa] px-3 py-2 text-[12px]">
                  <span className="truncate text-[#495057]">{seed.url}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        seeds: config.seeds.filter((_, i) => i !== index),
                      })
                    }
                    className="cursor-pointer border-0 bg-transparent text-[#f06548] hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-[12px] text-[#878a99]">
                Workers: {config.workers}
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={config.workers}
                  onChange={(e) => setConfig({ ...config, workers: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </label>
              <label className="text-[12px] text-[#878a99]">
                Delay (ms): {config.defaultRateDelayMs}
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={config.defaultRateDelayMs}
                  onChange={(e) => setConfig({ ...config, defaultRateDelayMs: Number(e.target.value) })}
                  className="mt-1 w-full"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveConfig(config)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium disabled:opacity-50 ${
                  saved
                    ? "border border-[#0ab39c] bg-[#daf4f0] text-[#0ab39c]"
                    : "border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f8f9fa]"
                }`}
              >
                {busy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saved ? (
                  <CheckCircle2 size={14} />
                ) : null}
                {busy ? "Saving…" : saved ? "Saved" : "Save config"}
              </button>
              {lastSavedAt && (
                <span className="text-[11px] text-[#878a99]">Last saved: {lastSavedAt}</span>
              )}
              <button
                type="button"
                disabled={busy || running}
                onClick={() => void handleStart()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#405189] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#364574] disabled:opacity-50"
              >
                {busy && running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Start scrape
              </button>
              <button
                type="button"
                disabled={busy || !running}
                onClick={() => void handleStop()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#f06548] bg-white px-3 py-2 text-[12px] text-[#f06548] hover:bg-[#fff5f5] disabled:opacity-50"
              >
                <Square size={14} />
                Stop
              </button>
              <button
                type="button"
                disabled={busy || running}
                onClick={() => void handleClear()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[12px] hover:bg-[#f8f9fa] disabled:opacity-50"
              >
                <Trash2 size={14} />
                Clear archive
              </button>
            </div>

            {summary && (
              <div
                className={`flex items-start gap-2 rounded px-3 py-2 text-[12px] ${
                  status?.scrape.status === "failed"
                    ? "border border-[#f06548] bg-[#fdf0ee] text-[#f06548]"
                    : "border border-[#e9ebec] bg-[#f8f9fa] text-[#495057]"
                }`}
              >
                {running ? (
                  <Loader2 size={14} className="mt-0.5 shrink-0 animate-spin" />
                ) : status?.scrape.status === "failed" ? (
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#0ab39c]" />
                )}
                <span>{summary}</span>
              </div>
            )}

            {status?.scrape.logTail && (
              <pre className="max-h-40 overflow-auto rounded bg-[#1e1e2d] p-3 text-[11px] text-[#a6b0cf] whitespace-pre-wrap">
                {status.scrape.logTail}
              </pre>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-wrap gap-2">
            <h5 className="card-title">Scraped archive</h5>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void refresh()}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#e9ebec] bg-white px-2 py-1 text-[12px] hover:bg-[#f8f9fa]"
              >
                <RefreshCw size={13} />
                Refresh
              </button>
              <a
                href={`${API_BASE_URL}/api/v1/scraper/export/csv`}
                className="inline-flex items-center gap-1 rounded border border-[#e9ebec] bg-white px-2 py-1 text-[12px] text-[#495057] no-underline hover:bg-[#f8f9fa]"
              >
                <Download size={13} />
                Export CSV
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                  <th className="px-3 py-2 font-semibold text-[#878a99]">Source</th>
                  <th className="px-3 py-2 font-semibold text-[#878a99]">Preview</th>
                  <th className="px-3 py-2 font-semibold text-[#878a99]">Date</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-[#878a99]">
                      No scraped chunks yet. Add seeds and click Start scrape.
                    </td>
                  </tr>
                )}
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#e9ebec]">
                    <td className="px-3 py-2 align-top text-[#405189]">{doc.source_url}</td>
                    <td className="max-w-xs px-3 py-2 align-top text-[#495057]">
                      {doc.content.slice(0, 140)}…
                    </td>
                    <td className="px-3 py-2 align-top text-[#878a99]">{doc.scraped_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#e9ebec] px-4 py-3 text-[12px]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer rounded border border-[#e9ebec] bg-white px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#878a99]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer rounded border border-[#e9ebec] bg-white px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
