"use client";

import { useState } from "react";
import {
  Wallet,
  ShoppingBag,
  Users,
  Landmark,
  ArrowRight,
  MoreVertical,
  ChevronDown,
  Star,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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
  heading: "#495057",
};

const kpis = [
  {
    label: "Total Earnings",
    value: "$559.25k",
    change: "+16.24 %",
    positive: true,
    link: "View net earnings",
    icon: Wallet,
    iconBg: "#daf4f0",
    iconColor: COLORS.success,
  },
  {
    label: "Orders",
    value: "36,864",
    change: "-3.57 %",
    positive: false,
    link: "View all orders",
    icon: ShoppingBag,
    iconBg: "#e1f0fa",
    iconColor: COLORS.info,
  },
  {
    label: "Customers",
    value: "183.35M",
    change: "+29.08 %",
    positive: true,
    link: "See details",
    icon: Users,
    iconBg: "#fef4e4",
    iconColor: COLORS.warning,
  },
  {
    label: "My Balance",
    value: "$165.89k",
    change: "+0.00 %",
    positive: true,
    link: "Withdraw money",
    icon: Landmark,
    iconBg: "#e2e5ed",
    iconColor: COLORS.primary,
  },
];

const revenueData = [
  { month: "Jan", Orders: 48, Earnings: 22, Refunds: 8 },
  { month: "Feb", Orders: 55, Earnings: 28, Refunds: 10 },
  { month: "Mar", Orders: 42, Earnings: 24, Refunds: 7 },
  { month: "Apr", Orders: 68, Earnings: 35, Refunds: 12 },
  { month: "May", Orders: 72, Earnings: 40, Refunds: 9 },
  { month: "Jun", Orders: 58, Earnings: 32, Refunds: 11 },
  { month: "Jul", Orders: 80, Earnings: 48, Refunds: 14 },
  { month: "Aug", Orders: 75, Earnings: 45, Refunds: 13 },
  { month: "Sep", Orders: 90, Earnings: 52, Refunds: 15 },
  { month: "Oct", Orders: 85, Earnings: 50, Refunds: 12 },
  { month: "Nov", Orders: 95, Earnings: 58, Refunds: 16 },
  { month: "Dec", Orders: 110, Earnings: 65, Refunds: 18 },
];

const sourceData = [
  { name: "Search Engine", value: 50, color: COLORS.primary },
  { name: "Direct", value: 25, color: COLORS.success },
  { name: "Social", value: 15, color: COLORS.warning },
  { name: "Email", value: 10, color: COLORS.info },
];

const locations = [
  { name: "Canada", pct: 75, color: COLORS.primary },
  { name: "Greenland", pct: 47, color: COLORS.success },
  { name: "Russia", pct: 82, color: COLORS.warning },
];

const products = [
  {
    name: "Branded T-Shirts",
    date: "24 Apr 2021",
    price: "$29.00",
    orders: 62,
    stock: "510",
    out: false,
    amount: "$1,798",
  },
  {
    name: "Bentwood Chair",
    date: "19 Mar 2021",
    price: "$85.20",
    orders: 35,
    stock: "Out of stock",
    out: true,
    amount: "$2,982",
  },
  {
    name: "Borosil Paper Cup",
    date: "01 Mar 2021",
    price: "$14.00",
    orders: 80,
    stock: "749",
    out: false,
    amount: "$1,120",
  },
  {
    name: "One Seater Sofa",
    date: "11 Feb 2021",
    price: "$127.50",
    orders: 56,
    stock: "Out of stock",
    out: true,
    amount: "$7,140",
  },
  {
    name: "Stillbird Helmet",
    date: "17 Jan 2021",
    price: "$54.00",
    orders: 74,
    stock: "805",
    out: false,
    amount: "$3,996",
  },
];

