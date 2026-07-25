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

const coins = [
  { symbol: "BTC", name: "Bitcoin", price: "$46,852.12", change: "+2.4%", up: true },
  { symbol: "ETH", name: "Ethereum", price: "$3,102.45", change: "-0.8%", up: false },
  { symbol: "LTC", name: "Litecoin", price: "$89.30", change: "+1.1%", up: true },
  { symbol: "XRP", name: "Ripple", price: "$0.75", change: "+0.3%", up: true },
];

export default function CryptoBuySell() {
  const [mode, setMode] = useState<"Buy" | "Sell">("Buy");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-4">
        <div className="card-header"><h5 className="card-title">Buy / Sell Crypto</h5></div>
        <div className="card-body space-y-4">
          <div className="flex rounded border border-[#e9ebec] p-1">
            {(["Buy","Sell"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={`flex-1 cursor-pointer rounded border-0 py-2 text-[13px] font-medium ${mode===m ? (m==="Buy"?"bg-[#0ab39c] text-white":"bg-[#f06548] text-white") : "bg-transparent text-[#878a99]"}`}>{m}</button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">Currency</label>
            <select className={selectCls} value={coin} onChange={(e)=>setCoin(e.target.value)}>
              {coins.map((c)=><option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium">Amount (USD)</label>
            <input className={inputCls} value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <button type="button" className={btnPrimary + " w-full justify-center"} style={mode==="Sell"?{background:"#f06548"}:{}} onClick={()=>setMsg(`${mode} order placed for ${amount || "0"} USD of ${coin} (demo).`)}>{mode} {coin}</button>
          {msg && <p className="m-0 text-[13px] text-[#0ab39c]">{msg}</p>}
        </div>
      </div>
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Market Prices</h5></div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Coin","Price","24h Change","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {coins.map((c) => (
                <tr key={c.symbol} className="border-b border-[#e9ebec]">
                  <td className="px-4 py-3"><span className="font-semibold">{c.symbol}</span> <span className="text-[#878a99]">{c.name}</span></td>
                  <td className="px-4 py-3 font-semibold">{c.price}</td>
                  <td className={`px-4 py-3 font-medium ${c.up?"text-[#0ab39c]":"text-[#f06548]"}`}>{c.change}</td>
                  <td className="px-4 py-3"><button type="button" onClick={()=>setCoin(c.symbol)} className={btnSoft}>Trade</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
