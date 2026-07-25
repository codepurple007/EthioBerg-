"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import type {
  ArchiveDocument,
  ArchiveStatus,
  ScrapeRuntime,
  ScraperConfig,
  Seed,
} from "@/lib/types";

type DocumentsResponse = {
  status: ArchiveStatus;
  documents: ArchiveDocument[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalChunks: number;
  };
};

const emptyConfig: ScraperConfig = {
  chroma_url: "http://localhost:8000",
  collection: "local_archives",
  chunk_size: 500,
  workers: 4,
  request_timeout_sec: 10,
  max_page_bytes: 31457280,
  user_agent: "SovereignAI-ArchiveScraper/2.0 (Local Research Application)",
  default_rate_delay_ms: 250,
  seeds: [],
};

export default function ControlCenter() {
  const [config, setConfig] = useState<ScraperConfig>(emptyConfig);
  const [newSeedUrl, setNewSeedUrl] = useState("");
  const [newSeedCategory, setNewSeedCategory] = useState("artifact_history");
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [status, setStatus] = useState<ArchiveStatus | null>(null);
  const [scrape, setScrape] = useState<ScrapeRuntime | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = scrape?.running ?? false;

  const loadAll = useCallback(async (nextPage = page) => {
    const [configRes, docsRes, statusRes] = await Promise.all([
      fetch("/api/config"),
      fetch(`/api/documents?page=${nextPage}&pageSize=20`),
      fetch("/api/status"),
    ]);

    if (!configRes.ok) throw new Error("Failed to load config");
    if (!docsRes.ok) throw new Error("Failed to load documents");
    if (!statusRes.ok) throw new Error("Failed to load status");

    const cfg = (await configRes.json()) as ScraperConfig;
    const docs = (await docsRes.json()) as DocumentsResponse;
    const st = await statusRes.json();

    setConfig(cfg);
    setDocuments(docs.documents);
    setStatus(docs.status);
    setPage(docs.pagination.page);
    setTotalPages(docs.pagination.totalPages);
    setScrape(st.scrape as ScrapeRuntime);
  }, [page]);

  useEffect(() => {
    startTransition(() => {
      loadAll(1).catch((err: Error) => setError(err.message));
    });
    // Initial hydrate only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      fetch("/api/status")
        .then((r) => r.json())
        .then((st) => {
          setScrape(st.scrape as ScrapeRuntime);
          setStatus(st.archive as ArchiveStatus);
        })
        .catch(() => undefined);

      // While scraping (or right after), refresh the archive grid so partial data appears.
      fetch(`/api/documents?page=${page}&pageSize=20`)
        .then((r) => (r.ok ? r.json() : null))
        .then((docs: DocumentsResponse | null) => {
          if (!docs) return;
          setDocuments(docs.documents);
          setStatus(docs.status);
          setTotalPages(docs.pagination.totalPages);
        })
        .catch(() => undefined);
    }, 3000);
    return () => window.clearInterval(id);
  }, [page]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const saveConfig = async (next: ScraperConfig) => {
    setError(null);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Config save failed");
    }
    const saved = (await res.json()) as ScraperConfig;
    setConfig(saved);
    flash("Configuration written to seeds.yaml");
  };

  const addSeed = async () => {
    const url = newSeedUrl.trim();
    if (!url) return;
    const seed: Seed = {
      url,
      category: newSeedCategory.trim() || "artifact_history",
    };
    const next = { ...config, seeds: [...config.seeds, seed] };
    await saveConfig(next);
    setNewSeedUrl("");
  };

  const removeSeed = async (url: string) => {
    const next = {
      ...config,
      seeds: config.seeds.filter((s) => s.url !== url),
    };
    await saveConfig(next);
  };

  const onSlider =
    (key: "workers" | "default_rate_delay_ms" | "request_timeout_sec") =>
    (value: number) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    };

  const commitSliders = async () => {
    try {
      await saveConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const startScrape = async () => {
    setError(null);
    await saveConfig(config);
    const res = await fetch("/api/scrape", { method: "POST" });
    const body = await res.json();
    if (!res.ok) {
      if (body.scrape) setScrape(body.scrape);
      setError(body.error || "Start failed");
      return;
    }
    setScrape(body);
    flash("Scrape workers started");
  };

  const stopScrape = async () => {
    setError(null);
    const res = await fetch("/api/scrape", { method: "DELETE" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || "Stop failed");
      return;
    }
    setScrape(body);
    flash("Scrape stopped — showing archive gathered so far");
    await loadAll(1);
  };

  const clearArchive = async () => {
    setError(null);
    const confirmed = window.confirm(
      "Clear all previously scraped chunks from Chroma and local scrape logs? This cannot be undone.",
    );
    if (!confirmed) return;

    const res = await fetch("/api/archive", { method: "DELETE" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || "Clear archive failed");
      return;
    }
    flash(
      `Archive cleared${typeof body.deletedRecords === "number" ? ` (${body.deletedRecords} chunks removed)` : ""}`,
    );
    setDocuments([]);
    setStatus((prev) =>
      prev
        ? { ...prev, totalChunks: 0, lastSyncAt: null, error: undefined }
        : prev,
    );
    setPage(1);
    setTotalPages(1);
    await loadAll(1);
  };

  const goPage = async (next: number) => {
    startTransition(() => {
      loadAll(next).catch((err: Error) => setError(err.message));
    });
  };

  const statusLabel = useMemo(() => {
    if (active) return "ACTIVE";
    if (status && !status.reachable) return "CHROMA OFFLINE";
    return "IDLE";
  }, [active, status]);

  return (
    <main className="relative mx-auto min-h-screen max-w-[1400px] px-5 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
            Command & Data Control
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] md:text-5xl">
            EthioBurg
          </h1>
          <p className="mt-2 max-w-xl text-[var(--muted)]">
            Configure crawl targets, tune worker bounds, inspect Chroma chunks, and
            export the archive.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide ${
              active
                ? "border-[var(--ok)] bg-[rgba(31,122,77,0.12)] text-[var(--ok)]"
                : status && !status.reachable
                  ? "border-[var(--danger)] bg-[rgba(155,44,44,0.1)] text-[var(--danger)]"
                  : "border-[var(--line)] bg-white/50 text-[var(--ink-soft)]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                active ? "bg-[var(--ok)]" : status && !status.reachable ? "bg-[var(--danger)]" : "bg-[var(--gold)]"
              }`}
            />
            Status: {statusLabel}
          </span>
        </div>
      </header>

      {(toast || error) && (
        <div className="mb-4">
          {toast && (
            <div className="rounded-md border border-[rgba(31,122,77,0.35)] bg-[rgba(31,122,77,0.12)] px-4 py-3 text-sm text-[var(--ok)]">
              {toast}
            </div>
          )}
          {error && (
            <div className="whitespace-pre-wrap rounded-md border border-[rgba(155,44,44,0.35)] bg-[rgba(155,44,44,0.1)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="panel rounded-2xl p-6 lg:col-span-4">
          <h2 className="mb-1 font-[family-name:var(--font-display)] text-xl font-bold">
            Crawler Configuration
          </h2>
          <p className="mb-6 text-sm text-[var(--muted)]">
            Writes live to <code className="font-[family-name:var(--font-mono)] text-xs">configs/seeds.yaml</code>
          </p>

          <label className="mb-2 block text-sm font-semibold text-[var(--ink-soft)]">
            Target Base Seed URL
          </label>
          <div className="mb-3 flex flex-col gap-2">
            <input
              value={newSeedUrl}
              onChange={(e) => setNewSeedUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2.5 outline-none ring-[var(--forest)] focus:ring-2"
            />
            <input
              value={newSeedCategory}
              onChange={(e) => setNewSeedCategory(e.target.value)}
              placeholder="category"
              className="w-full rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2.5 outline-none ring-[var(--forest)] focus:ring-2"
            />
            <button
              type="button"
              onClick={() => addSeed().catch((e: Error) => setError(e.message))}
              className="rounded-lg bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--forest-deep)]"
            >
              Register Seed
            </button>
          </div>

          <ul className="mb-6 max-h-40 space-y-2 overflow-auto rounded-lg border border-[var(--line)] bg-white/40 p-3 text-sm">
            {config.seeds.length === 0 && (
              <li className="text-[var(--muted)]">No seeds registered yet.</li>
            )}
            {config.seeds.map((seed) => (
              <li
                key={seed.url}
                className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{seed.url}</p>
                  <p className="text-xs text-[var(--muted)]">{seed.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSeed(seed.url).catch((e: Error) => setError(e.message))}
                  className="shrink-0 text-xs font-semibold text-[var(--danger)]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <SliderField
            label="Max Concurrent Workers"
            hint="How many seed URLs the scraper fetches in parallel (Go worker pool size)."
            value={config.workers}
            min={1}
            max={100}
            unit="workers"
            onChange={onSlider("workers")}
          />
          <SliderField
            label="Domain Delay Buffer"
            hint="Minimum pause between requests to the same host. 0ms = no extra wait (robots Crawl-delay still applies if higher)."
            value={config.default_rate_delay_ms}
            min={0}
            max={5000}
            step={10}
            unit="ms"
            onChange={onSlider("default_rate_delay_ms")}
          />
          <SliderField
            label="Network Page Timeout"
            value={config.request_timeout_sec}
            min={5}
            max={60}
            unit="s"
            onChange={onSlider("request_timeout_sec")}
          />

          <button
            type="button"
            onClick={() => commitSliders()}
            className="mb-4 w-full rounded-lg border border-[var(--line)] bg-white/70 px-4 py-2.5 text-sm font-semibold transition hover:bg-white"
          >
            Commit Bounds
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => startScrape().catch((e: Error) => setError(e.message))}
              className="rounded-lg bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
            >
              ▶ Start Scrape
            </button>
            <button
              type="button"
              onClick={() => stopScrape().catch((e: Error) => setError(e.message))}
              className="rounded-lg border border-[var(--danger)] bg-[rgba(155,44,44,0.08)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
            >
              ■ Stop Workers
            </button>
          </div>

          <button
            type="button"
            onClick={() => clearArchive().catch((e: Error) => setError(e.message))}
            className="mt-3 w-full rounded-lg border border-[var(--line)] bg-white/50 px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] transition hover:border-[var(--danger)] hover:bg-[rgba(155,44,44,0.06)] hover:text-[var(--danger)]"
          >
            Clear Previous Archive
          </button>

          {scrape?.lastLog ? (
            <pre className="mt-4 max-h-36 overflow-auto rounded-lg bg-[var(--ink)] p-3 font-[family-name:var(--font-mono)] text-[10px] leading-relaxed text-[var(--paper)]">
              {scrape.lastLog}
            </pre>
          ) : null}
        </section>

        <section className="panel rounded-2xl p-6 lg:col-span-8">
          <div className="mb-5 flex flex-col gap-4 border-b border-[var(--line)] pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
                Live Vector Archive Viewer
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Namespace{" "}
                <span className="font-[family-name:var(--font-mono)] text-[var(--forest)]">
                  {status?.collection ?? config.collection}
                </span>
                {" · "}
                Total Embedded Chunks:{" "}
                <strong>{(status?.totalChunks ?? 0).toLocaleString()}</strong>
                {status?.lastSyncAt ? ` · Last sync ${status.lastSyncAt}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExportLink href="/api/export/json" label="Download JSON" />
              <ExportLink href="/api/export/csv" label="CSV" />
              <ExportLink href="/api/export/xlsx" label="Excel / XLSX" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--line)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-[rgba(26,22,18,0.06)] text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Source URL</th>
                    <th className="px-4 py-3 font-semibold">Content</th>
                    <th className="px-4 py-3 font-semibold">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-[var(--muted)]">
                        {pending
                          ? "Loading archive…"
                          : status && !status.reachable
                            ? status.error || "ChromaDB unreachable"
                            : "No data records found in the target collection."}
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-t border-[var(--line)] align-top odd:bg-white/30 even:bg-transparent"
                      >
                        <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-[var(--forest)]">
                          {doc.id}
                        </td>
                        <td className="max-w-[220px] truncate px-4 py-3 text-[var(--ink-soft)]">
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                              {doc.url}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="max-w-[360px] px-4 py-3 text-[var(--ink)]">
                          <span className="line-clamp-3">{doc.content}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted)]">
                          <div>{doc.category || "—"}</div>
                          <div>{doc.crawledAt || "—"}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={page <= 1 || pending}
              onClick={() => goPage(page - 1)}
              className="rounded-md border border-[var(--line)] bg-white/60 px-3 py-1.5 disabled:opacity-40"
            >
              ◄ Previous
            </button>
            <span className="text-[var(--muted)]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || pending}
              onClick={() => goPage(page + 1)}
              className="rounded-md border border-[var(--line)] bg-white/60 px-3 py-1.5 disabled:opacity-40"
            >
              Next ►
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-sm">
        <label className="font-semibold text-[var(--ink-soft)]">{label}</label>
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--forest)]">
          {value}
          {unit}
        </span>
      </div>
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint ? <p className="mt-1.5 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

function ExportLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
    >
      {label}
    </a>
  );
}
