"use client";
import { useState } from "react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const candidates = [
  { name: "Tonya Johnson", role: "UI/UX Designer", location: "USA", status: "New" },
  { name: "Helen Hawkins", role: "React Developer", location: "UK", status: "Pending" },
  { name: "John Robles", role: "Product Manager", location: "Germany", status: "Hired" },
  { name: "Ashley Silva", role: "Marketing Specialist", location: "Canada", status: "New" },
  { name: "James Forbes", role: "Business Analyst", location: "USA", status: "Rejected" },
  { name: "Erica Kernan", role: "HR Executive", location: "Italy", status: "Pending" },
];
const st: Record<string,string> = { New:"bg-[#e1f0fa] text-[#299cdb]", Pending:"bg-[#fef4e4] text-[#f7b84b]", Rejected:"bg-[#fde8e4] text-[#f06548]", Hired:"bg-[#daf4f0] text-[#0ab39c]" };

export default function CandidatesGrid() {
  const [following, setFollowing] = useState<string[]>([]);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {candidates.map((c, i) => (
        <div key={c.name} className="card">
          <div className="card-body text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-[18px] font-bold text-white" style={{ background: avatarColors[i%avatarColors.length] }}>{c.name.split(" ").map(n=>n[0]).join("")}</div>
            <h5 className="m-0 text-[15px] font-semibold text-[#495057]">{c.name}</h5>
            <p className="mt-1 mb-2 text-[13px] text-[#878a99]">{c.role}</p>
            <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[c.status]}`}>{c.status}</span>
            <p className="mt-3 mb-3 text-[12px] text-[#878a99]">{c.location}</p>
            <button type="button" onClick={()=>setFollowing((p)=>p.includes(c.name)?p.filter(x=>x!==c.name):[...p,c.name])} className={following.includes(c.name)?btnPrimary:btnSoft}>
              {following.includes(c.name)?"Saved":"Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
