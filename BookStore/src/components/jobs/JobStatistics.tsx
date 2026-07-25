"use client";
import { Briefcase, Users, Building2, FileCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Total Jobs", value: "3,647", change: "18.89%", up: true, icon: Briefcase, bg: "#e2e5ed", color: "#405189" },
  { label: "Apply Jobs", value: "1,285", change: "8.41%", up: true, icon: FileCheck, bg: "#daf4f0", color: "#0ab39c" },
  { label: "New Jobs", value: "295", change: "3.87%", up: false, icon: Building2, bg: "#fef4e4", color: "#f7b84b" },
  { label: "Interview", value: "107", change: "1.09%", up: true, icon: Users, bg: "#e1f0fa", color: "#299cdb" },
];

const byType = [
  { label: "Full Time", count: 1245, pct: 45 },
  { label: "Part Time", count: 780, pct: 28 },
  { label: "Freelance", count: 420, pct: 15 },
  { label: "Remote", count: 340, pct: 12 },
];

export default function JobStatistics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const Trend = s.up ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={s.label} className="card"><div className="card-body">
              <div className="mb-3 flex justify-between">
                <div>
                  <p className="mb-2 text-[13px] text-[#878a99]">{s.label}</p>
                  <h4 className="m-0 text-[22px] font-semibold text-[#495057]">{s.value}</h4>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: s.bg }}><Icon size={22} style={{ color: s.color }} /></div>
              </div>
              <p className="m-0 flex items-center gap-1 text-[12px]">
                <span className={`inline-flex items-center font-semibold ${s.up?"text-[#0ab39c]":"text-[#f06548]"}`}><Trend size={14} />{s.change}</span>
                <span className="text-[#878a99]">vs last month</span>
              </p>
            </div></div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-header"><h5 className="card-title">Jobs by Type</h5></div>
        <div className="card-body space-y-4">
          {byType.map((t) => (
            <div key={t.label}>
              <div className="mb-1 flex justify-between text-[13px]"><span className="font-medium text-[#495057]">{t.label}</span><span className="text-[#878a99]">{t.count} ({t.pct}%)</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[#e9ebec]"><div className="h-full rounded-full bg-[#405189]" style={{ width: `${t.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
