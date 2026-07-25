"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import { useAuth } from "@/providers/AuthProvider";
import { useEthioApi } from "@/providers/ApiProvider";
import { getAuthApi } from "@/lib/api/index";
import { getRoleLabel } from "@/lib/auth/permissions";
import type { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { api, mode } = useEthioApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const runs = getAuthApi().getAnalysisRuns();

  useEffect(() => {
    let active = true;
    api.getDashboardStats().then((data) => {
      if (active) setStats(data);
    });
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "EthioBerg", href: "/dashboard" }, { label: "Overview" }]}
      />

      {mode === "remote" && (
        <div className="mb-4 rounded border border-[#daf4f0] bg-[#daf4f0] px-4 py-2 text-[12px] text-[#0ab39c]">
          Backend connected at {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
        </div>
      )}

      <div className="mb-4 rounded border border-[#e9ebec] bg-white px-4 py-3">
        <p className="m-0 text-[13px] text-[#495057]">
          Signed in as{" "}
          <span className="font-semibold text-[#405189]">{user?.fullName}</span> (
          {user ? getRoleLabel(user) : ""}). Use the sidebar to open listing, disclosure, and
          regulatory workflows.
        </p>
      </div>

      {stats && (
        <div className="mb-4">
          <DashboardStatsCards stats={stats} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RecentActivityTable runs={runs} />
        </div>
        <div className="xl:col-span-4">
          <QuickActionsPanel />
        </div>
      </div>
    </>
  );
}
