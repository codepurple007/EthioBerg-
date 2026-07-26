"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { createEthioBergApi, resolveApiMode, type EthioBergApi } from "@/lib/api/index";

type ApiContextValue = {
  api: EthioBergApi;
  mode: "remote" | "mock";
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const mode = resolveApiMode();

  const api = useMemo(() => {
    const actor = user ? { actorId: user.id, actorName: user.fullName } : undefined;
    return createEthioBergApi(actor, mode);
  }, [mode, user]);

  const value = useMemo(() => ({ api, mode }), [api, mode]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useEthioApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useEthioApi must be used within ApiProvider");
  return ctx;
}
