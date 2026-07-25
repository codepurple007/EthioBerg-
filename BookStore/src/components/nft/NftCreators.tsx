"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const creators = [
  { name: "Artistic", items: 245, followers: "12.4k", eth: "148.5 ETH", color: "#405189" },
  { name: "Xena Ward", items: 128, followers: "8.1k", eth: "96.2 ETH", color: "#0ab39c" },
  { name: "Zozoic", items: 89, followers: "5.6k", eth: "72.0 ETH", color: "#f7b84b" },
  { name: "PixelForge", items: 310, followers: "21.0k", eth: "220.4 ETH", color: "#f06548" },
  { name: "NFTeam", items: 56, followers: "3.2k", eth: "41.8 ETH", color: "#299cdb" },
  { name: "GameDev", items: 178, followers: "9.8k", eth: "110.1 ETH", color: "#6559cc" },
];

export default function NftCreators() {
  const [query, setQuery] = useState("");
  const [following, setFollowing] = useState<string[]>([]);
  const list = creators.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="card"><div className="card-body">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search creators..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div key={c.name} className="card"><div className="card-body flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-bold text-white" style={{ background: c.color }}>{c.name.slice(0,2)}</div>
            <div className="flex-1">
              <p className="m-0 font-semibold text-[#495057]">{c.name}</p>
              <p className="m-0 text-[12px] text-[#878a99]">{c.items} items · {c.followers} followers</p>
              <p className="m-0 text-[12px] font-medium text-[#0ab39c]">{c.eth}</p>
            </div>
            <button type="button" onClick={()=>setFollowing((p)=>p.includes(c.name)?p.filter(x=>x!==c.name):[...p,c.name])} className={following.includes(c.name)?btnPrimary:btnSoft}>
              {following.includes(c.name)?"Following":"Follow"}
            </button>
          </div></div>
        ))}
      </div>
    </div>
  );
}
