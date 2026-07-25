"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type TaskStatus = "New" | "Inprogress" | "Completed" | "Pending";
type Priority = "High" | "Medium" | "Low";

type TaskRow = {
  id: string;
  title: string;
  project: string;
  assigned: string;
  avatar: string;
  due: string;
  status: TaskStatus;
  priority: Priority;
};

const tasksData: TaskRow[] = [
  {
    id: "#VLZ452",
    title: "Profile Page Structure",
    project: "Velzon - Admin Dashboard",
    assigned: "Erica Kernan",
    avatar: "EK",
    due: "03 Jan, 2022",
    status: "Inprogress",
    priority: "High",
  },
  {
    id: "#VLZ453",
    title: "Velzon - Admin Layout Design",
    project: "Velzon - Admin Dashboard",
    assigned: "Prezy William",
    avatar: "PW",
    due: "07 Jan, 2022",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "#VLZ454",
    title: "Admin Layout Design",
    project: "Skote - React Admin",
    assigned: "Ruhi Shakin",
    avatar: "RS",
    due: "07 Jan, 2022",
    status: "Completed",
    priority: "Low",
  },
  {
    id: "#VLZ455",
    title: "Brand Logo Design",
    project: "Doot - Chat App Template",
    assigned: "Alexis Clarke",
    avatar: "AC",
    due: "22 Dec, 2021",
    status: "New",
    priority: "High",
  },
  {
    id: "#VLZ456",
    title: "Change Old App Icon",
    project: "Steex - Admin Dashboard",
    assigned: "James Morris",
    avatar: "JM",
    due: "24 Oct, 2021",
    status: "Inprogress",
    priority: "Medium",
  },
  {
    id: "#VLZ457",
    title: "Create Product Animations",
    project: "Hybrix - Admin Template",
    assigned: "Nancy Martino",
    avatar: "NM",
    due: "16 Nov, 2021",
    status: "Completed",
    priority: "Low",
  },
  {
    id: "#VLZ458",
    title: "Product Features Analysis",
    project: "Velzon - Admin Dashboard",
    assigned: "Tonya Johnson",
    avatar: "TJ",
    due: "05 Jan, 2022",
    status: "Pending",
    priority: "High",
  },
  {
    id: "#VLZ459",
    title: "Create a Blog Template UI",
    project: "Skote - React Admin",
    assigned: "Herbert Stokes",
    avatar: "HS",
    due: "05 Nov, 2021",
    status: "New",
    priority: "Medium",
  },
];

const statusStyle: Record<TaskStatus, string> = {
  New: "bg-[#e1f0fa] text-[#299cdb]",
  Inprogress: "bg-[#fef4e4] text-[#d29e2c]",
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
  Pending: "bg-[#fde8e4] text-[#f06548]",
};

const priorityStyle: Record<Priority, string> = {
  High: "text-[#f06548]",
  Medium: "text-[#f7b84b]",
  Low: "text-[#0ab39c]",
};

export default function TasksList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [rows, setRows] = useState(tasksData);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.toLowerCase();
      const statusOk = statusFilter === "All" || r.status === statusFilter;
      return (
        statusOk &&
        (r.title.toLowerCase().includes(q) ||
          r.project.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q))
      );
    });
  }, [rows, query, statusFilter]);

  const remove = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-2">
        <h5 className="card-title">Tasks List</h5>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-[#e9ebec] bg-white px-2 py-1.5 text-[13px] text-[#495057] outline-none"
          >
            {["All", "New", "Inprogress", "Completed", "Pending"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#364574]"
          >
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>
      <div className="card-body overflow-x-auto p-0">
        <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e9ebec] bg-[#f3f3f9] text-[#878a99]">
              <th className="px-4 py-3 font-medium">Task ID</th>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Assigned To</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-[#e9ebec] hover:bg-[#fafafa]"
              >
                <td className="px-4 py-3 font-medium text-[#405189]">{r.id}</td>
                <td className="px-4 py-3 font-medium text-[#495057]">
                  {r.title}
                </td>
                <td className="px-4 py-3 text-[#878a99]">{r.project}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#405189] text-[10px] font-semibold text-white">
                      {r.avatar}
                    </span>
                    {r.assigned}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#878a99]">{r.due}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${statusStyle[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className={`px-4 py-3 font-semibold ${priorityStyle[r.priority]}`}>
                  {r.priority}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-[#878a99]">
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-[#e1f0fa] hover:text-[#299cdb]"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-[#fef4e4] hover:text-[#f7b84b]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(r.id)}
                      className="rounded p-1.5 hover:bg-[#fde8e4] hover:text-[#f06548]"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-[#f3f3f9]"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
