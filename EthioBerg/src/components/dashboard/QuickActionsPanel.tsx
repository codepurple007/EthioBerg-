"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { getMenuForUser } from "@/lib/auth/permissions";
import { ArrowRight, Rocket } from "lucide-react";

export default function QuickActionsPanel() {
  const { user } = useAuth();
  if (!user) return null;

  const actions = getMenuForUser(user)
    .flatMap((section) => section.items)
    .filter((item) => item.href !== "/dashboard")
    .slice(0, 4);

  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Quick Actions</h5>
        <Rocket size={18} className="text-[#405189]" />
      </div>
      <div className="card-body space-y-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between rounded border border-[#e9ebec] px-3 py-2.5 text-[13px] text-[#495057] no-underline transition-colors hover:border-[#405189] hover:bg-[#f8f9fa]"
          >
            <span>{action.label}</span>
            <ArrowRight size={14} className="text-[#878a99]" />
          </Link>
        ))}
        <p className="mb-0 pt-2 text-[12px] leading-relaxed text-[#878a99]">
          Modules marked &quot;Phase 1+&quot; in navigation will be implemented in upcoming
          delivery phases.
        </p>
      </div>
    </div>
  );
}
