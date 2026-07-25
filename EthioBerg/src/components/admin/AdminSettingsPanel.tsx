"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type { AppSettings, RuleDefinition } from "@/lib/types";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminSettingsPanel() {
  const { api, mode } = useEthioApi();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [nextSettings, nextRules] = await Promise.all([api.getSettings(), api.getRules()]);
        if (active) {
          setSettings(nextSettings);
          setRules(nextRules);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [api]);

  const draftRules = rules.filter((r) => r.reviewStatus === "DRAFT");
  const approvedRules = rules.filter((r) => r.reviewStatus === "APPROVED");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }

  async function handleSave() {
    if (!settings) return;
    const updated = await api.updateSettings({
      syntheticDemoEnabled: settings.syntheticDemoEnabled,
      activeRuleVersion: settings.activeRuleVersion,
    });
    setSettings(updated);
    setSaved(true);
    showToast("Settings saved. Changes are recorded in the audit log.");
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function approveRule(ruleId: string) {
    const updated = await api.approveRule(ruleId);
    if (!updated) return;
    setRules(await api.getRules());
    showToast(`Rule "${updated.name}" approved for evaluation.`);
  }

  if (loading || !settings) {
    return <p className="text-[13px] text-[#878a99]">Loading admin settings…</p>;
  }

  return (
    <>
      <PageHeader
        title="Admin Settings"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Administration" },
          { label: "Settings" },
        ]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Settings and rule approvals persist in SQLite via the Python API.
        </div>
      )}

      {toast && (
        <div className="mb-4 rounded border border-[#299cdb] bg-[#e1f0fa] px-4 py-3 text-[13px] text-[#495057]">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Deployment profile</h5>
          </div>
          <div className="card-body space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={settings.syntheticDemoEnabled}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, syntheticDemoEnabled: e.target.checked } : prev,
                  )
                }
                className="mt-1 accent-[#405189]"
              />
              <span>
                <span className="block text-[13px] font-medium text-[#495057]">
                  Enable synthetic demo charts
                </span>
                <span className="block text-[12px] text-[#878a99]">
                  When disabled, synthetic market fixtures are prohibited globally (FR-ADM-003).
                </span>
              </span>
            </label>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Active rule version
              </label>
              <select
                value={settings.activeRuleVersion}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev ? { ...prev, activeRuleVersion: e.target.value } : prev,
                  )
                }
                className="w-full rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
              >
                <option value="2025.1-draft">2025.1-draft</option>
                <option value="2025.1-approved">2025.1-approved</option>
                <option value="2024.2-retired">2024.2-retired</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#878a99]">
                Disclaimer text (read-only)
              </label>
              <textarea
                readOnly
                rows={4}
                value={settings.disclaimerText}
                className="w-full resize-none rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-2 text-[13px] text-[#495057] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleSave()}
              className="inline-flex cursor-pointer items-center gap-2 rounded border-0 bg-[#405189] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              {saved ? <CheckCircle2 size={14} /> : null}
              Save settings
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Rule approval queue</h5>
            <span className="rounded bg-[#fef4e4] px-2 py-0.5 text-[11px] font-medium text-[#b8860b]">
              {draftRules.length} draft
            </span>
          </div>
          <div className="card-body">
            {draftRules.length === 0 ? (
              <p className="m-0 text-[13px] text-[#878a99]">
                All active rules are approved by the financial-domain reviewer.
              </p>
            ) : (
              <ul className="m-0 space-y-3 p-0">
                {draftRules.map((rule) => (
                  <li
                    key={rule.ruleId}
                    className="list-none rounded border border-[#e9ebec] px-3 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{rule.name}</p>
                        <p className="m-0 mt-1 font-mono text-[11px] text-[#878a99]">
                          {rule.ruleId} · {rule.segment} · {rule.threshold} {rule.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void approveRule(rule.ruleId)}
                        className="cursor-pointer rounded border-0 bg-[#0ab39c] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#099885]"
                      >
                        Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-[#e9ebec] pt-4">
              <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase text-[#878a99]">
                <ShieldAlert size={14} />
                Approved rules ({approvedRules.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {approvedRules.map((rule) => (
                  <span
                    key={rule.ruleId}
                    className="rounded bg-[#daf4f0] px-2 py-1 text-[11px] font-medium text-[#0ab39c]"
                  >
                    {rule.ruleId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
