"use client";

import {
  Library,
  ClipboardCheck,
  MessageSquareQuote,
  Building2,
  FileSearch,
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";

const statConfig = [
  {
    key: "activeSources" as const,
    label: "Active Sources",
    icon: Library,
    color: "bg-[#e2e5ed] text-[#405189]",
  },
  {
    key: "pendingReviews" as const,
    label: "Pending Reviews",
    icon: FileSearch,
    color: "bg-[#fef4e4] text-[#b8860b]",
  },
  {
    key: "readinessRuns" as const,
    label: "Readiness Runs",
    icon: ClipboardCheck,
    color: "bg-[#daf4f0] text-[#0ab39c]",
  },
  {
    key: "qaSessions" as const,
    label: "Q&A Sessions",
    icon: MessageSquareQuote,
    color: "bg-[#e1f0fa] text-[#299cdb]",
  },
  {
    key: "registeredCompanies" as const,
    label: "ESX Issuers",
    icon: Building2,
    color: "bg-[#e2e5ed] text-[#405189]",
  },
];

export default function DashboardStatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="card">
          <div className="card-body">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mb-2 text-[13px] font-medium text-[#878a99]">{label}</p>
                <h4 className="m-0 text-[24px] font-semibold tracking-tight text-[#495057]">
                  {stats[key]}
                </h4>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color}`}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