const sellers = [
  {
    name: "iTest Factory",
    owner: "Oliver Tyler",
    category: "Bags and Wallets",
    stock: "8547",
    revenue: "$541,200",
    pct: 32,
  },
  {
    name: "Digitech Galaxy",
    owner: "John Roberts",
    category: "Watches",
    stock: "895",
    revenue: "$75,030",
    pct: 79,
  },
  {
    name: "Nesta Technologies",
    owner: "Harley Fuller",
    category: "Bike Accessories",
    stock: "3470",
    revenue: "$45,600",
    pct: 90,
  },
  {
    name: "Zoetic Fashion",
    owner: "James Bowen",
    category: "Clothes",
    stock: "5488",
    revenue: "$29,456",
    pct: 40,
  },
  {
    name: "Meta4Systems",
    owner: "Zoe Dennis",
    category: "Furniture",
    stock: "4100",
    revenue: "$11,260",
    pct: 57,
  },
];

const orders = [
  {
    id: "#VZ2112",
    customer: "Alex Smith",
    product: "Clothes",
    amount: "$109.00",
    vendor: "Zoetic Fashion",
    status: "Paid" as const,
    rating: "5.0",
    votes: 61,
  },
  {
    id: "#VZ2111",
    customer: "Jansh Brown",
    product: "Kitchen Storage",
    amount: "$149.00",
    vendor: "Micro Design",
    status: "Pending" as const,
    rating: "4.5",
    votes: 61,
  },
  {
    id: "#VZ2109",
    customer: "Ayaan Bowen",
    product: "Bike Accessories",
    amount: "$215.00",
    vendor: "Nesta Technologies",
    status: "Paid" as const,
    rating: "4.9",
    votes: 89,
  },
  {
    id: "#VZ2108",
    customer: "Prezy Mark",
    product: "Furniture",
    amount: "$199.00",
    vendor: "Syntyce Solutions",
    status: "Unpaid" as const,
    rating: "4.3",
    votes: 47,
  },
  {
    id: "#VZ2107",
    customer: "Vihan Hudda",
    product: "Bags and Wallets",
    amount: "$330.00",
    vendor: "iTest Factory",
    status: "Paid" as const,
    rating: "4.7",
    votes: 161,
  },
];

const statusBadge = {
  Paid: "bg-[#daf4f0] text-[#0ab39c]",
  Pending: "bg-[#fef4e4] text-[#f7b84b]",
  Unpaid: "bg-[#fde8e4] text-[#f06548]",
};

const activities = [
  {
    title: "Purchase by James Price",
    desc: "Product noise evolve smartwatch",
    time: "02:14 PM Today",
    color: COLORS.success,
  },
  {
    title: "Added new style collection",
    desc: "By Nesta Technologies",
    time: "9:47 PM Yesterday",
    color: COLORS.primary,
  },
  {
    title: "Natasha Carey have liked the products",
    desc: "Allow users to like products in your WooCommerce store.",
    time: "25 Dec, 2021",
    color: COLORS.warning,
  },
  {
    title: "Today offers by Digitech Galaxy",
    desc: "Offer is valid on orders of Rs.500 Or above for selected products only.",
    time: "12 Dec, 2021",
    color: COLORS.info,
  },
  {
    title: "Favorite Product",
    desc: "Esther James have Favorite product.",
    time: "25 Nov, 2021",
    color: COLORS.danger,
  },
];

const categories = [
  { name: "Mobile & Accessories", count: "10,294" },
  { name: "Desktop", count: "6,256" },
  { name: "Electronics", count: "3,479" },
  { name: "Home & Furniture", count: "2,275" },
  { name: "Grocery", count: "1,950" },
  { name: "Fashion", count: "1,582" },
  { name: "Appliances", count: "1,037" },
  { name: "Beauty, Toys & More", count: "924" },
  { name: "Food & Drinks", count: "701" },
  { name: "Toys & Games", count: "239" },
];

const reviews = [
  { stars: 5, count: 2758, pct: 50 },
  { stars: 4, count: 1063, pct: 19 },
  { stars: 3, count: 997, pct: 18 },
  { stars: 2, count: 227, pct: 4 },
  { stars: 1, count: 408, pct: 7 },
];

const revenueTabs = ["ALL", "1M", "6M", "1Y"] as const;

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

