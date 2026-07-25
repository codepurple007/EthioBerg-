"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Star, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

type Product = {
  id: string; name: string; category: string; stock: string; price: string; orders: string; rating: number; published: string; status: "Published" | "Draft";
};

const products: Product[] = [
  { id: "#TB010001", name: "Branded T-Shirts", category: "Fashion", stock: "12", price: "$161.25", orders: "48", rating: 4.2, published: "12 Oct, 2021", status: "Published" },
  { id: "#TB010002", name: "Bentwood Chair", category: "Furniture", stock: "05", price: "$194.60", orders: "34", rating: 3.9, published: "06 Jan, 2021", status: "Draft" },
  { id: "#TB010003", name: "Off White Disc", category: "Fashion", stock: "06", price: "$122.20", orders: "40", rating: 4.5, published: "26 Mar, 2021", status: "Published" },
  { id: "#TB010004", name: "Noise Evolve Smartwatch", category: "Electronics", stock: "06", price: "$243.45", orders: "23", rating: 3.8, published: "19 Apr, 2021", status: "Published" },
  { id: "#TB010005", name: "Ribbed Soft Cotton", category: "Fashion", stock: "07", price: "$120.32", orders: "40", rating: 4.1, published: "19 Apr, 2021", status: "Draft" },
  { id: "#TB010006", name: "Sport Shoes", category: "Footwear", stock: "15", price: "$94.99", orders: "78", rating: 4.7, published: "05 May, 2021", status: "Published" },
  { id: "#TB010007", name: "Leather Wallet", category: "Accessories", stock: "22", price: "$48.50", orders: "112", rating: 4.0, published: "12 Jun, 2021", status: "Published" },
  { id: "#TB010008", name: "Wireless Earbuds", category: "Electronics", stock: "08", price: "$79.00", orders: "65", rating: 4.4, published: "22 Jul, 2021", status: "Published" },
];

const cats = ["All", "Fashion", "Furniture", "Electronics", "Footwear", "Accessories"] as const;

export default function ProductsList() {
  const [tab, setTab] = useState<(typeof cats)[number]>("All");
  const [query, setQuery] = useState("");
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = useMemo(() => products.filter((p) => {
    const mt = tab === "All" || p.category === tab;
    const q = query.toLowerCase();
    const mq = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return mt && mq;
  }), [tab, query]);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-3 !border-b-0">
        <h5 className="card-title">Products</h5>
        <Link href="/apps/ecommerce/add-product" className={btnPrimary + " no-underline"}>
          <Plus size={15} /> Add Product
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e9ebec] px-4">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setTab(c)}
            className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[13px] font-medium ${tab === c ? "border-[#405189] text-[#405189]" : "border-transparent text-[#878a99] hover:text-[#495057]"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="border-b border-[#e9ebec] px-4 py-3">
        <div className="relative max-w-md">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products..."
            className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] text-[#495057] outline-none focus:border-[#405189] focus:bg-white" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
              {["Product", "Stock", "Price", "Orders", "Rating", "Published", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#e2e5ed] text-[12px] font-semibold text-[#405189]">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link href="/apps/ecommerce/product-details" className="font-medium text-[#405189] no-underline hover:underline">{p.name}</Link>
                      <p className="m-0 text-[12px] text-[#878a99]">{p.category} · {p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#495057]">{p.stock}</td>
                <td className="px-4 py-3 font-semibold text-[#495057]">{p.price}</td>
                <td className="px-4 py-3">{p.orders}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-[#f7b84b]"><Star size={14} fill="#f7b84b" /> {p.rating}</span>
                </td>
                <td className="px-4 py-3 text-[#878a99]">{p.published}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${p.status === "Published" ? "bg-[#daf4f0] text-[#0ab39c]" : "bg-[#fef4e4] text-[#f7b84b]"}`}>{p.status}</span>
                </td>
                <td className="relative px-4 py-3">
                  <button type="button" onClick={() => setOpenAction(openAction === p.id ? null : p.id)} className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:bg-[#f3f6f9]">
                    <MoreHorizontal size={16} />
                  </button>
                  {openAction === p.id && (
                    <div className="absolute right-4 z-10 mt-1 w-36 rounded border border-[#e9ebec] bg-white py-1 shadow-md">
                      <Link href="/apps/ecommerce/product-details" className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#495057] no-underline hover:bg-[#f3f6f9]"><Eye size={14} /> View</Link>
                      <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-1.5 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"><Pencil size={14} /> Edit</button>
                      <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-1.5 text-left text-[13px] text-[#f06548] hover:bg-[#fde8e4]"><Trash2 size={14} /> Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 text-[13px] text-[#878a99]">Showing {filtered.length} of {products.length} Results</div>
    </div>
  );
}
