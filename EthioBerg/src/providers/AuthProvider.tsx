"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "ethioberg_session";
const TIMEOUT_KEY = "ethioberg_last_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const lastActivity = localStorage.getItem(TIMEOUT_KEY);
      if (raw && lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed < SESSION_TIMEOUT_MS) {
          setUser(JSON.parse(raw) as User);
          localStorage.setItem(TIMEOUT_KEY, String(Date.now()));
        } else {
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(TIMEOUT_KEY);
        }
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem(TIMEOUT_KEY);
      if (!lastActivity) return;
      if (Date.now() - parseInt(lastActivity, 10) >= SESSION_TIMEOUT_MS) {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TIMEOUT_KEY);
        router.push("/auth/signin");
      }
    }, 60000);

    const update = () => localStorage.setItem(TIMEOUT_KEY, String(Date.now()));
    window.addEventListener("click", update);
    window.addEventListener("keydown", update);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", update);
      window.removeEventListener("keydown", update);
    };
  }, [user, router]);

  const login = useCallback(async (email: string, password: string) => {
    const found = api.authenticate(email, password);
    if (!found) return { ok: false };
    setUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    localStorage.setItem(TIMEOUT_KEY, String(Date.now()));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TIMEOUT_KEY);
    router.push("/auth/signin");
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
