"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/lib/types";
import type { Permission } from "@/lib/auth/permissions";
import { hasPermission } from "@/lib/auth/permissions";

export function RoleGuard({
  children,
  permission,
  allowedRoles,
  redirectTo = "/auth/signin",
}: {
  children: React.ReactNode;
  permission?: Permission;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
      return;
    }
    if (permission && !hasPermission(user.role, permission)) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, permission, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f9]">
        <p className="text-[#878a99]">Loading...</p>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (permission && !hasPermission(user.role, permission)) return null;

  return <>{children}</>;
}
