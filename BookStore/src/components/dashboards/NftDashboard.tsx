"use client";

import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Heart,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const marketData = [
  { month: "Jan", artworks: 12, auctions: 4, creators: 8 },
  { month: "Feb", artworks: 15, auctions: 5, creators: 9 },
  { month: "Mar", artworks: 14, auctions: 6, creators: 10 },
  { month: "Apr", artworks: 18, auctions: 7, creators: 11 },
  { month: "May", artworks: 22, auctions: 8, creators: 12 },
  { month: "Jun", artworks: 20, auctions: 9, creators: 13 },
  { month: "Jul", artworks: 25, auctions: 10, creators: 14 },
  { month: "Aug", artworks: 28, auctions: 11, creators: 15 },
  { month: "Sep", artworks: 24, auctions: 9, creators: 14 },
  { month: "Oct", artworks: 30, auctions: 12, creators: 16 },
  { month: "Nov", artworks: 27, auctions: 11, creators: 15 },
  { month: "Dec", artworks: 35, auctions: 14, creators: 18 },
];

const bids = [
  { name: "Herbert Stokes", handle: "@herbert10", amount: "174.36 ETH", color: "#405189" },
  { name: "Nancy Martino", handle: "@nancyMt", amount: "346.47 ETH", color: "#0ab39c" },
  { name: "Timothy Smith", handle: "@timothy", amount: "349.08 ETH", color: "#f7b84b" },
  { name: "Glen Matney", handle: "@matney10", amount: "852.34 ETH", color: "#299cdb" },
  { name: "Michael Morris", handle: "@michael", amount: "4.071 ETH", color: "#f06548" },
  { name: "Alexis Clarke", handle: "@alexis_30", amount: "30.749 ETH", color: "#6559cc" },
];

const featured = [
  { title: "Walking On Air", type: "Artwork", likes: "37.41k", highest: "10.35 ETH", price: "14.167 ETH", color: "#405189" },
  { title: "Filtered Portrait", type: "Photography", likes: "19.29k", highest: "75.3 ETH", price: "67.36 ETH", color: "#0ab39c" },
  { title: "Patterns Arts & Culture", type: "Artwork", likes: "8.42k", highest: "9.64 ETH", price: "14.167 ETH", color: "#f7b84b" },
  { title: "Evolved Reality", type: "Video", likes: "15.93k", highest: "2.75 ETH", price: "3.167 ETH", color: "#299cdb" },
];

const topArtworks = [
  { name: "One shop destination on", sales: "13,450", usd: "$235,000+" },
  { name: "Coin Journal is dedicated", sales: "11,752", usd: "$632,000+" },
  { name: "The Bitcoin-holding U.S.", sales: "7,526", usd: "$468,000+" },
  { name: "Cryptocurrency Price Bitcoin", sales: "15,521", usd: "$265,000+" },
  { name: "Dash, Ripple and Litecoin", sales: "12,652", usd: "$456,000+" },
  { name: "The Cat X Takashi", sales: "11,745", usd: "$256,000+" },
  { name: "Long-tailed Macaque", sales: "41,032", usd: "$745,000+" },
  { name: "Evolved Reality", sales: "513,794", usd: "$870,000+" },
];

const recentNfts = [
  { collection: "Abstract Face Painting", category: "Artworks", volume: "48,568.025", change: 5.26, creators: "6.8K", items: "18.0K", positive: true },
  { collection: "Long-tailed Macaque", category: "Games", volume: "87,142.027", change: 3.07, creators: "2.6K", items: "6.3K", positive: true },
  { collection: "Robotic Body Art", category: "Photography", volume: "33,847.961", change: 7.13, creators: "7.5K", items: "14.6K", positive: false },
  { collection: "Smillevers Crypto", category: "Artworks", volume: "73,654.421", change: 0.97, creators: "5.3K", items: "36.4K", positive: true },
  { collection: "Creative Filtered Portrait", category: "3d Style", volume: "66,742.077", change: 1.08, creators: "3.1K", items: "12.4K", positive: true },
  { collection: "The Chirstoper Crypto Card", category: "Artworks", volume: "34,736.209", change: 4.52, creators: "7.2K", items: "25.0K", positive: false },
];

const creatorsMap = [
  { name: "United States", pct: 34, color: COLORS.primary },
  { name: "Russia", pct: 27, color: COLORS.success },
  { name: "Spain", pct: 21, color: COLORS.warning },
  { name: "Italy", pct: 13, color: COLORS.info },
  { name: "Germany", pct: 5, color: COLORS.danger },
];

const collections = [
  { name: "Artworks", items: "4700+ Items", color: "#405189" },
  { name: "Crypto Card", items: "743+ Items", color: "#0ab39c" },
  { name: "3d Style", items: "4781+ Items", color: "#f7b84b" },
  { name: "Collectibles", items: "3468+ Items", color: "#299cdb" },
];

