"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const sellers = [
  { name: "Force Medicines", products: 116, stock: "Stock", reviews: 1852, rating: 4.5, color: "#405189" },
  { name: "Zigzag Fashion", products: 98, stock: "Out of Stock", reviews: 1240, rating: 4.1, color: "#0ab39c" },
  { name: "Micro Design", products: 74, stock: "Stock", reviews: 980, rating: 4.7, color: "#f7b84b" },
  { name: "Nesta Technologies", products: 152, stock: "Stock", reviews: 2103, rating: 4.3, color: "#f06548" },
  { name: "Syntyce Solutions", products: 63, stock: "Out of Stock", reviews: 645, rating: 3.9, color: "#299cdb" },
  { name: "Meta4Systems", products: 88, stock: "Stock", reviews: 1102, rating: 4.4, color: "#6559cc" },
];

export default function SellersList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => sellers.filter((s) => !query || s.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-body">
          <div className="relative max-w-md">
            <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for sellers..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.name} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-bold text-white" style={{ background: s.color }}>{s.name.slice(0,2)}</div>
                <div className="flex-1">
                  <Link href="/apps/ecommerce/seller-details" className="font-semibold text-[#405189] no-underline hover:underline">{s.name}</Link>
                  <p className="m-0 text-[12px] text-[#878a99]">{s.products} Products</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${s.stock === "Stock" ? "bg-[#daf4f0] text-[#0ab39c]" : "bg-[#fde8e4] text-[#f06548]"}`}>{s.stock}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="inline-flex items-center gap-1 text-[#f7b84b]"><Star size={14} fill="#f7b84b" /> {s.rating}</span>
                <span className="text-[#878a99]">{s.reviews} Reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