export default function EcommerceDashboard() {
  const [revenueTab, setRevenueTab] =
    useState<(typeof revenueTabs)[number]>("ALL");

  return (
    <div>
      {/* Welcome */}
      <div className="card mb-4 overflow-hidden">
        <div className="card-body flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#405189] to-[#5b6ca8] text-white">
          <div>
            <h4 className="m-0 mb-1 text-[18px] font-semibold">
              Good Morning, Anna!
            </h4>
            <p className="m-0 text-[13px] text-white/80">
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded border-0 bg-white px-4 py-2 text-[13px] font-medium text-[#405189] hover:bg-white/90"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className="card-body">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="m-0 mb-1 text-[13px] text-[#878a99]">
                      {kpi.label}
                    </p>
                    <span
                      className={`text-[12px] font-medium ${
                        kpi.positive ? "text-[#0ab39c]" : "text-[#f06548]"
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded"
                    style={{ background: kpi.iconBg }}
                  >
                    <Icon size={20} style={{ color: kpi.iconColor }} />
                  </div>
                </div>
                <h4 className="m-0 mb-2 text-[22px] font-semibold text-[#495057]">
                  {kpi.value}
                </h4>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#405189] no-underline hover:underline"
                >
                  {kpi.link} <ArrowRight size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue + Locations */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Revenue</h5>
              <div className="flex gap-1">
                {revenueTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRevenueTab(tab)}
                    className={`cursor-pointer rounded border-0 px-2.5 py-1 text-[12px] font-medium ${
                      revenueTab === tab
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
              <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Orders", value: "7,585" },
                  { label: "Earnings", value: "$22.89k" },
                  { label: "Refunds", value: "367" },
                  { label: "Conversation Ratio", value: "18.92%" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <h5 className="m-0 text-[16px] font-semibold text-[#495057]">
                      {s.value}
                    </h5>
                    <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
              <ChartContainer className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ecomOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Orders" stroke={COLORS.primary} strokeWidth={2} fill="url(#ecomOrders)" />
                    <Area type="monotone" dataKey="Earnings" stroke={COLORS.success} strokeWidth={2} fill="transparent" />
                    <Area type="monotone" dataKey="Refunds" stroke={COLORS.warning} strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Sales by Locations</h5>
              <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189] hover:bg-[#f3f6f9]">
                Export Report
              </button>
            </div>
            <div className="card-body">
              <div className="mb-4 flex h-[140px] items-center justify-center rounded bg-[#f3f6f9]">
                <MapPin size={48} className="text-[#405189]/opacity-40" />
              </div>
              <ul className="m-0 list-none space-y-3 p-0">
                {locations.map((loc) => (
                  <li key={loc.name}>
                    <div className="mb-1 flex justify-between text-[13px]">
                      <span className="text-[#495057]">{loc.name}</span>
                      <span className="font-medium text-[#495057]">{loc.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9ebec]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${loc.pct}%`, background: loc.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling + Top Sellers */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Best Selling Products</h5>
              <SortSelect
                label="Sort by:"
                value="Today"
                options={["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"]}
              />
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.name} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3">
                          <p className="m-0 font-medium text-[#405189]">{p.name}</p>
                          <span className="text-[11px] text-[#878a99]">{p.date}</span>
                        </td>
                        <td className="px-3 py-3 text-[#495057]">
                          {p.price}
                          <span className="block text-[11px] text-[#878a99]">Price</span>
                        </td>
                        <td className="px-3 py-3 text-[#495057]">
                          {p.orders}
                          <span className="block text-[11px] text-[#878a99]">Orders</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={p.out ? "text-[#f06548]" : "text-[#495057]"}>{p.stock}</span>
                          <span className="block text-[11px] text-[#878a99]">Stock</span>
                        </td>
                        <td className="px-5 py-3 font-medium text-[#495057]">
                          {p.amount}
                          <span className="block text-[11px] font-normal text-[#878a99]">Amount</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-0 px-5 py-3 text-center text-[12px] text-[#878a99]">
                Showing <span className="font-semibold text-[#495057]">5</span> of{" "}
                <span className="font-semibold text-[#495057]">25</span> Results
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-6">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top Sellers</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Seller Name</th>
                      <th className="px-3 py-3 font-medium">Category</th>
                      <th className="px-3 py-3 font-medium">Stock</th>
                      <th className="px-3 py-3 font-medium">Revenue</th>
                      <th className="px-5 py-3 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((s) => (
                      <tr key={s.name} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3">
                          <p className="m-0 font-medium text-[#405189]">{s.name}</p>
                          <span className="text-[11px] text-[#878a99]">{s.owner}</span>
                        </td>
                        <td className="px-3 py-3 text-[#495057]">{s.category}</td>
                        <td className="px-3 py-3 text-[#495057]">{s.stock}</td>
                        <td className="px-3 py-3 font-medium text-[#495057]">{s.revenue}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e9ebec]">
                              <div
                                className="h-full rounded-full bg-[#0ab39c]"
                                style={{ width: `${s.pct}%` }}
                              />
                            </div>
                            <span className="text-[#495057]">{s.pct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-0 px-5 py-3 text-center text-[12px] text-[#878a99]">
                Showing <span className="font-semibold text-[#495057]">5</span> of{" "}
                <span className="font-semibold text-[#495057]">25</span> Results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store visits + Recent orders + Activity */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Store Visits by Source</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body">
              <ChartContainer className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {sourceData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Orders</h5>
              <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189] hover:bg-[#f3f6f9]">
                Generate Report
              </button>
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Order ID</th>
                      <th className="px-3 py-3 font-medium">Customer</th>
                      <th className="px-3 py-3 font-medium">Product</th>
                      <th className="px-3 py-3 font-medium">Amount</th>
                      <th className="px-3 py-3 font-medium">Vendor</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3 font-medium text-[#405189]">{o.id}</td>
                        <td className="px-3 py-3 text-[#495057]">{o.customer}</td>
                        <td className="px-3 py-3 text-[#495057]">{o.product}</td>
                        <td className="px-3 py-3 font-medium text-[#495057]">{o.amount}</td>
                        <td className="px-3 py-3 text-[#495057]">{o.vendor}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${statusBadge[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1 text-[#495057]">
                            <Star size={12} className="fill-[#f7b84b] text-[#f7b84b]" />
                            {o.rating}
                            <span className="text-[11px] text-[#878a99]">({o.votes})</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity + Categories + Reviews */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Activity</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {activities.map((a) => (
                  <li key={a.title} className="relative border-b border-[#e9ebec] py-3 pl-5 last:border-0">
                    <span
                      className="absolute left-0 top-4 h-2.5 w-2.5 rounded-full"
                      style={{ background: a.color }}
                    />
                    <p className="m-0 mb-0.5 text-[13px] font-medium text-[#495057]">{a.title}</p>
                    <p className="m-0 mb-1 text-[12px] text-[#878a99]">{a.desc}</p>
                    <span className="text-[11px] text-[#878a99]">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top 10 Categories</h5>
            </div>
            <div className="card-body !p-0">
              <ol className="m-0 list-none p-0">
                {categories.map((c, i) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between border-b border-[#e9ebec] px-5 py-2.5 text-[13px] last:border-0"
                  >
                    <span className="text-[#495057]">
                      <span className="mr-2 font-medium text-[#878a99]">{i + 1}.</span>
                      {c.name}
                    </span>
                    <span className="font-medium text-[#405189]">({c.count})</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Customer Reviews</h5>
            </div>
            <div className="card-body">
              <div className="mb-4 text-center">
                <h4 className="m-0 mb-1 text-[28px] font-semibold text-[#495057]">4.5</h4>
                <p className="m-0 mb-1 text-[13px] text-[#878a99]">out of 5</p>
                <div className="mb-1 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= 4 ? "fill-[#f7b84b] text-[#f7b84b]" : "fill-[#f7b84b]/50 text-[#f7b84b]/50"}
                    />
                  ))}
                </div>
                <p className="m-0 text-[12px] text-[#878a99]">Total 5.50k reviews</p>
              </div>
              <ul className="m-0 list-none space-y-2 p-0">
                {reviews.map((r) => (
                  <li key={r.stars} className="flex items-center gap-2 text-[12px]">
                    <span className="w-10 shrink-0 text-[#878a99]">{r.stars} star</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9ebec]">
                      <div
                        className="h-full rounded-full bg-[#f7b84b]"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-medium text-[#495057]">
                      {r.count}
                    </span>
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
