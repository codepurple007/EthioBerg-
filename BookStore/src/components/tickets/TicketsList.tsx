"use client";

import { useMemo, useState } from "react";
import {
  Ticket,
  Hourglass,
  Lock,
  Trash2,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Filter,
} from "lucide-react";

type TicketStatus = "Open" | "Inprogress" | "Closed" | "New";
type TicketPriority = "High" | "Medium" | "Low";

type TicketRow = {
  id: string;
  title: string;
  client: string;
  assignedTo: string;
  assignedAvatar: string;
  createDate: string;
  dueDate: string;
  status: TicketStatus;
  priority: TicketPriority;
};

const ticketsData: TicketRow[] = [
  {
    id: "#VLZ13",
    title: "Error message when submitting",
    client: "Themesbrand",
    assignedTo: "Erica Kernan",
    assignedAvatar: "EK",
    createDate: "03 Feb, 2022",
    dueDate: "07 Feb, 2022",
    status: "Inprogress",
    priority: "High",
  },
  {
    id: "#VLZ12",
    title: "Additional Calendar",
    client: "Themesbrand",
    assignedTo: "Jacinthe Verry",
    assignedAvatar: "JV",
    createDate: "05 Feb, 2022",
    dueDate: "06 Feb, 2022",
    status: "Open",
    priority: "Medium",
  },
  {
    id: "#VLZ11",
    title: "Edit customer testimonial",
    client: "Themesbrand",
    assignedTo: "James Forbes",
    assignedAvatar: "JF",
    createDate: "29 Jan, 2012",
    dueDate: "02 Feb, 2022",
    status: "Closed",
    priority: "Low",
  },
  {
    id: "#VLZ10",
    title: "Additional Calendar",
    client: "Themesbrand",
    assignedTo: "John Robles",
    assignedAvatar: "JR",
    createDate: "24 Jan, 2012",
    dueDate: "29 Jan, 2022",
    status: "Inprogress",
    priority: "High",
  },
  {
    id: "#VLZ9",
    title: "Brand logo design",
    client: "Themesbrand",
    assignedTo: "Ashley Silva",
    assignedAvatar: "AS",
    createDate: "17 Jan, 2012",
    dueDate: "24 Jan, 2022",
    status: "Inprogress",
    priority: "Medium",
  },
  {
    id: "#VLZ8",
    title: "Banner design for FB & Twitter",
    client: "Themesbrand",
    assignedTo: "Tonya Johnson",
    assignedAvatar: "TJ",
    createDate: "13 Jan, 2012",
    dueDate: "20 Jan, 2022",
    status: "Closed",
    priority: "Medium",
  },
  {
    id: "#VLZ7",
    title: "User research",
    client: "Themesbrand",
    assignedTo: "James Forbes",
    assignedAvatar: "JF",
    createDate: "07 Jan, 2012",
    dueDate: "17 Jan, 2022",
    status: "Open",
    priority: "Low",
  },
  {
    id: "#VLZ6",
    title: "Change email option process",
    client: "Themesbrand",
    assignedTo: "Erica Kernan",
    assignedAvatar: "EK",
    createDate: "07 Jan, 2012",
    dueDate: "17 Jan, 2022",
    status: "Inprogress",
    priority: "Low",
  },
  {
    id: "#VLZ5",
    title: "Additional Calendar",
    client: "Themesbrand",
    assignedTo: "Jacinthe Verry",
    assignedAvatar: "JV",
    createDate: "05 Feb, 2022",
    dueDate: "06 Feb, 2022",
    status: "New",
    priority: "High",
  },
  {
    id: "#VLZ4",
    title: "Edit customer testimonial",
    client: "Themesbrand",
    assignedTo: "John Robles",
    assignedAvatar: "JR",
    createDate: "22 Jan, 2012",
    dueDate: "02 Feb, 2022",
    status: "Closed",
    priority: "Low",
  },
];

