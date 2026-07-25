"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  createEthioBergApi,
  resolveApiMode,
  type EthioBergApi,
} from "@/lib/api/index";

type ApiContextValue = {
  api: EthioBergApi;
  mode: "remote" | "mock" | "loading";
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"remote" | "mock" | "loading">("loading");

  useEffect(() => {
    let active = true;
    resolveApiMode().then((resolved) => {
      if (active) setMode(resolved);
    });
    return () => {
      active = false;
    };
  }, []);

  const api = useMemo(() => {
    if (mode === "loading") {
      return createEthioBergApi(undefined, "mock");
    }
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
