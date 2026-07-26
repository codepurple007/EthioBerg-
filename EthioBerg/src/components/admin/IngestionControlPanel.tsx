"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  History,
  Layers,
  RefreshCw,
  ScanText,
  Table2,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  ChunkPreview,
  IngestionPipelineStats,
  IngestionSettings,
  IngestionSettingsInput,
} from "@/lib/types";

const EMBEDDING_MODELS = [
  "sentence-transformers/all-MiniLM-L6-v2",
  "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
  "intfloat/multilingual-e5-large",
  "BAAI/bge-m3",
];

const OCR_LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "amh", label: "Amharic" },
  { code: "ara", label: "Arabic" },
];

function toInput(settings: IngestionSettings): IngestionSettingsInput {
  return {
    parentChunkChars: settings.parentChunkChars,
    childChunkChars: settings.childChunkChars,
    chunkOverlapChars: settings.chunkOverlapChars,
    tableAwareParsing: settings.tableAwareParsing,
    tableFlattenStrategy: settings.tableFlattenStrategy,
    ocrFallbackEnabled: settings.ocrFallbackEnabled,
    ocrLanguages: settings.ocrLanguages,
    ocrMinTextChars: settings.ocrMinTextChars,
    embeddingModel: settings.embeddingModel,
    notes: "",
  };
}

