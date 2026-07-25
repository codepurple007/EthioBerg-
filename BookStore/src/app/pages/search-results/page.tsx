import { Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Search Results | Velzon - Admin Dashboard",
};

const results = [
  {
    title: "Velzon - Admin & Dashboard Template",
    url: "https://themesbrand.com/velzon",
    snippet:
      "Velzon is a fully featured premium admin template built with Bootstrap 5, React, and Vue. Includes dashboards, apps, and UI kits.",
  },
  {
    title: "Getting Started with Velzon",
    url: "https://themesbrand.com/velzon/docs",
    snippet:
      "Learn how to install Velzon, customize layouts, and integrate charts, tables, and authentication pages into your project.",
  },
  {
    title: "CRM Dashboard Overview",
    url: "/dashboards/crm",
    snippet:
      "Track deals, leads, and revenue with Velzon CRM widgets including pipelines, forecasts, and activity feeds.",
  },
  {
    title: "Invoice Management App",
    url: "/apps/invoices/list",
    snippet:
      "Create, list, and manage invoices with status filters, payment tracking, and printable invoice layouts.",
  },
  {
    title: "Support Tickets Module",
    url: "/apps/tickets/list",
    snippet:
      "Organize customer support with ticket lists, priority badges, and detailed ticket conversation views.",
  },
];

export default function SearchResultsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Search Results"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Search Results" },
        ]}
      />
      <div className="card mb-4">
        <div className="card-body">
          <form className="flex flex-wrap gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                type="search"
                defaultValue="Velzon admin"
                className="w-full rounded border border-[#e9ebec] py-2.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189]"
              />
            </div>
            <button
              type="submit"
              className="rounded border-0 bg-[#405189] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              Search
            </button>
          </form>
          <p className="mt-3 mb-0 text-[12px] text-[#878a99]">
            Showing 1–5 of 23 results
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.title} className="card">
            <div className="card-body">
              <a
                href={r.url}
                className="text-[15px] font-semibold text-[#405189] no-underline hover:underline"
              >
                {r.title}
              </a>
              <p className="mt-0.5 mb-1 text-[12px] text-[#0ab39c]">{r.url}</p>
              <p className="m-0 text-[13px] leading-relaxed text-[#878a99]">
                {r.snippet}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