const stats = [
  {
    label: "Total Tickets",
    value: "547k",
    change: "17.32 %",
    positive: true,
    icon: Ticket,
    iconBg: "#e2e5ed",
    iconColor: "#405189",
  },
  {
    label: "Pending Tickets",
    value: "124k",
    change: "0.96 %",
    positive: false,
    icon: Hourglass,
    iconBg: "#e1f0fa",
    iconColor: "#299cdb",
  },
  {
    label: "Closed Tickets",
    value: "107K",
    change: "3.87 %",
    positive: true,
    icon: Lock,
    iconBg: "#daf4f0",
    iconColor: "#0ab39c",
  },
  {
    label: "Deleted Tickets",
    value: "15.95%",
    change: "1.09 %",
    positive: false,
    icon: Trash2,
    iconBg: "#fde8e4",
    iconColor: "#f06548",
  },
];

const statusTabs = ["All", "Open", "Inprogress", "Closed", "New"] as const;

const statusStyles: Record<TicketStatus, string> = {
  Open: "bg-[#e1f0fa] text-[#299cdb]",
  Inprogress: "bg-[#fef4e4] text-[#f7b84b]",
  Closed: "bg-[#daf4f0] text-[#0ab39c]",
  New: "bg-[#e2e5ed] text-[#405189]",
};

const priorityStyles: Record<TicketPriority, string> = {
  High: "bg-[#fde8e4] text-[#f06548]",
  Medium: "bg-[#fef4e4] text-[#d29c36]",
  Low: "bg-[#daf4f0] text-[#0ab39c]",
};

const avatarColors = [
  "#405189",
  "#0ab39c",
  "#f7b84b",
  "#f06548",
  "#299cdb",
  "#6559cc",
];

export default function TicketsList() {
  const [tab, setTab] = useState<(typeof statusTabs)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ticketsData.filter((t) => {
      const matchesTab = tab === "All" || t.status === tab;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const allChecked =
    filtered.length > 0 && filtered.every((t) => selected.includes(t.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => prev.filter((id) => !filtered.some((t) => t.id === id)));
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...filtered.map((t) => t.id)]),
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
          const Trend = stat.positive ? ArrowUpRight : ArrowDownRight;
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
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      stat.positive ? "text-[#0ab39c]" : "text-[#f06548]"
                    }`}
                  >
                    <Trend size={14} strokeWidth={2.25} />
                    {stat.change}
                  </span>
                  <span className="text-[#878a99]">vs. previous month</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tickets table card */}
      <div className="card">
        <div className="card-header flex-wrap gap-3 !border-b-0">
          <h5 className="card-title">Tickets</h5>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            <Plus size={15} />
            Create Tickets
          </button>
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
              placeholder="Search for ticket details or something..."
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
              placeholder="Select date range"
              className="h-9 w-[180px] rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white"
              readOnly
            />
          </div>

          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]"
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-[13px]">
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
                  "Title",
                  "Client",
                  "Assigned To",
                  "Create Date",
                  "Due Date",
                  "Status",
                  "Priority",
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
                      We&apos;ve searched more than 150+ Tickets We did not find
                      any Tickets for you search.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((ticket, i) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-[#e9ebec] last:border-0 hover:bg-[#f8f9fa]"
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#405189]"
                        checked={selected.includes(ticket.id)}
                        onChange={() => toggleOne(ticket.id)}
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <a
                        href="#"
                        className="font-medium text-[#405189] no-underline hover:underline"
                      >
                        {ticket.id}
                      </a>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-[#495057]">
                      {ticket.title}
                    </td>
                    <td className="px-3 py-3.5 text-[#495057]">{ticket.client}</td>
                    <td className="px-3 py-3.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                          style={{
                            background: avatarColors[i % avatarColors.length],
                          }}
                        >
                          {ticket.assignedAvatar}
                        </span>
                        <span className="text-[#495057]">{ticket.assignedTo}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-[#495057]">
                      {ticket.createDate}
                    </td>
                    <td className="px-3 py-3.5 text-[#495057]">{ticket.dueDate}</td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase ${
                          statusStyles[ticket.status]
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase ${
                          priorityStyles[ticket.priority]
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="relative px-3 py-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAction(
                            openAction === ticket.id ? null : ticket.id,
                          )
                        }
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#878a99] hover:bg-[#f3f6f9]"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openAction === ticket.id && (
                        <div className="absolute top-10 right-3 z-20 min-w-[120px] rounded border border-[#e9ebec] bg-white py-1 shadow-md">
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                          >
                            <Eye size={14} />
                            View
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
            <b className="text-[#495057]">{ticketsData.length}</b> Results
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