export default function IngestionControlPanel() {
  const { api, mode } = useEthioApi();
  const [draft, setDraft] = useState<IngestionSettingsInput | null>(null);
  const [active, setActive] = useState<IngestionSettings | null>(null);
  const [versions, setVersions] = useState<IngestionSettings[]>([]);
  const [stats, setStats] = useState<IngestionPipelineStats | null>(null);
  const [preview, setPreview] = useState<ChunkPreview | null>(null);
  const [sampleText, setSampleText] = useState("");
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
      const [settings, versionList, pipelineStats] = await Promise.all([
        api.getIngestionSettings(),
        api.getIngestionVersions(),
        api.getIngestionStats(),
      ]);
      setActive(settings);
      setDraft(toInput(settings));
      setVersions(versionList);
      setStats(pipelineStats);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not load ingestion settings.");
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(next: Partial<IngestionSettingsInput>) {
    setDraft((prev) => (prev ? { ...prev, ...next } : prev));
  }

  function toggleLanguage(code: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const has = prev.ocrLanguages.includes(code);
      return {
        ...prev,
        ocrLanguages: has
          ? prev.ocrLanguages.filter((item) => item !== code)
          : [...prev.ocrLanguages, code],
      };
    });
  }

  async function handleSave() {
    if (!draft) return;
    if (draft.childChunkChars > draft.parentChunkChars) {
      showToast("error", "Child chunk size must not exceed the parent chunk size.");
      return;
    }
    if (draft.chunkOverlapChars >= draft.childChunkChars) {
      showToast("error", "Chunk overlap must be smaller than the child chunk size.");
      return;
    }
    if (draft.ocrFallbackEnabled && draft.ocrLanguages.length === 0) {
      showToast("error", "Select at least one OCR language while OCR fallback is enabled.");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateIngestionSettings(draft);
      setActive(updated);
      setDraft(toInput(updated));
      setVersions(await api.getIngestionVersions());
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      showToast(
        "ok",
        `Saved as version ${updated.version}. New uploads and re-indexing runs use this configuration.`,
      );
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not save ingestion settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore(version: number) {
    try {
      const restored = await api.restoreIngestionVersion(version);
      setActive(restored);
      setDraft(toInput(restored));
      setVersions(await api.getIngestionVersions());
      showToast("ok", `Version ${version} restored as version ${restored.version}.`);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not restore that version.");
    }
  }

  async function handlePreview() {
    try {
      setPreview(await api.previewChunking(sampleText.trim() || undefined));
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not build a chunk preview.");
    }
  }

  if (loading || !draft || !active) {
    return <p className="text-[13px] text-[#878a99]">Loading ingestion configuration…</p>;
  }

  return (
    <>
      <PageHeader
        title="Ingestion"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration" },
          { label: "Ingestion" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Every save creates a new immutable configuration version in SQLite and is recorded in the
          audit log.
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

      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Registered sources" value={stats.totalSources} hint={`${stats.indexedSources} indexed`} />
          <StatCard label="Pending indexing" value={stats.pendingSources} hint={`${stats.retiredSources} retired`} />
          <StatCard label="Regulatory chunks" value={stats.corpusChunks} hint="Searchable corpus" />
          <StatCard
            label="Scraped chunks"
            value={stats.scrapeChunks}
            hint={stats.lastScrapeAt ? `Last sync ${stats.lastScrapeAt}` : "Never synced"}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <Layers size={16} />
              Parent / child chunking
            </h5>
            <span className="rounded bg-[#eef1fa] px-2 py-0.5 text-[11px] font-medium text-[#405189]">
              Active version {active.version}
            </span>
          </div>
          <div className="card-body space-y-4">
            <p className="m-0 text-[12px] text-[#878a99]">
              Child chunks are what retrieval scores; the parent chunk is what the answer reads for
              context, so clauses are not cut off mid-sentence.
            </p>
            <NumberField
              label="Parent chunk size (characters)"
              value={draft.parentChunkChars}
              min={400}
              max={8000}
              onChange={(value) => patch({ parentChunkChars: value })}
            />
            <NumberField
              label="Child chunk size (characters)"
              value={draft.childChunkChars}
              min={120}
              max={4000}
              onChange={(value) => patch({ childChunkChars: value })}
            />
            <NumberField
              label="Child overlap (characters)"
              value={draft.chunkOverlapChars}
              min={0}
              max={1000}
              hint="Overlap keeps a clause that straddles a boundary retrievable from both chunks."
              onChange={(value) => patch({ chunkOverlapChars: value })}
            />
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Embedding model
              </label>
              <select
                value={draft.embeddingModel}
                onChange={(e) => patch({ embeddingModel: e.target.value })}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                {EMBEDDING_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="mt-1 mb-0 text-[11px] text-[#878a99]">
                Changing the model requires re-indexing existing sources before answers reflect it.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <Table2 size={16} />
              Table parsing and OCR fallback
            </h5>
          </div>
          <div className="card-body space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={draft.tableAwareParsing}
                onChange={(e) => patch({ tableAwareParsing: e.target.checked })}
                className="mt-1 accent-[#405189]"
              />
              <span>
                <span className="block text-[13px] font-medium text-[#495057]">
                  Table-aware parsing
                </span>
                <span className="block text-[12px] text-[#878a99]">
                  Keeps detected tables in one block so a threshold stays attached to the segment it
                  belongs to.
                </span>
              </span>
            </label>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Table flattening strategy
              </label>
              <select
                value={draft.tableFlattenStrategy}
                onChange={(e) => patch({ tableFlattenStrategy: e.target.value })}
                disabled={!draft.tableAwareParsing}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189] disabled:bg-[#f8f9fa] disabled:text-[#878a99]"
              >
                <option value="row_per_line">One row per line</option>
                <option value="key_value">Key–value pairs per cell</option>
                <option value="markdown">Markdown table</option>
              </select>
            </div>

            <div className="border-t border-[#e9ebec] pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.ocrFallbackEnabled}
                  onChange={(e) => patch({ ocrFallbackEnabled: e.target.checked })}
                  className="mt-1 accent-[#405189]"
                />
                <span>
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#495057]">
                    <ScanText size={14} />
                    OCR fallback for scanned filings
                  </span>
                  <span className="block text-[12px] text-[#878a99]">
                    Runs OCR when a page yields less extractable text than the threshold below.
                  </span>
                </span>
              </label>

              {stats && !stats.ocr.available && (
                <p className="mt-2 ml-6 rounded border border-[#f7b84b] bg-[#fef8ec] px-3 py-2 text-[12px] text-[#a67512]">
                  OCR cannot run in this environment, so scanned pages will yield no text even
                  while this setting is on. {stats.ocr.detail}
                </p>
              )}
              {stats?.ocr.available && (
                <p className="mt-2 ml-6 text-[12px] text-[#0ab39c]">
                  Tesseract {stats.ocr.version} available
                  {stats.ocr.languages.length > 0
                    ? ` · languages: ${stats.ocr.languages.join(", ")}`
                    : ""}
                </p>
              )}

              <div className="mt-3 space-y-3 pl-6">
                <NumberField
                  label="Trigger OCR below (characters per page)"
                  value={draft.ocrMinTextChars}
                  min={0}
                  max={5000}
                  disabled={!draft.ocrFallbackEnabled}
                  onChange={(value) => patch({ ocrMinTextChars: value })}
                />
                <div>
                  <span className="mb-1 block text-[12px] font-medium text-[#878a99]">
                    OCR languages
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {OCR_LANGUAGES.map((language) => (
                      <label key={language.code} className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={draft.ocrLanguages.includes(language.code)}
                          onChange={() => toggleLanguage(language.code)}
                          disabled={!draft.ocrFallbackEnabled}
                          className="accent-[#405189]"
                        />
                        <span className="text-[12px] text-[#495057]">{language.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title">Save configuration</h5>
        </div>
        <div className="card-body">
          <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
            Change note (stored with the version)
          </label>
          <input
            value={draft.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="e.g. Smaller child chunks to improve clause-level recall"
            className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saved ? <CheckCircle2 size={14} /> : null}
              {saving ? "Saving…" : "Save as new version"}
            </button>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-4 py-2 text-[13px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              <RefreshCw size={14} />
              Discard changes
            </button>
            <span className="text-[12px] text-[#878a99]">
              Version {active.version} saved by {active.updatedBy}
              {active.updatedAt ? ` on ${new Date(active.updatedAt).toLocaleString()}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title">Chunking preview</h5>
            <button
              type="button"
              onClick={() => void handlePreview()}
              className="cursor-pointer rounded border-0 bg-[#0ab39c] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#099885]"
            >
              Run preview
            </button>
          </div>
          <div className="card-body">
            <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
              Sample text (leave blank to use a built-in regulatory excerpt)
            </label>
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              rows={4}
              placeholder="Paste a clause or table to see how the saved settings split it…"
              className="w-full resize-y rounded border border-[#e9ebec] px-3 py-2 font-mono text-[12px] outline-none focus:border-[#405189]"
            />

            {preview ? (
              <div className="mt-3">
                <p className="m-0 mb-2 text-[12px] text-[#878a99]">
                  {preview.parentCount} parent chunk(s) · {preview.childCount} child chunk(s), using
                  the saved version {active.version} settings.
                </p>
                <ul className="m-0 max-h-[320px] space-y-2 overflow-y-auto p-0">
                  {preview.items.map((item, index) => (
                    <li
                      key={`${item.role}-${item.index}-${index}`}
                      className={`list-none rounded border px-3 py-2 ${
                        item.role === "parent"
                          ? "border-[#405189] bg-[#f7f8fc]"
                          : "border-[#e9ebec] bg-white"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase text-[#878a99]">
                          {item.role} · block {item.index + 1}
                        </span>
                        <span className="font-mono text-[11px] text-[#878a99]">
                          {item.charCount} chars
                        </span>
                      </div>
                      <p className="m-0 text-[12px] text-[#495057]">{item.preview}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 mb-0 text-[12px] text-[#878a99]">
                Run a preview to confirm the split before re-indexing the corpus.
              </p>
            )}
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title flex items-center gap-2">
              <History size={16} />
              Version history
            </h5>
            <span className="rounded bg-[#eef1fa] px-2 py-0.5 text-[11px] font-medium text-[#405189]">
              {versions.length} version{versions.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="card-body">
            {versions.length === 0 ? (
              <p className="m-0 text-[13px] text-[#878a99]">
                No saved versions yet. The defaults above apply until you save.
              </p>
            ) : (
              <ul className="m-0 max-h-[380px] space-y-2 overflow-y-auto p-0">
                {versions.map((version) => (
                  <li
                    key={version.version}
                    className="list-none rounded border border-[#e9ebec] px-3 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="m-0 flex items-center gap-2 text-[13px] font-medium text-[#495057]">
                          Version {version.version}
                          {version.isActive && (
                            <span className="rounded bg-[#daf4f0] px-2 py-0.5 text-[11px] font-medium text-[#0ab39c]">
                              Active
                            </span>
                          )}
                        </p>
                        <p className="m-0 mt-1 font-mono text-[11px] text-[#878a99]">
                          {version.parentChunkChars}/{version.childChunkChars}/
                          {version.chunkOverlapChars} chars ·{" "}
                          {version.tableAwareParsing ? "tables on" : "tables off"} ·{" "}
                          {version.ocrFallbackEnabled ? "OCR on" : "OCR off"}
                        </p>
                        <p className="m-0 mt-1 text-[11px] text-[#878a99]">
                          {version.updatedBy}
                          {version.updatedAt
                            ? ` · ${new Date(version.updatedAt).toLocaleString()}`
                            : ""}
                        </p>
                        {version.notes && (
                          <p className="m-0 mt-1 text-[12px] text-[#495057]">{version.notes}</p>
                        )}
                      </div>
                      {!version.isActive && (
                        <button
                          type="button"
                          onClick={() => void handleRestore(version.version)}
                          className="cursor-pointer rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] text-[#495057] hover:bg-[#f8f9fa]"
                        >
                          Restore
                        </button>
                      )}
                    </div>
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

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="card mb-0">
      <div className="card-body">
        <p className="m-0 text-[12px] font-medium uppercase text-[#878a99]">{label}</p>
        <p className="m-0 mt-1 text-[22px] font-semibold text-[#495057]">{value}</p>
        <p className="m-0 mt-1 text-[11px] text-[#878a99]">{hint}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  hint,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
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
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189] disabled:bg-[#f8f9fa] disabled:text-[#878a99]"
      />
      {hint && <p className="mt-1 mb-0 text-[11px] text-[#878a99]">{hint}</p>}
    </div>
  );
}
