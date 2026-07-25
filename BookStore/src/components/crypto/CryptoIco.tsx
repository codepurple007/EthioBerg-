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

const icos = [
  { name: "ICICB Coin", symbol: "ICICB", price: "$0.012", cap: "$1.2M", progress: 72, status: "Active" },
  { name: "MetaVerse Token", symbol: "MVT", price: "$0.045", cap: "$4.8M", progress: 45, status: "Active" },
  { name: "Green Energy Coin", symbol: "GEC", price: "$0.008", cap: "$890K", progress: 90, status: "Ending Soon" },
  { name: "AI Protocol", symbol: "AIP", price: "$0.120", cap: "$12M", progress: 28, status: "Upcoming" },
  { name: "DeFi Yield", symbol: "DFY", price: "$0.065", cap: "$3.1M", progress: 60, status: "Active" },
  { name: "NFT Arena", symbol: "NFA", price: "$0.022", cap: "$2.0M", progress: 100, status: "Ended" },
];
const st: Record<string,string> = { Active:"bg-[#daf4f0] text-[#0ab39c]", "Ending Soon":"bg-[#fef4e4] text-[#f7b84b]", Upcoming:"bg-[#e1f0fa] text-[#299cdb]", Ended:"bg-[#e2e5ed] text-[#405189]" };

export default function CryptoIco() {
  const [filter, setFilter] = useState("All");
  const list = icos.filter((i) => filter === "All" || i.status === filter);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["All","Active","Upcoming","Ending Soon","Ended"].map((f)=>(
          <button key={f} type="button" onClick={()=>setFilter(f)} className={`cursor-pointer rounded border px-3 py-1.5 text-[13px] font-medium ${filter===f?"border-[#405189] bg-[#405189] text-white":"border-[#e9ebec] bg-white text-[#878a99]"}`}>{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((ico) => (
          <div key={ico.symbol} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">{ico.name}</h5>
                  <p className="m-0 text-[12px] text-[#878a99]">{ico.symbol}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[ico.status]}`}>{ico.status}</span>
              </div>
              <div className="mb-3 flex justify-between text-[13px]">
                <span className="text-[#878a99]">Price <strong className="text-[#495057]">{ico.price}</strong></span>
                <span className="text-[#878a99]">Cap <strong className="text-[#495057]">{ico.cap}</strong></span>
              </div>
              <div className="mb-1 flex justify-between text-[12px] text-[#878a99]"><span>Raised</span><span>{ico.progress}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[#e9ebec]"><div className="h-full rounded-full bg-[#0ab39c]" style={{ width: `${ico.progress}%` }} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
