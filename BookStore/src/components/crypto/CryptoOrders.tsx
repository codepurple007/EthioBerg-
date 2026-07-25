"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const orders = [
  { id: "#ORD001", date: "24 Dec, 2021", type: "Buy", coin: "BTC", amount: "0.042", price: "$46,800", status: "Successful" },
  { id: "#ORD002", date: "23 Dec, 2021", type: "Sell", coin: "ETH", amount: "1.25", price: "$3,100", status: "Cancelled" },
  { id: "#ORD003", date: "22 Dec, 2021", type: "Buy", coin: "LTC", amount: "12.5", price: "$89", status: "Processing" },
  { id: "#ORD004", date: "21 Dec, 2021", type: "Sell", coin: "XRP", amount: "2500", price: "$0.74", status: "Successful" },
  { id: "#ORD005", date: "20 Dec, 2021", type: "Buy", coin: "BTC", amount: "0.01", price: "$46,200", status: "Successful" },
];
const st: Record<string,string> = { Successful:"bg-[#daf4f0] text-[#0ab39c]", Cancelled:"bg-[#fde8e4] text-[#f06548]", Processing:"bg-[#fef4e4] text-[#f7b84b]" };

export default function CryptoOrders() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => orders.filter((o) => !query || o.id.toLowerCase().includes(query.toLowerCase()) || o.coin.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title">Orders</h5></div>
      <div className="border-b border-[#e9ebec] px-4 py-3">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search orders..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Order ID","Date","Type","Coin","Amount","Price","Status"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((o)=>(
            <tr key={o.id} className="border-b border-[#e9ebec]">
              <td className="px-4 py-3 font-medium text-[#405189]">{o.id}</td>
              <td className="px-4 py-3 text-[#878a99]">{o.date}</td>
              <td className="px-4 py-3">{o.type}</td>
              <td className="px-4 py-3 font-semibold">{o.coin}</td>
              <td className="px-4 py-3">{o.amount}</td>
              <td className="px-4 py-3">{o.price}</td>
              <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[o.status]}`}>{o.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
