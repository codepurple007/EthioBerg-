"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  TestTube2,
  Power,
  PowerOff,
  Database,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AddSourceModal from "@/components/sources/AddSourceModal";
import {
  ActiveStatusBadge,
  IndexStatusBadge,
  TrustClassBadge,
} from "@/components/sources/SourceBadges";
import type { AddSourceInput, SourceDocument } from "@/lib/types";
import { formatChecksum, issuingBodyLabels } from "@/lib/sources/labels";
import { useEthioApi } from "@/providers/ApiProvider";

type StatusFilter = "all" | "active" | "retired";

export default function SourceLibraryPanel() {
  const { api, mode } = useEthioApi();
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [bodyFilter, setBodyFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSources(await api.getSources());
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const stats = useMemo(
    () => ({
      active: sources.filter((s) => s.isActive).length,
      retired: sources.filter((s) => !s.isActive).length,
      indexed: sources.filter((s) => s.indexStatus === "indexed").length,
      pending: sources.filter((s) => s.indexStatus === "pending").length,
    }),
    [sources],
  );

  const filtered = useMemo(() => {
    return sources.filter((source) => {
      if (statusFilter === "active" && !source.isActive) return false;
      if (statusFilter === "retired" && source.isActive) return false;
      if (bodyFilter !== "all" && source.issuingBody !== bodyFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        source.title.toLowerCase().includes(q) ||
        source.version.toLowerCase().includes(q) ||
        source.id.toLowerCase().includes(q) ||
        source.checksum.toLowerCase().includes(q)
      );
    });
  }, [sources, search, statusFilter, bodyFilter]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }

  async function handleAddSource(input: AddSourceInput, forceDuplicate: boolean) {
    const result = await api.addSource(input, forceDuplicate);
    if (!result.ok) {
      if (result.duplicateId) {
        setDuplicateWarning(true);
        showToast(result.error);
      } else {
        showToast(result.error);
      }
      return;
    }
    setDuplicateWarning(false);
    setModalOpen(false);
    await refresh();
    showToast(`Source "${result.source.title}" added with pending index status.`);
  }

  async function toggleActive(source: SourceDocument) {
    if (source.isActive) {
      await api.retireSource(source.id);
      showToast(`"${source.title}" retired. Historical runs keep their original reference.`);
    } else {
      await api.activateSource(source.id);
      showToast(`"${source.title}" activated.`);
    }
    await refresh();
  }

  async function markIndexed(id: string) {
    await api.indexSource(id);
    await refresh();
    showToast("Source marked as indexed.");
  }

  async function smokeTest(id: string) {
    const result = await api.runRetrievalSmokeTest(id);
    showToast(result.message);
    await refresh();
  }

  return (
    <>
      <PageHeader
        title="Source Library"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration", href: "/admin/settings" },
          { label: "Sources" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Connected to Python API — deterministic rules and SQLite persistence are active.
        </div>
      )}

      {toast && (
        <div className="mb-4 rounded border border-[#299cdb] bg-[#e1f0fa] px-4 py-3 text-[13px] text-[#495057]">
          {toast}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Active", value: stats.active, color: "text-[#0ab39c]" },
          { label: "Retired", value: stats.retired, color: "text-[#878a99]" },
          { label: "Indexed", value: stats.indexed, color: "text-[#299cdb]" },
          { label: "Pending index", value: stats.pending, color: "text-[#b8860b]" },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="card-body py-3">
              <p className="mb-1 text-[12px] text-[#878a99]">{item.label}</p>
              <p className={`m-0 text-[22px] font-semibold ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header flex-wrap gap-3">
          <h5 className="card-title">Regulatory corpus</h5>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setDuplicateWarning(false);
                setModalOpen(true);
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#405189] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#364574]"
            >
              <Plus size={14} />
              Add source
            </button>
          </div>
        </div>

        <div className="border-b border-[#e9ebec] px-4 py-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, version, ID, checksum…"
                className="w-full rounded border border-[#e9ebec] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="retired">Retired only</option>
            </select>
            <select
              value={bodyFilter}
              onChange={(e) => setBodyFilter(e.target.value)}
              className="rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
            >
              <option value="all">All issuers</option>
              <option value="ECMA">ECMA</option>
              <option value="ESX">ESX</option>
              <option value="FDRE">FDRE</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                <th className="px-4 py-3 font-semibold text-[#878a99]">Source</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Issuer</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Version</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Effective</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Trust</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Index</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#878a99]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#878a99]">
                    No sources match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((source) => (
                <Fragment key={source.id}>
                  <tr className="border-b border-[#e9ebec] hover:bg-[#fafbfc]">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expandedId === source.id ? null : source.id)
                        }
                        className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-[#405189] hover:underline"
                      >
                        {source.title}
                      </button>
                      <p className="m-0 mt-0.5 font-mono text-[11px] text-[#878a99]">
                        {source.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[#495057]">
                      {issuingBodyLabels[source.issuingBody]}
                    </td>
                    <td className="px-4 py-3 text-[#495057]">{source.version}</td>
                    <td className="px-4 py-3 text-[#878a99]">
                      {source.effectiveFrom}
                      {source.effectiveTo ? ` → ${source.effectiveTo}` : " → present"}
                    </td>
                    <td className="px-4 py-3">
                      <TrustClassBadge trustClass={source.trustClass} />
                    </td>
                    <td className="px-4 py-3">
                      <IndexStatusBadge status={source.indexStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <ActiveStatusBadge isActive={source.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          title={source.isActive ? "Retire source" : "Activate source"}
                          onClick={() => toggleActive(source)}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f8f9fa]"
                        >
                          {source.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                        </button>
                        {source.indexStatus === "pending" && (
                          <button
                            type="button"
                            title="Mark indexed"
                            onClick={() => markIndexed(source.id)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f8f9fa]"
                          >
                            <Database size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Retrieval smoke test"
                          onClick={() => smokeTest(source.id)}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f8f9fa]"
                        >
                          <TestTube2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === source.id && (
                    <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase text-[#878a99]">
                              Checksum
                            </p>
                            <p className="m-0 font-mono text-[12px] text-[#495057]">
                              {formatChecksum(source.checksum)}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase text-[#878a99]">
                              Language
                            </p>
                            <p className="m-0 text-[13px] text-[#495057]">
                              {source.language === "en" ? "English" : "Amharic"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase text-[#878a99]">
                              Published
                            </p>
                            <p className="m-0 text-[13px] text-[#495057]">
                              {source.publicationDate}
                            </p>
                          </div>
                          {source.url && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <p className="mb-1 text-[11px] font-semibold uppercase text-[#878a99]">
                                Official URL
                              </p>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[13px] text-[#405189] no-underline hover:underline"
                              >
                                {source.url}
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddSourceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setDuplicateWarning(false);
        }}
        duplicateWarning={duplicateWarning}
        onSubmit={handleAddSource}
      />
    </>
  );
}
