"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import { ApiProvider } from "@/providers/ApiProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApiProvider>{children}</ApiProvider>
    </AuthProvider>
  );
}
