"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const jobs = [
  { id: "#JB001", title: "Business Associate", company: "Themesbrand", location: "California", type: "Full Time", salary: "$40k - $60k", posted: "02 Dec, 2021", status: "Active" },
  { id: "#JB002", title: "Education Specialist", company: "Syntyce", location: "Germany", type: "Freelance", salary: "$30k - $50k", posted: "08 Dec, 2021", status: "Active" },
  { id: "#JB003", title: "Teacher Assistant", company: "MicroDesign", location: "Denmark", type: "Part Time", salary: "$20k - $35k", posted: "15 Dec, 2021", status: "Close" },
  { id: "#JB004", title: "Product Marketing Specialist", company: "Themesbrand", location: "Italy", type: "Full Time", salary: "$55k - $75k", posted: "20 Dec, 2021", status: "Active" },
  { id: "#JB005", title: "UI/UX Designer", company: "Nesta", location: "USA", type: "Remote", salary: "$45k - $70k", posted: "22 Dec, 2021", status: "Active" },
  { id: "#JB006", title: "React Developer", company: "Force Med", location: "Canada", type: "Full Time", salary: "$70k - $95k", posted: "24 Dec, 2021", status: "New" },
];

const st: Record<string,string> = { Active:"bg-[#daf4f0] text-[#0ab39c]", Close:"bg-[#fde8e4] text-[#f06548]", New:"bg-[#e1f0fa] text-[#299cdb]" };

export default function JobList() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const filtered = useMemo(() => jobs.filter((j) => {
    const mt = type === "All" || j.type === type;
    const q = query.toLowerCase();
    return mt && (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
  }), [query, type]);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-3">
        <h5 className="card-title">Job Lists</h5>
        <Link href="/apps/jobs/new" className={btnPrimary + " no-underline"}>Add Job</Link>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-[#e9ebec] px-4 py-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for jobs..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" />
        </div>
        <select className={selectCls+" w-auto"} value={type} onChange={(e)=>setType(e.target.value)}>
          <option>All</option><option>Full Time</option><option>Part Time</option><option>Freelance</option><option>Remote</option>
        </select>
      </div>
      <div className="divide-y divide-[#e9ebec]">
        {filtered.map((j) => (
          <div key={j.id} className="flex flex-wrap items-center gap-4 px-4 py-4 hover:bg-[#f8f9fa]">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-[#e2e5ed] text-[#405189]"><Briefcase size={18} /></div>
            <div className="min-w-0 flex-1">
              <Link href="/apps/jobs/overview" className="font-semibold text-[#405189] no-underline hover:underline">{j.title}</Link>
              <p className="m-0 text-[12px] text-[#878a99]">{j.company} · {j.id}</p>
              <div className="mt-1 flex flex-wrap gap-3 text-[12px] text-[#878a99]">
                <span className="inline-flex items-center gap-1"><MapPin size={12} />{j.location}</span>
                <span>{j.type}</span>
                <span>{j.salary}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[j.status]}`}>{j.status}</span>
              <p className="mt-1 mb-0 text-[12px] text-[#878a99]">{j.posted}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
