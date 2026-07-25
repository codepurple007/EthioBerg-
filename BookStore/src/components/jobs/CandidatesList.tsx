"use client";
import { useMemo, useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const candidates = [
  { name: "Tonya Johnson", designation: "UI/UX Designer", type: "Full Time", status: "New", date: "02 Dec, 2021" },
  { name: "Helen Hawkins", designation: "React Developer", type: "Freelance", status: "Pending", date: "08 Dec, 2021" },
  { name: "John Robles", designation: "Product Manager", type: "Part Time", status: "Rejected", date: "12 Dec, 2021" },
  { name: "Ashley Silva", designation: "Marketing Specialist", type: "Full Time", status: "Hired", date: "15 Dec, 2021" },
  { name: "James Forbes", designation: "Business Analyst", type: "Remote", status: "New", date: "20 Dec, 2021" },
  { name: "Erica Kernan", designation: "HR Executive", type: "Full Time", status: "Pending", date: "22 Dec, 2021" },
];
const st: Record<string,string> = { New:"bg-[#e1f0fa] text-[#299cdb]", Pending:"bg-[#fef4e4] text-[#f7b84b]", Rejected:"bg-[#fde8e4] text-[#f06548]", Hired:"bg-[#daf4f0] text-[#0ab39c]" };

export default function CandidatesList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => candidates.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.designation.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title">Candidate Lists</h5></div>
      <div className="border-b border-[#e9ebec] px-4 py-3">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search candidates..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Candidate","Designation","Type","Status","Applied Date","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((c,i)=>(
            <tr key={c.name} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: avatarColors[i%avatarColors.length] }}>{c.name.split(" ").map(n=>n[0]).join("")}</div>
                  <span className="font-medium">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">{c.designation}</td>
              <td className="px-4 py-3">{c.type}</td>
              <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[c.status]}`}>{c.status}</span></td>
              <td className="px-4 py-3 text-[#878a99]">{c.date}</td>
              <td className="px-4 py-3"><button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:bg-[#f3f6f9]"><MoreHorizontal size={16} /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
