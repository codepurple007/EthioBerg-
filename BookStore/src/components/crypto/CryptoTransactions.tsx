"use client";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

type Tx = { id: string; date: string; type: "Buy" | "Sell" | "Deposit" | "Withdraw"; currency: string; amount: string; usd: string; status: "Success" | "Pending" | "Failed" };

const rows: Tx[] = [
  { id: "#VL2031", date: "24 Dec, 2021", type: "Buy", currency: "BTC", amount: "0.042 BTC", usd: "$1,245.00", status: "Success" },
  { id: "#VL2032", date: "23 Dec, 2021", type: "Sell", currency: "ETH", amount: "1.250 ETH", usd: "$3,891.20", status: "Success" },
  { id: "#VL2033", date: "22 Dec, 2021", type: "Deposit", currency: "USDT", amount: "500 USDT", usd: "$500.00", status: "Pending" },
  { id: "#VL2034", date: "21 Dec, 2021", type: "Withdraw", currency: "BTC", amount: "0.015 BTC", usd: "$445.80", status: "Failed" },
  { id: "#VL2035", date: "20 Dec, 2021", type: "Buy", currency: "LTC", amount: "12.5 LTC", usd: "$1,120.00", status: "Success" },
  { id: "#VL2036", date: "19 Dec, 2021", type: "Sell", currency: "XRP", amount: "2500 XRP", usd: "$1,875.00", status: "Success" },
];

const tabs = ["All", "Buy", "Sell", "Deposit", "Withdraw"] as const;
const st: Record<string, string> = { Success: "bg-[#daf4f0] text-[#0ab39c]", Pending: "bg-[#fef4e4] text-[#f7b84b]", Failed: "bg-[#fde8e4] text-[#f06548]" };

export default function CryptoTransactions() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => rows.filter((r) => (tab === "All" || r.type === tab) && (!query || r.id.toLowerCase().includes(query.toLowerCase()) || r.currency.toLowerCase().includes(query.toLowerCase()))), [tab, query]);

  return (
    <div className="card">
      <div className="card-header !border-b-0"><h5 className="card-title">Transactions</h5></div>
      <div className="flex flex-wrap gap-1 border-b border-[#e9ebec] px-4">
        {tabs.map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[13px] font-medium ${tab===t?"border-[#405189] text-[#405189]":"border-transparent text-[#878a99]"}`}>{t}</button>)}
      </div>
      <div className="border-b border-[#e9ebec] px-4 py-3">
        <div className="relative max-w-md"><Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search transactions..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Timestamp","Type","Currency","Amount","USD Value","Status"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
                <td className="px-4 py-3"><p className="m-0 font-medium">{r.id}</p><p className="m-0 text-[12px] text-[#878a99]">{r.date}</p></td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1">{r.type === "Buy" || r.type === "Deposit" ? <ArrowDownLeft size={14} className="text-[#0ab39c]" /> : <ArrowUpRight size={14} className="text-[#f06548]" />}{r.type}</span></td>
                <td className="px-4 py-3 font-semibold">{r.currency}</td>
                <td className="px-4 py-3">{r.amount}</td>
                <td className="px-4 py-3 font-semibold">{r.usd}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${st[r.status]}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
