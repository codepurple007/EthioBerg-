"use client";

import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  FileText,
  MessageSquare,
} from "lucide-react";

const team = [
  { name: "Erica Kernan", role: "Project Manager", avatar: "EK", color: "#405189" },
  { name: "Alexis Clarke", role: "UI/UX Designer", avatar: "AC", color: "#0ab39c" },
  { name: "James Morris", role: "Developer", avatar: "JM", color: "#299cdb" },
  { name: "Nancy Martino", role: "QA Engineer", avatar: "NM", color: "#f7b84b" },
];

const activities = [
  {
    user: "Erica Kernan",
    action: "updated task status to In Progress",
    time: "2 hours ago",
  },
  {
    user: "Alexis Clarke",
    action: "uploaded design mockups",
    time: "5 hours ago",
  },
  {
    user: "James Morris",
    action: "commented on Profile Page Structure",
    time: "Yesterday",
  },
  {
    user: "Nancy Martino",
    action: "completed Brand Logo Design",
    time: "2 days ago",
  },
];

const tasks = [
  { title: "Profile Page Structure", status: "Inprogress", due: "03 Jan" },
  { title: "Admin Layout Design", status: "Completed", due: "07 Jan" },
  { title: "Brand Logo Design", status: "Pending", due: "12 Jan" },
  { title: "Create Product Animations", status: "New", due: "18 Jan" },
];

const statusStyle: Record<string, string> = {
  Inprogress: "bg-[#fef4e4] text-[#d29e2c]",
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
  Pending: "bg-[#fde8e4] text-[#f06548]",
  New: "bg-[#e1f0fa] text-[#299cdb]",
};

export default function ProjectsOverview() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-body">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded bg-[#fef4e4] px-2 py-0.5 text-[11px] font-semibold text-[#d29e2c]">
                Inprogress
              </span>
              <h4 className="m-0 mt-2 text-[18px] font-semibold text-[#495057]">
                Chat App Design
              </h4>
              <p className="m-0 mt-1 text-[13px] text-[#878a99]">
                Create a modern messaging experience with channels, DMs, and file
                sharing for the Velzon product suite.
              </p>
            </div>
            <div className="text-right text-[13px] text-[#878a99]">
              <p className="m-0 flex items-center justify-end gap-1">
                <CalendarDays size={13} /> Due: 15 Jan, 2022
              </p>
              <p className="m-0 mt-1 flex items-center justify-end gap-1">
                <Clock size={13} /> Created: 01 Dec, 2021
              </p>
            </div>
          </div>
          <div className="mb-2 flex justify-between text-[12px] text-[#878a99]">
            <span>Overall Progress</span>
            <span>65%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-[#e9ebec]">
            <div className="h-full w-[65%] rounded bg-[#405189]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Tasks", value: "18/24", icon: CheckCircle2, color: "#0ab39c" },
          { label: "Members", value: "4", icon: Users, color: "#405189" },
          { label: "Files", value: "12", icon: FileText, color: "#299cdb" },
          { label: "Comments", value: "36", icon: MessageSquare, color: "#f7b84b" },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="card-body flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                <s.icon size={18} />
              </span>
              <div>
                <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                <p className="m-0 text-[18px] font-semibold text-[#495057]">
                  {s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Team Members</h5>
            </div>
            <div className="card-body space-y-3">
              {team.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={{ background: m.color }}
                  >
                    {m.avatar}
                  </span>
                  <div>
                    <p className="m-0 text-[13px] font-semibold text-[#495057]">
                      {m.name}
                    </p>
                    <p className="m-0 text-[12px] text-[#878a99]">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Tasks</h5>
            </div>
            <div className="divide-y divide-[#e9ebec]">
              {tasks.map((t) => (
                <div
                  key={t.title}
                  className="flex items-center justify-between gap-2 px-4 py-3"
                >
                  <div>
                    <p className="m-0 text-[13px] font-medium text-[#495057]">
                      {t.title}
                    </p>
                    <p className="m-0 text-[11px] text-[#878a99]">Due {t.due}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${statusStyle[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Activity</h5>
            </div>
            <div className="card-body space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#405189]" />
                  <div>
                    <p className="m-0 text-[13px] text-[#495057]">
                      <strong>{a.user}</strong> {a.action}
                    </p>
                    <p className="m-0 text-[11px] text-[#878a99]">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
