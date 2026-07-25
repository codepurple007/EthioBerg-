"use client";

import { useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import ChartContainer from "@/components/dashboard/ChartContainer";

const COLORS = {
  primary: "#405189",
  success: "#0ab39c",
  warning: "#f7b84b",
  danger: "#f06548",
  info: "#299cdb",
  muted: "#878a99",
  border: "#e9ebec",
};

const portfolio = [
  { name: "Bitcoin", symbol: "BTC", amount: "0.00584875", usd: "$19,405.12", color: "#f7b84b" },
  { name: "Ethereum", symbol: "ETH", amount: "2.25842108", usd: "$40,552.18", color: "#405189" },
  { name: "Litecoin", symbol: "LTC", amount: "10.58963217", usd: "$15,824.58", color: "#299cdb" },
  { name: "Dash", symbol: "DASH", amount: "204.28565885", usd: "$30,635.84", color: "#0ab39c" },
];

const marketData = [
  { t: "09:00", price: 72 },
  { t: "10:00", price: 75 },
  { t: "11:00", price: 70 },
  { t: "12:00", price: 78 },
  { t: "13:00", price: 82 },
  { t: "14:00", price: 79 },
  { t: "15:00", price: 88 },
  { t: "16:00", price: 92 },
  { t: "17:00", price: 85 },
  { t: "18:00", price: 95 },
];

const wallets = [
  { name: "Bitcoin", value: "$1,523,647", change: "+13.11%", symbol: "btc", positive: true, color: "#f7b84b" },
  { name: "Litecoin", value: "$2,145,687", change: "+15.08%", symbol: "ltc", positive: true, color: "#299cdb" },
  { name: "Ethereum", value: "$3,312,870", change: "+08.57%", symbol: "etc", positive: true, color: "#405189" },
  { name: "Binance", value: "$1,820,045", change: "-09.21%", symbol: "bnb", positive: false, color: "#f7b84b" },
  { name: "Dash", value: "$9,458,153", change: "+12.07%", symbol: "dash", positive: true, color: "#0ab39c" },
  { name: "Tether", value: "$5,201,458", change: "+14.99%", symbol: "usdt", positive: true, color: "#26a17b" },
];

const currencies = [
  { coin: "Bitcoin", price: "$48,568.025", change: 5.26, balance: "$53,914.025", total: "1.25634801", positive: true },
  { coin: "Litecoin", price: "$87,142.027", change: 3.07, balance: "$75,854.127", total: "2.85472161", positive: true },
  { coin: "Ethereum", price: "$33,847.961", change: 7.13, balance: "$44,152.185", total: "1.45612347", positive: false },
  { coin: "Binance", price: "$73,654.421", change: 0.97, balance: "$48,367.125", total: "0.35734601", positive: true },
  { coin: "Tether", price: "$66,742.077", change: 1.08, balance: "$53,487.083", total: "3.62912570", positive: true },
  { coin: "Dash", price: "$34,736.209", change: 4.52, balance: "$15,203.347", total: "1.85412740", positive: false },
  { coin: "Neo", price: "$56,357.313", change: 2.87, balance: "$61,843.173", total: "1.87732061", positive: true },
  { coin: "Dogecoin", price: "$62,357.649", change: 3.45, balance: "$54,843.173", total: "0.95632087", positive: true },
];

const activities = [
  { date: "25 Dec 2021", items: [
    { title: "Bought Bitcoin", meta: "Visa Debit Card ***6", amount: "+0.04025745 BTC", usd: "+878.52 USD", positive: true },
    { title: "Sent Ethereum", meta: "Sofia Cunha", amount: "-0.09025182 ETH", usd: "-659.35 USD", positive: false },
  ]},
  { date: "24 Dec 2021", items: [
    { title: "Sell Dash", meta: "www.cryptomarket.com", amount: "-98.6025422 Dash", usd: "-1,508.98 USD", positive: false },
    { title: "Bought Litecoin", meta: "Payment via Wallet", amount: "+0.07225912 LTC", usd: "+759.45 USD", positive: true },
  ]},
];

const performers = [
  { name: "Bitcoin", volume: "$18.7 Billions", price: "$12,863.08", change: "+$67.21 (+4.33%)", positive: true },
  { name: "Ethereum", volume: "$27.4 Billions", price: "$08,256.04", change: "+$51.19 (+5.64%)", positive: true },
  { name: "Avalanche", volume: "$12.9 Billions", price: "$11,896.13", change: "-$59.01 (-4.08%)", positive: false },
  { name: "Dogecoin", volume: "$09.5 Billions", price: "$15,999.06", change: "+$74.05 (+3.12%)", positive: true },
  { name: "Binance", volume: "$14.2 Billions", price: "$13,786.18", change: "-$61.05 (-9.22%)", positive: false },
  { name: "Litecoin", volume: "$09.5 Billions", price: "$10,604.27", change: "+$76.12 (+4.92%)", positive: true },
];

const news = [
  { title: "One stop shop destination on all the latest news in crypto currencies", date: "Dec 12, 2021 09:22 AM" },
  { title: "Coin Journal is dedicated to delivering stories on the latest crypto", date: "Dec 03, 2021 12:09 PM" },
  { title: "The bitcoin-holding U.S. senator is trying to “fully integrate” crypto", date: "Nov 22, 2021 11:47 AM" },
  { title: "Cryptocurrency price like Bitcoin, Dash, Dogecoin, Ripple and Litecoin", date: "Nov 18, 2021 06:13 PM" },
];

const spark = [40, 55, 45, 60, 50, 70, 65, 80];

const marketTabs = ["1H", "7D", "1M", "1Y", "ALL"] as const;
const tradeTabs = ["Buy", "Sell"] as const;

function SortSelect({
  label,
  options,
  value,
}: {
  label: string;
  options: string[];
  value: string;
}) {
  return (
    <div className="relative inline-flex items-center gap-1 text-[12px] text-[#878a99]">
      {label ? <span>{label}</span> : null}
      <select
        defaultValue={value}
        className="cursor-pointer appearance-none border-0 bg-transparent pr-4 font-medium text-[#405189] outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#878a99]"
      />
    </div>
  );
}

export default function CryptoDashboard() {
  const [marketTab, setMarketTab] = useState<(typeof marketTabs)[number]>("1M");
  const [tradeTab, setTradeTab] = useState<(typeof tradeTabs)[number]>("Buy");
  const [amount, setAmount] = useState("0.042256");

  return (
    <div>
      {/* Portfolio + Market Graph */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">My Portfolio</h5>
              <SortSelect label="" value="BTC" options={["BTC", "USD", "Euro"]} />
            </div>
            <div className="card-body">
              <ul className="m-0 mb-4 list-none space-y-3 p-0">
                {portfolio.map((p) => (
                  <li key={p.symbol} className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {p.symbol.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[13px] font-medium text-[#495057]">{p.name}</p>
                      <span className="text-[11px] text-[#878a99]">{p.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="m-0 text-[13px] font-medium text-[#495057]">
                        {p.symbol} {p.amount}
                      </p>
                      <span className="text-[11px] text-[#878a99]">{p.usd}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-2 border-t border-[#e9ebec] pt-3">
                {[
                  { label: "Total Invested", value: "$2,390.68", pct: "6.24 %" },
                  { label: "Total Change", value: "$19,523.25", pct: "3.67 %" },
                  { label: "Day Change", value: "$1,875.65", pct: "4.80 %" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="m-0 mb-1 text-[11px] text-[#878a99]">{s.label}</p>
                    <h5 className="m-0 text-[14px] font-semibold text-[#495057]">{s.value}</h5>
                    <span className="text-[11px] text-[#0ab39c]">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Market Graph</h5>
              <div className="flex gap-1">
                {marketTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMarketTab(tab)}
                    className={`cursor-pointer rounded border-0 px-2.5 py-1 text-[12px] font-medium ${
                      marketTab === tab
                        ? "bg-[#405189] text-white"
                        : "bg-[#f3f6f9] text-[#878a99] hover:text-[#405189]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h4 className="m-0 text-[22px] font-semibold text-[#495057]">0.014756</h4>
                  <p className="m-0 text-[13px] text-[#0ab39c]">
                    $75.69 <span className="text-[#0ab39c]">+1.99%</span>
                  </p>
                </div>
                <div className="flex gap-4 text-[12px] text-[#878a99]">
                  <span>High <strong className="text-[#495057]">0.014578</strong></span>
                  <span>Low <strong className="text-[#495057]">0.0175489</strong></span>
                </div>
                <div className="flex gap-4 text-center text-[12px]">
                  <div>
                    <p className="m-0 text-[#878a99]">Total Balance</p>
                    <h5 className="m-0 text-[15px] font-semibold text-[#495057]">$72.8k</h5>
                  </div>
                  <div>
                    <p className="m-0 text-[#878a99]">Profit</p>
                    <h5 className="m-0 text-[15px] font-semibold text-[#0ab39c]">+$49.7k</h5>
                  </div>
                  <div>
                    <p className="m-0 text-[#878a99]">Loss</p>
                    <h5 className="m-0 text-[15px] font-semibold text-[#f06548]">-$23.1k</h5>
                  </div>
                </div>
              </div>
              <ChartContainer className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={marketData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cryptoMarket" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="t" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Area type="monotone" dataKey="price" stroke={COLORS.success} strokeWidth={2} fill="url(#cryptoMarket)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {wallets.map((w) => (
          <div key={w.name} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: w.color }}
                  >
                    {w.name.slice(0, 1)}
                  </span>
                  <span className="text-[14px] font-medium text-[#495057]">{w.name}</span>
                </div>
                <div className="flex gap-2 text-[12px]">
                  <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-[#405189]">Details</button>
                  <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-[#878a99]">Cancel</button>
                </div>
              </div>
              <h4 className="m-0 mb-1 text-[20px] font-semibold text-[#495057]">{w.value}</h4>
              <p className={`m-0 text-[12px] ${w.positive ? "text-[#0ab39c]" : "text-[#f06548]"}`}>
                {w.change}({w.symbol})
              </p>
              <ChartContainer className="mt-2 h-[50px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={spark.map((v, i) => ({ i, v: w.positive ? v : 100 - v }))}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={w.positive ? COLORS.success : COLORS.danger}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        ))}
      </div>

      {/* My Currencies */}
      <div className="card mb-4">
        <div className="card-header flex-wrap gap-2">
          <h5 className="card-title">My Currencies</h5>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#f3f6f9] px-2 py-0.5 text-[11px] font-medium text-[#878a99]">24H</span>
            <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189]">
              Get Report
            </button>
          </div>
        </div>
        <div className="card-body !p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                  <th className="px-5 py-3 font-medium">Coin Name</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">24h Change</th>
                  <th className="px-3 py-3 font-medium">Total Balance</th>
                  <th className="px-3 py-3 font-medium">Total Coin</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((c) => (
                  <tr key={c.coin} className="border-b border-[#e9ebec] last:border-0">
                    <td className="px-5 py-3 font-medium text-[#405189]">{c.coin}</td>
                    <td className="px-3 py-3 text-[#495057]">{c.price}</td>
                    <td className={`px-3 py-3 font-medium ${c.positive ? "text-[#0ab39c]" : "text-[#f06548]"}`}>
                      {c.positive ? "+" : "-"}{c.change}%
                    </td>
                    <td className="px-3 py-3 text-[#495057]">{c.balance}</td>
                    <td className="px-3 py-3 text-[#495057]">{c.total}</td>
                    <td className="px-5 py-3">
                      <button type="button" className="cursor-pointer rounded border-0 bg-[#405189] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#364574]">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trading + Recent Activity + Top Performers */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header !border-b-0">
              <h5 className="card-title">Trading</h5>
            </div>
            <div className="flex gap-1 border-b border-[#e9ebec] px-5">
              {tradeTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTradeTab(tab)}
                  className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2 text-[13px] font-medium ${
                    tradeTab === tab
                      ? "border-[#405189] text-[#405189]"
                      : "border-transparent text-[#878a99]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="card-body">
              <p className="m-0 mb-3 text-[12px] text-[#878a99]">
                USD Balance : <span className="font-semibold text-[#495057]">$12,426.07</span>
              </p>
              <h6 className="m-0 mb-3 text-[14px] font-semibold text-[#495057]">
                {tradeTab} Coin
              </h6>
              <div className="mb-3 space-y-3">
                <div>
                  <label className="mb-1 block text-[12px] text-[#878a99]">Currency</label>
                  <select className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#405189]">
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>LTC</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] text-[#878a99]">Amount</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="rounded bg-[#f3f6f9] p-2">
                    <p className="m-0 text-[#878a99]">Transaction Fees (0.05%)</p>
                    <p className="m-0 font-semibold text-[#495057]">$1.08</p>
                  </div>
                  <div className="rounded bg-[#f3f6f9] p-2">
                    <p className="m-0 text-[#878a99]">Minimum Received (2%)</p>
                    <p className="m-0 font-semibold text-[#495057]">$7.85</p>
                  </div>
                </div>
                <p className="m-0 text-[12px] text-[#878a99]">
                  Estimated Rate: <span className="font-medium text-[#495057]">1 BTC ~ $34,572.00</span>
                </p>
              </div>
              <button
                type="button"
                className={`w-full cursor-pointer rounded border-0 px-4 py-2.5 text-[13px] font-medium text-white ${
                  tradeTab === "Buy" ? "bg-[#0ab39c] hover:bg-[#099885]" : "bg-[#f06548] hover:bg-[#e2563a]"
                }`}
              >
                {tradeTab} Coin
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Activity</h5>
              <SortSelect
                label="Sort by:"
                value="Current Week"
                options={["Today", "Last Week", "Last Month", "Current Year", "Current Week"]}
              />
            </div>
            <div className="card-body">
              {activities.map((group) => (
                <div key={group.date} className="mb-3 last:mb-0">
                  <p className="m-0 mb-2 text-[12px] font-semibold text-[#878a99]">{group.date}</p>
                  <ul className="m-0 list-none space-y-3 p-0">
                    {group.items.map((item) => (
                      <li key={item.title + item.amount} className="flex items-start justify-between gap-2">
                        <div className="flex gap-2">
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              item.positive ? "bg-[#daf4f0] text-[#0ab39c]" : "bg-[#fde8e4] text-[#f06548]"
                            }`}
                          >
                            {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </span>
                          <div>
                            <p className="m-0 text-[13px] font-medium text-[#495057]">{item.title}</p>
                            <span className="text-[11px] text-[#878a99]">{item.meta}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`m-0 text-[12px] font-medium ${item.positive ? "text-[#0ab39c]" : "text-[#f06548]"}`}>
                            {item.amount}
                          </p>
                          <span className="text-[11px] text-[#878a99]">{item.usd}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top Performers</h5>
              <div className="flex gap-1">
                {["1H", "1D", "7D", "1M"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="cursor-pointer rounded border-0 bg-[#f3f6f9] px-2 py-0.5 text-[11px] font-medium text-[#878a99] hover:bg-[#405189] hover:text-white"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {performers.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-2 border-b border-[#e9ebec] py-2.5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        size={16}
                        className={p.positive ? "text-[#0ab39c]" : "text-[#f06548]"}
                      />
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{p.name}</p>
                        <span className="text-[11px] text-[#878a99]">{p.volume}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="m-0 text-[13px] font-medium text-[#495057]">{p.price}</p>
                      <span className={`text-[11px] ${p.positive ? "text-[#0ab39c]" : "text-[#f06548]"}`}>
                        {p.change}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="card mb-2">
        <div className="card-header">
          <h5 className="card-title">News Feed</h5>
          <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">
            View all
          </a>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {news.map((n) => (
              <div key={n.title} className="rounded border border-[#e9ebec] p-3">
                <div className="mb-2 flex h-16 items-center justify-center rounded bg-[#f3f6f9]">
                  <TrendingUp size={24} className="text-[#405189]/opacity-40" />
                </div>
                <p className="m-0 mb-2 text-[13px] font-medium leading-snug text-[#495057]">{n.title}</p>
                <span className="text-[11px] text-[#878a99]">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
