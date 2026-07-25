"use client";

import Link from "next/link";
import type { AnalysisRun } from "@/lib/types";
import { demoUsers } from "@/lib/mock/seed-data";

const typeLabels: Record<AnalysisRun["type"], string> = {
  readiness: "Listing Readiness",
  document_review: "Document Review",
  regulatory_qa: "Regulatory Q&A",
  company_explorer: "Company Explorer",
};

const statusStyles: Record<AnalysisRun["status"], string> = {
  completed: "bg-[#daf4f0] text-[#0ab39c]",
  in_progress: "bg-[#fef4e4] text-[#b8860b]",
  failed: "bg-[#fde8e4] text-[#f06548]",
};

export default function RecentActivityTable({ runs }: { runs: AnalysisRun[] }) {
  const sorted = [...runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Recent Activity</h5>
        <Link href="/reports" className="text-[13px] text-[#405189] no-underline hover:underline">
          View reports
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
              <th className="px-4 py-3 font-semibold text-[#878a99]">Run ID</th>
              <th className="px-4 py-3 font-semibold text-[#878a99]">Type</th>
              <th className="px-4 py-3 font-semibold text-[#878a99]">User</th>
              <th className="px-4 py-3 font-semibold text-[#878a99]">Started</th>
              <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((run) => {
              const user = demoUsers.find((u) => u.id === run.userId);
              return (
                <tr key={run.id} className="border-b border-[#e9ebec] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#495057]">{run.id}</td>
                  <td className="px-4 py-3 text-[#495057]">{typeLabels[run.type]}</td>
                  <td className="px-4 py-3 text-[#495057]">{user?.fullName ?? run.userId}</td>
                  <td className="px-4 py-3 text-[#878a99]">
                    {new Date(run.startedAt).toLocaleString("en-ET", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[run.status]}`}
                    >
                      {run.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
