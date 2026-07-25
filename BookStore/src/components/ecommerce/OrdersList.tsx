"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MoreHorizontal, Eye, Truck, Ban } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

type Order = { id: string; customer: string; product: string; date: string; amount: string; payment: string; status: "Delivered" | "Pickups" | "Returns" | "Cancelled" | "Inprogress" };

const orders: Order[] = [
  { id: "#VZ2101", customer: "Alex Smith", product: "Clothes", date: "15 Feb, 2021", amount: "$109.00", payment: "Paid", status: "Delivered" },
  { id: "#VZ2102", customer: "Jansh Brown", product: "Kitchen Storage", date: "17 Feb, 2021", amount: "$149.00", payment: "Pending", status: "Pickups" },
  { id: "#VZ2103", customer: "Ayaan Bowen", product: "Bike Accessories", date: "21 Feb, 2021", amount: "$215.00", payment: "Paid", status: "Delivered" },
  { id: "#VZ2104", customer: "Prezy Mark", product: "Furniture", date: "28 Feb, 2021", amount: "$199.00", payment: "COD", status: "Inprogress" },
  { id: "#VZ2105", customer: "Vihan Hudda", product: "Bags and Wallets", date: "02 Mar, 2021", amount: "$330.00", payment: "Paid", status: "Cancelled" },
  { id: "#VZ2106", customer: "Sarah Taylor", product: "Electronics", date: "05 Mar, 2021", amount: "$89.50", payment: "Paid", status: "Returns" },
  { id: "#VZ2107", customer: "James Morris", product: "Fashion", date: "08 Mar, 2021", amount: "$175.00", payment: "Pending", status: "Inprogress" },
  { id: "#VZ2108", customer: "Curtis Weaver", product: "Watches", date: "12 Mar, 2021", amount: "$420.00", payment: "Paid", status: "Delivered" },
];

const tabs = ["All", "Delivered", "Pickups", "Returns", "Cancelled"] as const;
const statusStyles: Record<string, string> = {
  Delivered: "bg-[#daf4f0] text-[#0ab39c]",
  Pickups: "bg-[#e1f0fa] text-[#299cdb]",
  Returns: "bg-[#fef4e4] text-[#f7b84b]",
  Cancelled: "bg-[#fde8e4] text-[#f06548]",
  Inprogress: "bg-[#e2e5ed] text-[#405189]",
};

export default function OrdersList() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");
  const [openAction, setOpenAction] = useState<string | null>(null);
  const filtered = useMemo(() => orders.filter((o) => {
    const mt = tab === "All" || o.status === tab;
    const q = query.toLowerCase();
    return mt && (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q));
  }), [tab, query]);

  return (
    <div className="card">
      <div className="card-header !border-b-0"><h5 className="card-title">Order History</h5></div>
      <div className="flex flex-wrap gap-1 border-b border-[#e9ebec] px-4">
        {tabs.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[13px] font-medium ${tab === t ? "border-[#405189] text-[#405189]" : "border-transparent text-[#878a99]"}`}>{t}</button>
        ))}
      </div>
      <div className="border-b border-[#e9ebec] px-4 py-3">
        <div className="relative max-w-md">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for order ID, customer, product..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Order ID","Customer","Product","Order Date","Amount","Payment","Status","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
                <td className="px-4 py-3"><Link href="/apps/ecommerce/order-details" className="font-medium text-[#405189] no-underline hover:underline">{o.id}</Link></td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3">{o.product}</td>
                <td className="px-4 py-3 text-[#878a99]">{o.date}</td>
                <td className="px-4 py-3 font-semibold">{o.amount}</td>
                <td className="px-4 py-3">{o.payment}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusStyles[o.status]}`}>{o.status}</span></td>
                <td className="relative px-4 py-3">
                  <button type="button" onClick={() => setOpenAction(openAction === o.id ? null : o.id)} className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:bg-[#f3f6f9]"><MoreHorizontal size={16} /></button>
                  {openAction === o.id && (
                    <div className="absolute right-4 z-10 mt-1 w-40 rounded border border-[#e9ebec] bg-white py-1 shadow-md">
                      <Link href="/apps/ecommerce/order-details" className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#495057] no-underline hover:bg-[#f3f6f9]"><Eye size={14} /> View</Link>
                      <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-1.5 text-left text-[13px] hover:bg-[#f3f6f9]"><Truck size={14} /> Track</button>
                      <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-1.5 text-left text-[13px] text-[#f06548] hover:bg-[#fde8e4]"><Ban size={14} /> Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 text-[13px] text-[#878a99]">Showing {filtered.length} results</div>
    </div>
  );
}
