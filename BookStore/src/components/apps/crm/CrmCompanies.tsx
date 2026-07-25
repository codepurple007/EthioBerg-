"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Building2,
  Globe,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type Company = {
  id: number;
  name: string;
  owner: string;
  industry: string;
  location: string;
  employee: string;
  website: string;
  revenue: string;
  color: string;
};

const companiesData: Company[] = [
  {
    id: 1,
    name: "Themesbrand",
    owner: "Erica Kernan",
    industry: "Computer Software",
    location: "Germany",
    employee: "10-50",
    website: "www.themesbrand.com",
    revenue: "$5M - $10M",
    color: "#405189",
  },
  {
    id: 2,
    name: "Nazox",
    owner: "Prezy William",
    industry: "Internet",
    location: "United Kingdom",
    employee: "50-100",
    website: "www.nazox.com",
    revenue: "$1M - $5M",
    color: "#0ab39c",
  },
  {
    id: 3,
    name: "Skote",
    owner: "Alexis Clarke",
    industry: "Computer Software",
    location: "United States",
    employee: "10-50",
    website: "www.skote.com",
    revenue: "$10M+",
    color: "#299cdb",
  },
  {
    id: 4,
    name: "Minible",
    owner: "James Morris",
    industry: "Finance",
    location: "Canada",
    employee: "100-250",
    website: "www.minible.com",
    revenue: "$5M - $10M",
    color: "#f7b84b",
  },
  {
    id: 5,
    name: "Doot",
    owner: "Nancy Martino",
    industry: "Communications",
    location: "France",
    employee: "10-50",
    website: "www.doot.com",
    revenue: "$1M - $5M",
    color: "#f06548",
  },
  {
    id: 6,
    name: "Velzon",
    owner: "Tonya Johnson",
    industry: "Computer Software",
    location: "United States",
    employee: "50-100",
    website: "www.themesbrand.com/velzon",
    revenue: "$10M+",
    color: "#405189",
  },
];

export default function CrmCompanies() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(companiesData);

  const filtered = useMemo(
    () =>
      rows.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.industry.toLowerCase().includes(query.toLowerCase()) ||
          c.location.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex-wrap gap-2">
          <h5 className="card-title">Companies</h5>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies..."
                className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-1.5 text-[13px] font-medium text-white"
            >
              <Plus size={14} /> Add Company
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.id} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded"
                  style={{ background: `${c.color}18`, color: c.color }}
                >
                  <Building2 size={20} />
                </span>
                <button type="button" className="text-[#878a99]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h6 className="m-0 mb-1 text-[15px] font-semibold text-[#495057]">
                {c.name}
              </h6>
              <p className="m-0 mb-3 text-[12px] text-[#878a99]">
                Owner: {c.owner}
              </p>
              <div className="mb-3 space-y-1 text-[12px] text-[#878a99]">
                <p className="m-0">Industry: {c.industry}</p>
                <p className="m-0">Location: {c.location}</p>
                <p className="m-0">Employee: {c.employee}</p>
                <p className="m-0">Revenue: {c.revenue}</p>
                <p className="m-0 flex items-center gap-1">
                  <Globe size={12} /> {c.website}
                </p>
              </div>
              <div className="flex gap-1 border-t border-[#e9ebec] pt-3 text-[#878a99]">
                <button
                  type="button"
                  className="rounded p-1.5 hover:bg-[#e1f0fa] hover:text-[#299cdb]"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 hover:bg-[#fef4e4] hover:text-[#f7b84b]"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRows((prev) => prev.filter((r) => r.id !== c.id))
                  }
                  className="rounded p-1.5 hover:bg-[#fde8e4] hover:text-[#f06548]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
