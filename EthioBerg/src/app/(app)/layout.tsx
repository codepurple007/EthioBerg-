"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard redirectTo="/auth/signin">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
