"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock3,
  Ban,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
  CalendarDays,
  Download,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Unpaid" | "Refund" | "Cancel";
type PaymentStatus = "Paid" | "Pending";

type InvoiceRow = {
  id: string;
  invoiceId: string;
  customer: string;
  avatar: string;
  email: string;
  country: string;
  date: string;
  amount: string;
  paymentStatus: PaymentStatus;
  status: InvoiceStatus;
};

const invoicesData: InvoiceRow[] = [
  {
    id: "01",
    invoiceId: "#VL25000351",
    customer: "James Morris",
    avatar: "JM",
    email: "jamesmorris@themesbrand.com",
    country: "Germany",
    date: "17 Dec, 2021",
    amount: "$875",
    paymentStatus: "Paid",
    status: "Paid",
  },
  {
    id: "02",
    invoiceId: "#VL25000352",
    customer: "Carien van Sargeras",
    avatar: "CV",
    email: "carienvan@themesbrand.com",
    country: "United States",
    date: "02 Oct, 2021",
    amount: "$875",
    paymentStatus: "Pending",
    status: "Unpaid",
  },
  {
    id: "03",
    invoiceId: "#VL25000353",
    customer: "Jill Vesty",
    avatar: "JV",
    email: "jillvesty@themesbrand.com",
    country: "United Kingdom",
    date: "24 Sep, 2021",
    amount: "$875",
    paymentStatus: "Paid",
    status: "Paid",
  },
  {
    id: "04",
    invoiceId: "#VL25000354",
    customer: "Xavier Beaumont",
    avatar: "XB",
    email: "xavier@themesbrand.com",
    country: "France",
    date: "12 Aug, 2021",
    amount: "$452",
    paymentStatus: "Pending",
    status: "Cancel",
  },
  {
    id: "05",
    invoiceId: "#VL25000355",
    customer: "Curtis Weaver",
    avatar: "CW",
    email: "curtisweaver@themesbrand.com",
    country: "Germany",
    date: "19 Nov, 2021",
    amount: "$875",
    paymentStatus: "Paid",
    status: "Paid",
  },
  {
    id: "06",
    invoiceId: "#VL25000356",
    customer: "Amiee Fralick",
    avatar: "AF",
    email: "amiee@themesbrand.com",
    country: "Canada",
    date: "05 Nov, 2021",
    amount: "$451",
    paymentStatus: "Pending",
    status: "Unpaid",
  },
  {
    id: "07",
    invoiceId: "#VL25000357",
    customer: "Theresa Holcomb",
    avatar: "TH",
    email: "theresa@themesbrand.com",
    country: "United States",
    date: "21 Oct, 2021",
    amount: "$875",
    paymentStatus: "Paid",
    status: "Refund",
  },
  {
    id: "08",
    invoiceId: "#VL25000358",
    customer: "Kruger Randilyn",
    avatar: "KR",
    email: "krugerrandilyn@themesbrand.com",
    country: "Brazil",
    date: "15 Oct, 2021",
    amount: "$398",
    paymentStatus: "Pending",
    status: "Cancel",
  },
  {
    id: "09",
    invoiceId: "#VL25000359",
    customer: "James Morris",
    avatar: "JM",
    email: "jamesmorris@themesbrand.com",
    country: "Germany",
    date: "02 Oct, 2021",
    amount: "$875",
    paymentStatus: "Paid",
    status: "Paid",
  },
  {
    id: "10",
    invoiceId: "#VL25000360",
    customer: "Carien van Sargeras",
    avatar: "CV",
    email: "carienvan@themesbrand.com",
    country: "United States",
    date: "24 Sep, 2021",
    amount: "$875",
    paymentStatus: "Pending",
    status: "Unpaid",
  },
];

const stats = [
  {
    label: "Invoices Sent",
    value: "$559.25k",
    count: "2,258 Invoices sent",
    change: "+89.24 %",
    icon: FileText,
    iconBg: "#e2e5ed",
    iconColor: "#405189",
  },
  {
    label: "Paid Invoices",
    value: "$409.66k",
    count: "1,958 Paid by clients",
    change: "+8.09 %",
    icon: CheckCircle2,
    iconBg: "#daf4f0",
    iconColor: "#0ab39c",
  },
  {
    label: "Unpaid Invoices",
    value: "$36.72k",
    count: "338 Unpaid by clients",
    change: "+9.01 %",
    icon: Clock3,
    iconBg: "#fef4e4",
    iconColor: "#f7b84b",
  },
  {
    label: "Cancelled Invoices",
    value: "$84.16k",
    count: "502 Cancelled by clients",
    change: "+7.55 %",
    icon: Ban,
    iconBg: "#fde8e4",
    iconColor: "#f06548",
  },
];

const statusTabs = ["All", "Unpaid", "Paid", "Cancel", "Refund"] as const;

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-[#daf4f0] text-[#0ab39c]",
  Unpaid: "bg-[#fde8e4] text-[#f06548]",
  Refund: "bg-[#fef4e4] text-[#f7b84b]",
  Cancel: "bg-[#e2e5ed] text-[#405189]",
};

const paymentStyles: Record<PaymentStatus, string> = {
  Paid: "bg-[#daf4f0] text-[#0ab39c]",
  Pending: "bg-[#fef4e4] text-[#f7b84b]",
};