const popularCreators = [
  { name: "Alexis Clarke", eth: "81,369 ETH", color: "#405189" },
  { name: "Timothy Smith", eth: "4,754 ETH", color: "#0ab39c" },
  { name: "Herbert Stokes", eth: "68,945 ETH", color: "#f7b84b" },
  { name: "Glen Matney", eth: "49,031 ETH", color: "#299cdb" },
];

const marketTabs = ["ALL", "1M", "6M", "1Y"] as const;

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

export default function NftDashboard() {
  const [marketTab, setMarketTab] = useState<(typeof marketTabs)[number]>("ALL");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <div>
      {/* Hero */}
      <div className="card mb-4 overflow-hidden">
        <div className="card-body flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#405189] via-[#4a5a9a] to-[#0ab39c] text-white">
          <div className="max-w-xl">
            <h4 className="m-0 mb-2 text-[20px] font-semibold">
              Discover, Collect, Sell and Create your own NFTs.
            </h4>
            <p className="m-0 mb-4 text-[13px] text-white/80">
              The world&apos;s first and largest digital marketplace.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="cursor-pointer rounded border-0 bg-white px-4 py-2 text-[13px] font-medium text-[#405189] hover:bg-white/90">
                Discover Now
              </button>
              <button type="button" className="cursor-pointer rounded border border-white/40 bg-transparent px-4 py-2 text-[13px] font-medium text-white hover:bg-white/10">
                Create Your Own
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="rounded-lg bg-white/10 px-5 py-3 backdrop-blur">
              <p className="m-0 text-[12px] text-white/70">Total Revenue</p>
              <h4 className="m-0 text-[22px] font-semibold">$59,354.69</h4>
              <span className="text-[11px] text-[#daf4f0]">3.96% vs. previous month</span>
            </div>
            <div className="rounded-lg bg-white/10 px-5 py-3 backdrop-blur">
              <p className="m-0 text-[12px] text-white/70">Estimated</p>
              <h4 className="m-0 text-[22px] font-semibold">$34,152.35</h4>
              <span className="text-[11px] text-[#daf4f0]">16.24% vs. previous month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace + Featured artwork */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Marketplace</h5>
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
              <div className="mb-3 grid grid-cols-3 gap-3">
                {[
                  { label: "Artworks", value: "18.89k" },
                  { label: "Auction", value: "3.31k" },
                  { label: "Creators", value: "4.48k" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <h5 className="m-0 text-[18px] font-semibold text-[#495057]">{s.value}</h5>
                    <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
              <ChartContainer className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={marketData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nftArt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Area type="monotone" dataKey="artworks" name="Artworks" stroke={COLORS.primary} strokeWidth={2} fill="url(#nftArt)" />
                    <Area type="monotone" dataKey="auctions" name="Auction" stroke={COLORS.success} strokeWidth={2} fill="transparent" />
                    <Area type="monotone" dataKey="creators" name="Creators" stroke={COLORS.warning} strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="card h-full">
            <div className="card-body">
              <div
                className="mb-3 flex h-[140px] items-end rounded-lg p-4 text-white"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.info})` }}
              >
                <div>
                  <span className="mb-1 inline-block rounded bg-white/20 px-2 py-0.5 text-[11px]">Artwork</span>
                  <h5 className="m-0 text-[16px] font-semibold">Trendy Fashion Portraits</h5>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="m-0 text-[20px] font-semibold text-[#495057]">346.12 ETH</h4>
                  <span className="text-[12px] text-[#0ab39c]">+586.85 (40.6%)</span>
                </div>
              </div>
              <p className="m-0 mb-4 text-[12px] leading-relaxed text-[#878a99]">
                NFT art is a digital asset that is collectable, unique, and non-transferrable. Every NFT is unique and cannot be duplicated.
              </p>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded bg-[#f3f6f9] p-3">
                  <p className="m-0 text-[11px] text-[#878a99]">Current Bid</p>
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">342.74 ETH</h5>
                </div>
                <div className="rounded bg-[#f3f6f9] p-3">
                  <p className="m-0 text-[11px] text-[#878a99]">Highest Bid</p>
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">346.67 ETH</h5>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="flex-1 cursor-pointer rounded border border-[#e9ebec] bg-white py-2 text-[13px] font-medium text-[#405189] hover:bg-[#f3f6f9]">
                  View Details
                </button>
                <button type="button" className="flex-1 cursor-pointer rounded border-0 bg-[#405189] py-2 text-[13px] font-medium text-white hover:bg-[#364574]">
                  Bid Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History of Bids + Featured */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">History of Bids</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">See All</a>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {bids.map((b) => (
                  <li key={b.handle} className="flex items-center justify-between gap-2 border-b border-[#e9ebec] py-2.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ background: b.color }}
                      >
                        {b.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{b.name}</p>
                        <span className="text-[11px] text-[#878a99]">{b.handle}</span>
                      </div>
                    </div>
                    <span className="text-[13px] font-medium text-[#405189]">{b.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Featured NFTs Artworks</h5>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featured.map((f) => (
                  <div key={f.title} className="overflow-hidden rounded border border-[#e9ebec]">
                    <div
                      className="relative flex h-[100px] items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${f.color}cc, ${f.color}66)` }}
                    >
                      <button
                        type="button"
                        onClick={() => setLiked((prev) => ({ ...prev, [f.title]: !prev[f.title] }))}
                        className="absolute right-2 top-2 cursor-pointer rounded-full border-0 bg-white/90 p-1.5"
                        aria-label="Like"
                      >
                        <Heart
                          size={14}
                          className={liked[f.title] ? "fill-[#f06548] text-[#f06548]" : "text-[#878a99]"}
                        />
                      </button>
                      <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                        {f.likes}
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="mb-1 inline-block rounded bg-[#f3f6f9] px-1.5 py-0.5 text-[10px] text-[#878a99]">
                        {f.type}
                      </span>
                      <p className="m-0 mb-1 text-[13px] font-medium text-[#495057]">{f.title}</p>
                      <p className="m-0 mb-2 text-[11px] text-[#878a99]">Highest: {f.highest}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#405189]">{f.price}</span>
                        <button type="button" className="cursor-pointer rounded border-0 bg-[#405189] px-2 py-1 text-[11px] font-medium text-white">
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artworks + Recent NFTs */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top Artworks</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">See All</a>
            </div>
            <div className="card-body !p-0 max-h-[380px] overflow-y-auto">
              <ul className="m-0 list-none p-0">
                {topArtworks.map((a, i) => (
                  <li key={a.name} className="flex items-center justify-between gap-2 border-b border-[#e9ebec] px-5 py-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-[#f3f6f9] text-[12px] font-semibold text-[#405189]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{a.name}</p>
                        <span className="text-[11px] text-[#878a99]">{a.sales} Sales</span>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-[#0ab39c]">{a.usd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent NFTs</h5>
              <SortSelect label="Sort by:" value="Popular" options={["Popular", "Newest", "Oldest"]} />
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Collection</th>
                      <th className="px-3 py-3 font-medium">Volume</th>
                      <th className="px-3 py-3 font-medium">24h %</th>
                      <th className="px-3 py-3 font-medium">Creators</th>
                      <th className="px-5 py-3 font-medium">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentNfts.map((n) => (
                      <tr key={n.collection} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3">
                          <p className="m-0 font-medium text-[#405189]">{n.collection}</p>
                          <span className="text-[11px] text-[#878a99]">{n.category}</span>
                        </td>
                        <td className="px-3 py-3 text-[#495057]">{n.volume}</td>
                        <td className={`px-3 py-3 font-medium ${n.positive ? "text-[#0ab39c]" : "text-[#f06548]"}`}>
                          {n.positive ? "+" : "-"}{n.change}%
                        </td>
                        <td className="px-3 py-3 text-[#495057]">{n.creators}</td>
                        <td className="px-5 py-3 text-[#495057]">{n.items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Worldwide creators + Collections + Popular */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Worldwide Top Creators</h5>
              <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189]">
                Export Report
              </button>
            </div>
            <div className="card-body">
              <div className="mb-4 flex h-[100px] items-center justify-center rounded bg-[#f3f6f9]">
                <MapPin size={40} className="text-[#405189]/opacity-40" />
              </div>
              <ul className="m-0 list-none space-y-3 p-0">
                {creatorsMap.map((c) => (
                  <li key={c.name}>
                    <div className="mb-1 flex justify-between text-[13px]">
                      <span className="text-[#495057]">{c.name}</span>
                      <span className="font-medium text-[#495057]">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9ebec]">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top Collections</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">See All</a>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-3">
                {collections.map((c) => (
                  <div key={c.name} className="rounded border border-[#e9ebec] p-3 text-center">
                    <div
                      className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg text-white"
                      style={{ background: c.color }}
                    >
                      <ExternalLink size={18} />
                    </div>
                    <p className="m-0 text-[13px] font-medium text-[#495057]">{c.name}</p>
                    <span className="text-[11px] text-[#878a99]">{c.items}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Popular Creators</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">See All</a>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {popularCreators.map((c) => (
                  <li key={c.name} className="flex items-center justify-between border-b border-[#e9ebec] py-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ background: c.color }}
                      >
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <span className="text-[13px] font-medium text-[#495057]">{c.name}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#405189]">{c.eth}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
