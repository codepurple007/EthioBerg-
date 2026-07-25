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

const ranks = [
  { rank: 1, name: "Artworks", volume: "1,245 ETH", change: "+12.4%", sales: 845, up: true },
  { rank: 2, name: "Anime Kingdom", volume: "2,340 ETH", change: "+8.1%", sales: 1204, up: true },
  { rank: 3, name: "Pixel Worlds", volume: "1,890 ETH", change: "-2.3%", sales: 980, up: false },
  { rank: 4, name: "Crypto Card", volume: "780 ETH", change: "+4.5%", sales: 512, up: true },
  { rank: 5, name: "Meta Heroes", volume: "512 ETH", change: "-1.1%", sales: 340, up: false },
  { rank: 6, name: "Space Cats", volume: "298 ETH", change: "+0.8%", sales: 210, up: true },
];

export default function NftRanking() {
  const [range, setRange] = useState("7d");
  return (
    <div className="card">
      <div className="card-header flex-wrap gap-3">
        <h5 className="card-title">Top Collections</h5>
        <div className="flex gap-1">
          {["24h","7d","30d","All"].map((r)=>(
            <button key={r} type="button" onClick={()=>setRange(r)} className={`cursor-pointer rounded border px-2.5 py-1 text-[12px] font-medium ${range===r?"border-[#405189] bg-[#405189] text-white":"border-[#e9ebec] text-[#878a99]"}`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["#","Collection","Volume","24h %","Sales"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{ranks.map((r)=>(
            <tr key={r.rank} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
              <td className="px-4 py-3 font-semibold">{r.rank}</td>
              <td className="px-4 py-3 font-medium text-[#405189]">{r.name}</td>
              <td className="px-4 py-3 font-semibold">{r.volume}</td>
              <td className={`px-4 py-3 font-medium ${r.up?"text-[#0ab39c]":"text-[#f06548]"}`}>{r.change}</td>
              <td className="px-4 py-3">{r.sales}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
