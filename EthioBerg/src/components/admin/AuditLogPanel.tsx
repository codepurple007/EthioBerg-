"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type { AuditEvent, AuditLogFilters } from "@/lib/types";
import { auditActionLabels } from "@/lib/sources/labels";
import { demoUsers } from "@/lib/mock/seed-data";

const emptyFilters: AuditLogFilters = {
  actorId: "",
  action: "",
  result: undefined,
  from: "",
  to: "",
  search: "",
};

export default function AuditLogPanel() {
  const { api, mode } = useEthioApi();
  const [applied, setApplied] = useState<AuditLogFilters>(emptyFilters);
  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const actions = useMemo(
    () => [...new Set(rows.map((event) => event.action))].sort(),
    [rows],
  );

  async function load(filters: AuditLogFilters = {}) {
    setLoading(true);
    try {
      setRows(await api.getAuditLogs(filters));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [api]);

  function applyFilters() {
    const normalized: AuditLogFilters = {
      actorId: applied.actorId || undefined,
      action: applied.action || undefined,
      result: applied.result,
      search: applied.search || undefined,
    };
    void load(normalized);
  }

  function resetFilters() {
    setApplied(emptyFilters);
    void load();
  }

  return (
    <>
      <PageHeader
        title="Audit Log"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration", href: "/admin/settings" },
          { label: "Audit" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Audit events are loaded from the append-only SQLite audit table.
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title flex items-center gap-2">
            <Filter size={16} />
            Filters
          </h5>
          <button
            type="button"
            onClick={() => void load(applied)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] text-[#495057] hover:bg-[#f8f9fa]"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Actor</label>
              <select
                value={applied.actorId ?? ""}
                onChange={(e) => setApplied((prev) => ({ ...prev, actorId: e.target.value }))}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="">All actors</option>
                {demoUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Action</label>
              <select
                value={applied.action ?? ""}
                onChange={(e) => setApplied((prev) => ({ ...prev, action: e.target.value }))}
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="">All actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {auditActionLabels[action] ?? action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Result</label>
              <select
                value={applied.result ?? ""}
                onChange={(e) =>
                  setApplied((prev) => ({
                    ...prev,
                    result: e.target.value
                      ? (e.target.value as AuditEvent["result"])
                      : undefined,
                  }))
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="">All results</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Search</label>
              <input
                value={applied.search ?? ""}
                onChange={(e) => setApplied((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Entity ID, type, action…"
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="cursor-pointer rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer rounded border border-[#e9ebec] bg-white px-4 py-2 text-[13px] text-[#495057] hover:bg-[#f8f9fa]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Events ({rows.length})</h5>
        </div>
        {loading ? (
          <div className="card-body text-[13px] text-[#878a99]">Loading audit events…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Timestamp</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Actor</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Action</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Entity</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#878a99]">
                      No audit events match your filters.
                    </td>
                  </tr>
                )}
                {rows.map((event) => (
                  <tr key={event.id} className="border-b border-[#e9ebec] last:border-0">
                    <td className="px-4 py-3 text-[#878a99]">
                      {new Date(event.timestamp).toLocaleString("en-ET", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-[#495057]">{event.actorName}</td>
                    <td className="px-4 py-3 text-[#495057]">
                      {auditActionLabels[event.action] ?? event.action}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#495057]">{event.entityType}</span>
                      <span className="block font-mono text-[11px] text-[#878a99]">
                        {event.entityId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                          event.result === "success"
                            ? "bg-[#daf4f0] text-[#0ab39c]"
                            : "bg-[#fde8e4] text-[#f06548]"
                        }`}
                      >
                        {event.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
