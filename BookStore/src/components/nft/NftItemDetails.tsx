"use client";
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const history = [
  { event: "Listed", price: "4.32 ETH", from: "Artistic", date: "24 Dec, 2021" },
  { event: "Bid", price: "4.10 ETH", from: "Zozoic", date: "23 Dec, 2021" },
  { event: "Transfer", price: "—", from: "Themesbrand", date: "20 Dec, 2021" },
];

export default function NftItemDetails() {
  const [liked, setLiked] = useState(false);
  const [bid, setBid] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-5">
        <div className="card-body">
          <div className="flex aspect-square items-center justify-center rounded bg-gradient-to-br from-[#40518933] to-[#0ab39c22]">
            <span className="text-[64px] font-bold text-[#405189]">AA</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 xl:col-span-7">
        <div className="card">
          <div className="card-body space-y-4">
            <div>
              <p className="mb-1 text-[12px] font-medium text-[#0ab39c]">Art Collection</p>
              <h4 className="m-0 text-[22px] font-semibold text-[#495057]">Abstract Art</h4>
              <p className="mt-1 mb-0 text-[13px] text-[#878a99]">Created by <span className="font-medium text-[#405189]">Artistic</span></p>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px]">
              <div><p className="mb-0 text-[#878a99]">Current Price</p><p className="m-0 text-[20px] font-semibold text-[#0ab39c]">4.32 ETH</p></div>
              <div><p className="mb-0 text-[#878a99]">Highest Bid</p><p className="m-0 text-[20px] font-semibold">4.10 ETH</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <input className={inputCls + " max-w-[160px]"} placeholder="Bid amount" value={bid} onChange={(e)=>setBid(e.target.value)} />
              <button type="button" className={btnPrimary} onClick={()=>setMsg("Bid placed (demo)")}>Place a Bid</button>
              <button type="button" className={btnSoft} onClick={()=>setLiked(!liked)}><Heart size={15} className={liked?"fill-[#f06548] text-[#f06548]":""} /></button>
              <button type="button" className={btnSoft}><Share2 size={15} /></button>
            </div>
            {msg && <p className="m-0 text-[13px] text-[#0ab39c]">{msg}</p>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h5 className="card-title">Item Activity</h5></div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Event","Price","From","Date"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>{history.map((h)=>(
                <tr key={h.event+h.date} className="border-b border-[#e9ebec]">
                  <td className="px-4 py-3">{h.event}</td><td className="px-4 py-3 font-semibold">{h.price}</td>
                  <td className="px-4 py-3 text-[#405189]">{h.from}</td><td className="px-4 py-3 text-[#878a99]">{h.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
