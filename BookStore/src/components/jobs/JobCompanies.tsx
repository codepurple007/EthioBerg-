"use client";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const companies = [
  { name: "Themesbrand", jobs: 12, location: "California, USA", industry: "Software" },
  { name: "Syntyce Solutions", jobs: 8, location: "Germany", industry: "IT Services" },
  { name: "Micro Design", jobs: 5, location: "Denmark", industry: "Design" },
  { name: "Nesta Technologies", jobs: 15, location: "Italy", industry: "Technology" },
  { name: "Force Medicines", jobs: 3, location: "USA", industry: "Healthcare" },
  { name: "Meta4Systems", jobs: 9, location: "Canada", industry: "Software" },
];

export default function JobCompanies() {
  const [query, setQuery] = useState("");
  const list = companies.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="card"><div className="card-body">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search companies..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <div key={c.name} className="card"><div className="card-body">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded bg-[#405189] text-[12px] font-bold text-white">{c.name.slice(0,2)}</div>
              <div>
                <p className="m-0 font-semibold text-[#495057]">{c.name}</p>
                <p className="m-0 text-[12px] text-[#878a99]">{c.industry}</p>
              </div>
            </div>
            <p className="m-0 inline-flex items-center gap-1 text-[12px] text-[#878a99]"><MapPin size={12} />{c.location}</p>
            <p className="mt-2 mb-0 text-[13px] font-medium text-[#0ab39c]">{c.jobs} Open Positions</p>
          </div></div>
        ))}
      </div>
    </div>
  );
}
