"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const auctions = [
  { title: "Abstract Art", bid: "4.32 ETH", ends: "03h 12m 45s", bids: 18, color: "#405189" },
  { title: "Crystal Cube", bid: "2.15 ETH", ends: "08h 40m 12s", bids: 9, color: "#0ab39c" },
  { title: "Funky Toad", bid: "3.50 ETH", ends: "01h 05m 30s", bids: 24, color: "#f06548" },
  { title: "Robotic Body", bid: "5.00 ETH", ends: "12h 22m 01s", bids: 31, color: "#299cdb" },
];

export default function NftAuction() {
  const [bidAmt, setBidAmt] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {auctions.map((a) => (
        <div key={a.title} className="card">
          <div className="flex h-44 items-center justify-center" style={{ background: `linear-gradient(135deg, ${a.color}33, #f3f6f9)` }}>
            <span className="text-[36px] font-bold" style={{ color: a.color }}>{a.title.slice(0,2)}</span>
          </div>
          <div className="card-body space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Link href="/apps/nft/item-details" className="text-[15px] font-semibold text-[#405189] no-underline hover:underline">{a.title}</Link>
              <span className="inline-flex items-center gap-1 rounded bg-[#fef4e4] px-2 py-0.5 text-[11px] font-medium text-[#f7b84b]"><Clock size={12} /> {a.ends}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#878a99]">Highest Bid</span>
              <span className="font-semibold text-[#0ab39c]">{a.bid}</span>
            </div>
            <p className="m-0 text-[12px] text-[#878a99]">{a.bids} bids placed</p>
            <div className="flex gap-2">
              <input className={inputCls} placeholder="Your bid (ETH)" value={bidAmt[a.title]||""} onChange={(e)=>setBidAmt({...bidAmt,[a.title]:e.target.value})} />
              <button type="button" className={btnPrimary} onClick={()=>setMsg(`Bid ${bidAmt[a.title]||"?"} ETH on ${a.title} (demo)`)}>Place Bid</button>
            </div>
          </div>
        </div>
      ))}
      {msg && <p className="col-span-full m-0 text-[13px] text-[#0ab39c]">{msg}</p>}
    </div>
  );
}
