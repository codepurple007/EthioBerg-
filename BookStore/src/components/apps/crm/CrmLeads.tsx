"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  score: number;
  location: string;
  date: string;
  status: LeadStatus;
  tags: string[];
  avatar: string;
};

const leadsData: Lead[] = [
  {
    id: "#VZ2101",
    name: "Alexis Clarke",
    company: "Themesbrand",
    email: "alexis@themesbrand.com",
    phone: "+(256) 2451 8974",
    score: 154,
    location: "California, US",
    date: "15 Dec, 2021",
    status: "New",
    tags: ["Lead", "Partner"],
    avatar: "AC",
  },
  {
    id: "#VZ2102",
    name: "James Morris",
    company: "Nazox",
    email: "james@nazox.com",
    phone: "+(91) 2451 8974",
    score: 236,
    location: "London, UK",
    date: "17 Dec, 2021",
    status: "Contacted",
    tags: ["Exiting"],
    avatar: "JM",
  },
  {
    id: "#VZ2103",
    name: "Nancy Martino",
    company: "Skote",
    email: "nancy@skote.com",
    phone: "+(32) 4500 8974",
    score: 197,
    location: "Berlin, DE",
    date: "19 Dec, 2021",
    status: "Qualified",
    tags: ["Long-term"],
    avatar: "NM",
  },
  {
    id: "#VZ2104",
    name: "Michael Morris",
    company: "Minible",
    email: "michael@minible.com",
    phone: "+(01) 2345 6789",
    score: 98,
    location: "Toronto, CA",
    date: "21 Dec, 2021",
    status: "Lost",
    tags: ["Lead"],
    avatar: "MM",
  },
  {
    id: "#VZ2105",
    name: "Tonya Johnson",
    company: "Velzon",
    email: "tonya@velzon.com",
    phone: "+(44) 2045 8974",
    score: 215,
    location: "New York, US",
    date: "23 Dec, 2021",
    status: "New",
    tags: ["Partner", "Lead"],
    avatar: "TJ",
  },
  {
    id: "#VZ2106",
    name: "Herbert Stokes",
    company: "Doot",
    email: "herbert@doot.com",
    phone: "+(49) 3045 8974",
    score: 168,
    location: "Paris, FR",
    date: "26 Dec, 2021",
    status: "Contacted",
    tags: ["Exiting"],
    avatar: "HS",
  },
];

const statusStyle: Record<LeadStatus, string> = {
  New: "bg-[#e1f0fa] text-[#299cdb]",
  Contacted: "bg-[#fef4e4] text-[#d29e2c]",
  Qualified: "bg-[#daf4f0] text-[#0ab39c]",
  Lost: "bg-[#fde8e4] text-[#f06548]",
};

const colors = ["#405189", "#0ab39c", "#299cdb", "#f7b84b", "#f06548"];

export default function CrmLeads() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [rows, setRows] = useState(leadsData);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.toLowerCase();
      const statusOk = statusFilter === "All" || r.status === statusFilter;
      return (
        statusOk &&
        (r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q))
      );
    });
  }, [rows, query, statusFilter]);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-2">
        <h5 className="card-title">Leads</h5>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads..."
              className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-[#e9ebec] bg-white px-2 py-1.5 text-[13px] outline-none"
          >
            {["All", "New", "Contacted", "Qualified", "Lost"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-1.5 text-[13px] font-medium text-white"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>
      <div className="card-body overflow-x-auto p-0">
        <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e9ebec] bg-[#f3f3f9] text-[#878a99]">
              <th className="px-4 py-3 font-medium">Lead ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-[#e9ebec] hover:bg-[#fafafa]"
              >
                <td className="px-4 py-3 font-medium text-[#405189]">{r.id}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 font-medium text-[#495057]">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ background: colors[i % colors.length] }}
                    >
                      {r.avatar}
                    </span>
                    {r.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#878a99]">{r.company}</td>
                <td className="px-4 py-3 text-[#878a99]">{r.email}</td>
                <td className="px-4 py-3 font-semibold text-[#495057]">
                  {r.score}
                </td>
                <td className="px-4 py-3 text-[#878a99]">{r.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${statusStyle[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 text-[#878a99]">
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
                        setRows((prev) => prev.filter((x) => x.id !== r.id))
                      }
                      className="rounded p-1.5 hover:bg-[#fde8e4] hover:text-[#f06548]"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-[#f3f3f9]"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
