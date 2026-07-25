"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

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

export default function JobGrid() {
  const [query, setQuery] = useState("");
  const list = jobs.filter((j) => !query || j.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="card"><div className="card-body">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search jobs..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((j) => (
          <div key={j.id} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#405189] text-[12px] font-bold text-white">{j.company.slice(0,2)}</div>
                <span className="rounded bg-[#e2e5ed] px-2 py-0.5 text-[11px] font-medium text-[#405189]">{j.type}</span>
              </div>
              <Link href="/apps/jobs/overview" className="font-semibold text-[#405189] no-underline hover:underline">{j.title}</Link>
              <p className="mt-1 mb-2 text-[12px] text-[#878a99]">{j.company}</p>
              <p className="m-0 inline-flex items-center gap-1 text-[12px] text-[#878a99]"><MapPin size={12} />{j.location}</p>
              <p className="mt-3 mb-0 text-[13px] font-semibold text-[#0ab39c]">{j.salary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
