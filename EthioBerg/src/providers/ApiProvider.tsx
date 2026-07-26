"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  createEthioBergApi,
  isMockForced,
  resolveApiMode,
  type EthioBergApi,
} from "@/lib/api/index";

type ApiContextValue = {
  api: EthioBergApi;
  mode: "remote" | "mock" | "loading";
};

const ApiContext = createContext<ApiContextValue | null>(null);

const FIRST_RETRY_MS = 3_000;
const MAX_RETRY_MS = 30_000;

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"remote" | "mock" | "loading">("loading");

  useEffect(() => {
    if (isMockForced()) {
      setMode("mock");
      return;
    }

    let active = true;
    let timer: number | undefined;

    // A backend that is merely asleep looks identical to one that is absent, so
    // keep retrying instead of settling on demo data for the rest of the session.
    const attempt = async (delayMs: number) => {
      const resolved = await resolveApiMode();
      if (!active) return;
      setMode(resolved);
      if (resolved === "remote") return;
      timer = window.setTimeout(
        () => void attempt(Math.min(delayMs * 2, MAX_RETRY_MS)),
        delayMs,
      );
    };

    void attempt(FIRST_RETRY_MS);

    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const actor = useMemo(
    () => (user ? { actorId: user.id, actorName: user.fullName } : undefined),
    [user],
  );

  const api = useMemo(() => {
    if (mode === "loading") {
      return createEthioBergApi(undefined, "mock");
    }
    return createEthioBergApi(actor, mode);
  }, [mode, actor]);

  // createEthioBergApi also falls back to demo data when there is no signed-in
  // actor, so report the client that was actually built rather than what the
  // health check alone found.
  const effectiveMode: ApiContextValue["mode"] =
    mode === "loading" ? "loading" : mode === "remote" && actor ? "remote" : "mock";

  const value = useMemo(() => ({ api, mode: effectiveMode }), [api, effectiveMode]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useEthioApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useEthioApi must be used within ApiProvider");
  return ctx;
}
