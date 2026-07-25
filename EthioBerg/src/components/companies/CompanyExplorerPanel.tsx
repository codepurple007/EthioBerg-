"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Loader2, Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ExploreResponsePanel from "@/components/companies/ExploreResponsePanel";
import { EXPLORE_INTENT_LABELS } from "@/lib/companies/labels";
import { useEthioApi } from "@/providers/ApiProvider";
import type {
  Company,
  CompanyExploreIntent,
  CompanyExploreResponse,
  CompanyResolveResponse,
} from "@/lib/types";

export default function CompanyExplorerPanel() {
  const { api, mode } = useEthioApi();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [intent, setIntent] = useState<CompanyExploreIntent>("company_price_history");
  const [resolution, setResolution] = useState<CompanyResolveResponse | null>(null);
  const [response, setResponse] = useState<CompanyExploreResponse | null>(null);
  const [showSyntheticCharts, setShowSyntheticCharts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getCompanies().then((rows) => {
      if (active) {
        setCompanies(rows);
        if (rows[0]) setSelectedCompanyId(rows[0].id);
      }
    });
    return () => {
      active = false;
    };
  }, [api]);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId),
    [companies, selectedCompanyId],
  );

  async function handleResolve(nextQuery: string) {
    if (!nextQuery.trim()) {
      setResolution(null);
      return;
    }
    try {
      const result = await api.resolveCompany(nextQuery);
      setResolution(result);
      if (result.status === "RESOLVED" && result.company) {
        setSelectedCompanyId(result.company.id);
      }
    } catch {
      setResolution(null);
    }
  }

  async function handleExplore(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload = {
      intent,
      ...(query.trim() ? { query: query.trim() } : { companyId: selectedCompanyId }),
    };

    try {
      const result = await api.exploreCompany(payload);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build company response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Company Explorer"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Company Explorer" },
        ]}
      />

      <div className="mb-4 rounded border border-[#e9ebec] bg-white px-4 py-3 text-[13px] text-[#495057]">
        Explore ESX listed issuers with controlled chart templates, explicit data-status labelling, and
        downloadable observation tables.{" "}
        <span className="text-[#878a99]">API mode: {mode === "remote" ? "Python backend" : "local mock"}.</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <form className="card h-fit" onSubmit={handleExplore}>
          <div className="card-header flex items-center gap-2">
            <Building2 size={16} className="text-[#405189]" />
            <h5 className="card-title m-0">Select company & view</h5>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label htmlFor="company-search" className="mb-1 block text-[12px] font-medium text-[#495057]">
                Search by name, alias, or ticker
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878a99]" />
                <input
                  id="company-search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    void handleResolve(event.target.value);
                  }}
                  placeholder="e.g. AWASH or Ethio Telecom"
                  className="w-full rounded border border-[#ced4da] py-2 pl-9 pr-3 text-[13px] text-[#495057]"
                />
              </div>
              {resolution?.status === "AMBIGUOUS" ? (
                <div className="mt-2 rounded border border-[#fff3cd] bg-[#fff8e6] px-3 py-2 text-[12px] text-[#856404]">
                  Ambiguous query. Choose a company below or refine the search.
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="company-select" className="mb-1 block text-[12px] font-medium text-[#495057]">
                Listed company
              </label>
              <select
                id="company-select"
                value={selectedCompanyId}
                onChange={(event) => setSelectedCompanyId(event.target.value)}
                className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057]"
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.ticker} — {company.officialName}
                  </option>
                ))}
              </select>
            </div>

            {selectedCompany ? (
              <div className="rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-2 text-[12px] text-[#495057]">
                <p className="m-0 font-medium">{selectedCompany.officialName}</p>
                <p className="m-0 mt-1 text-[#878a99]">
                  {selectedCompany.sector} · {selectedCompany.segment} Market · Listed{" "}
                  {selectedCompany.listingDate}
                </p>
              </div>
            ) : null}

            <div>
              <label htmlFor="explore-intent" className="mb-1 block text-[12px] font-medium text-[#495057]">
                Response template
              </label>
              <select
                id="explore-intent"
                value={intent}
                onChange={(event) => setIntent(event.target.value as CompanyExploreIntent)}
                className="w-full rounded border border-[#ced4da] px-3 py-2 text-[13px] text-[#495057]"
              >
                {Object.entries(EXPLORE_INTENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-[12px] text-[#495057]">
              <input
                type="checkbox"
                checked={showSyntheticCharts}
                onChange={(event) => setShowSyntheticCharts(event.target.checked)}
              />
              Show synthetic charts
            </label>

            {error ? (
              <div className="rounded border border-[#f06548]/30 bg-[#fff5f3] px-3 py-2 text-[13px] text-[#c03221]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || (!selectedCompanyId && !query.trim())}
              className="inline-flex items-center gap-2 rounded bg-[#405189] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? "Building response…" : "Explore company"}
            </button>
          </div>
        </form>

        {response ? (
          <ExploreResponsePanel response={response} hideSyntheticCharts={!showSyntheticCharts} />
        ) : (
          <div className="card">
            <div className="card-body text-[13px] text-[#878a99]">
              Choose a listed issuer and response template to render a controlled company response with
              charts, status banners, and downloadable tables.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