const avatarColors = [
  "#405189",
  "#0ab39c",
  "#f7b84b",
  "#f06548",
  "#299cdb",
  "#6559cc",
];

export default function InvoiceList() {
  const [tab, setTab] = useState<(typeof statusTabs)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return invoicesData.filter((inv) => {
      const matchesTab = tab === "All" || inv.status === tab;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.email.toLowerCase().includes(q) ||
        inv.country.toLowerCase().includes(q) ||
        inv.amount.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const allChecked =
    filtered.length > 0 && filtered.every((inv) => selected.includes(inv.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) =>
        prev.filter((id) => !filtered.some((inv) => inv.id === id)),
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...filtered.map((inv) => inv.id)]),
      ]);
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="card-body">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-[13px] font-medium text-[#878a99]">
                      {stat.label}
                    </p>
                    <h4 className="m-0 text-[22px] font-semibold text-[#495057]">
                      {stat.value}
                    </h4>
                  </div>
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{ background: stat.iconBg }}
                  >
                    <Icon size={22} style={{ color: stat.iconColor }} />
                  </div>
                </div>
                <p className="m-0 flex flex-wrap items-center gap-1.5 text-[12px]">
                  <span className="inline-flex items-center gap-0.5 font-semibold text-[#0ab39c]">
                    <ArrowUpRight size={14} strokeWidth={2.25} />
                    {stat.change}
                  </span>
                  <span className="text-[#878a99]">{stat.count}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices table card */}
      <div className="card">
        <div className="card-header flex-wrap gap-3 !border-b-0">
          <h5 className="card-title">Invoices</h5>
          <Link
            href="/apps/invoices/create"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white no-underline hover:bg-[#099885]"
          >
            <Plus size={15} />
            Create Invoice
          </Link>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e9ebec] px-4">
          {statusTabs.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTab(s)}
              className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[13px] font-medium transition-colors ${
                tab === s
                  ? "border-[#405189] text-[#405189]"
                  : "border-transparent text-[#878a99] hover:text-[#495057]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#e9ebec] px-4 py-3">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for customer, email, country, invoice or something..."
              className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white"
            />
          </div>

          <div className="relative">
            <CalendarDays
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              type="text"
              placeholder="Select date"
              className="h-9 w-[160px] rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white"
              readOnly
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#405189]"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                </th>
                {[
                  "ID",
                  "Invoice Id / Customer",
                  "Email",
                  "Country",
                  "Date",
                  "Amount",
                  "Payment Status",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      {h}
                      {h !== "Action" && (
                        <span className="inline-flex flex-col opacity-40">
                          <ChevronUp size={10} className="-mb-1" />
                          <ChevronDown size={10} />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <h5 className="mb-2 text-[16px] font-semibold text-[#495057]">
                      Sorry! No Result Found
                    </h5>
                    <p className="m-0 text-[13px] text-[#878a99]">
                      We&apos;ve searched more than 150+ invoices We did not find
                      any invoices for you search.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className="border-b border-[#e9ebec] last:border-0 hover:bg-[#f8f9fa]"
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#405189]"
                        checked={selected.includes(inv.id)}
                        onChange={() => toggleOne(inv.id)}
                      />
                    </td>
                    <td className="px-3 py-3.5 text-[#495057]">{inv.id}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                          style={{
                            background: avatarColors[i % avatarColors.length],
                          }}
                        >
                          {inv.avatar}
                        </span>
                        <div>
                          <a
                            href="#"
                            className="block font-medium text-[#405189] no-underline hover:underline"
                          >
                            {inv.invoiceId}
                          </a>
                          <span className="text-[12px] text-[#878a99]">
                            {inv.customer}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#495057]">{inv.email}</td>
                    <td className="px-3 py-3.5 text-[#495057]">{inv.country}</td>
                    <td className="px-3 py-3.5 text-[#495057]">{inv.date}</td>
                    <td className="px-3 py-3.5 font-medium text-[#495057]">
                      {inv.amount}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase ${
                          paymentStyles[inv.paymentStatus]
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase ${
                          statusStyles[inv.status]
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="relative px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAction(
                            openAction === inv.id ? null : inv.id,
                          )
                        }
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#878a99] hover:bg-[#f3f6f9]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openAction === inv.id && (
                        <div className="absolute top-10 right-3 z-20 min-w-[130px] rounded border border-[#e9ebec] bg-white py-1 shadow-md">
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                          >
                            <Download size={14} />
                            Download
                          </button>
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#f06548] hover:bg-[#f3f6f9]"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px] text-[#878a99]">
          <p className="m-0">
            Showing <b className="text-[#495057]">{filtered.length}</b> of{" "}
            <b className="text-[#495057]">{invoicesData.length}</b> Results
          </p>
          <div className="flex overflow-hidden rounded border border-[#e9ebec]">
            <button
              type="button"
              className="cursor-pointer border-0 bg-white px-3 py-1.5 text-[13px] text-[#878a99] hover:bg-[#f3f6f9]"
            >
              Previous
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 border-l border-[#e9ebec] bg-[#405189] px-3 py-1.5 text-[13px] text-white"
            >
              1
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 border-l border-[#e9ebec] bg-white px-3 py-1.5 text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
