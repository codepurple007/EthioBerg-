"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  CalendarDays,
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  status: "Inprogress" | "Completed" | "Pending" | "New";
  progress: number;
  due: string;
  members: string[];
  tasks: string;
  color: string;
};

const projectsData: Project[] = [
  {
    id: "PRJ001",
    name: "Chat App Design",
    status: "Inprogress",
    progress: 65,
    due: "15 Jan, 2022",
    members: ["EK", "AC", "JM"],
    tasks: "18/24",
    color: "#405189",
  },
  {
    id: "PRJ002",
    name: "ABC Project",
    status: "Pending",
    progress: 30,
    due: "22 Jan, 2022",
    members: ["NM", "TJ"],
    tasks: "8/20",
    color: "#f7b84b",
  },
  {
    id: "PRJ003",
    name: "Brand Logo Design",
    status: "Completed",
    progress: 100,
    due: "10 Dec, 2021",
    members: ["HS", "MM", "PW", "RS"],
    tasks: "12/12",
    color: "#0ab39c",
  },
  {
    id: "PRJ004",
    name: "Project Update",
    status: "New",
    progress: 10,
    due: "28 Jan, 2022",
    members: ["AC"],
    tasks: "2/15",
    color: "#299cdb",
  },
  {
    id: "PRJ005",
    name: "Shopping Portal",
    status: "Inprogress",
    progress: 48,
    due: "05 Feb, 2022",
    members: ["EK", "TJ", "NM"],
    tasks: "21/40",
    color: "#f06548",
  },
  {
    id: "PRJ006",
    name: "Admin Dashboard",
    status: "Completed",
    progress: 100,
    due: "01 Dec, 2021",
    members: ["JM", "HS"],
    tasks: "30/30",
    color: "#0ab39c",
  },
];

const statusStyle = {
  Inprogress: "bg-[#fef4e4] text-[#d29e2c]",
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
  Pending: "bg-[#fde8e4] text-[#f06548]",
  New: "bg-[#e1f0fa] text-[#299cdb]",
};

export default function ProjectsList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return projectsData.filter((p) => {
      const statusOk = statusFilter === "All" || p.status === statusFilter;
      return (
        statusOk &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }, [query, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="rounded border border-[#e9ebec] bg-white py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-[#e9ebec] bg-white px-2 py-2 text-[13px] outline-none"
          >
            {["All", "New", "Inprogress", "Pending", "Completed"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/apps/projects/create"
          className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white no-underline hover:bg-[#364574]"
        >
          <Plus size={14} /> Create Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${statusStyle[p.status]}`}
                  >
                    {p.status}
                  </span>
                  <Link
                    href="/apps/projects/overview"
                    className="mt-2 block text-[15px] font-semibold text-[#495057] no-underline hover:text-[#405189]"
                  >
                    {p.name}
                  </Link>
                  <p className="m-0 text-[12px] text-[#878a99]">{p.id}</p>
                </div>
                <button type="button" className="text-[#878a99]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="mb-3">
                <div className="mb-1 flex justify-between text-[11px] text-[#878a99]">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded bg-[#e9ebec]">
                  <div
                    className="h-full rounded"
                    style={{ width: `${p.progress}%`, background: p.color }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[12px] text-[#878a99]">
                <span className="inline-flex items-center gap-1">
                  <Users size={13} /> {p.tasks} tasks
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={13} /> {p.due}
                </span>
              </div>
              <div className="mt-3 flex -space-x-1.5">
                {p.members.map((m, i) => (
                  <span
                    key={m}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white"
                    style={{
                      background: ["#405189", "#0ab39c", "#299cdb", "#f7b84b"][
                        i % 4
                      ],
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
