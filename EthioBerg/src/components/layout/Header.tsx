"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useEthioApi } from "@/providers/ApiProvider";
import { roleLabels } from "@/lib/auth/permissions";
import type { AppSettings } from "@/lib/types";

type HeaderProps = {
  onToggleSidebar?: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { api } = useEthioApi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    api.getSettings().then((data) => {
      if (active) setSettings(data);
    });
    return () => {
      active = false;
    };
  }, [api]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e9ebec] bg-white">
      <div className="flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9] lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <p className="m-0 text-[11px] font-medium uppercase tracking-wide text-[#878a99]">
              ESX · ECMA decision support
            </p>
            <p className="m-0 text-[13px] font-semibold text-[#495057]">
              Rule version {settings?.activeRuleVersion ?? "…"}
              {settings?.syntheticDemoEnabled && (
                <span className="ml-2 rounded bg-[#fef4e4] px-1.5 py-0.5 text-[10px] font-medium text-[#856404]">
                  Demo mode
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#405189] px-1 text-[10px] font-semibold text-white">
              2
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="ml-1 flex cursor-pointer items-center gap-2 rounded border-0 bg-transparent py-1 pr-1 pl-2 hover:bg-[#f3f6f9]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#405189] text-[12px] font-semibold text-white">
                {user ? initials(user.fullName) : "?"}
              </span>
              <div className="hidden text-left sm:block">
                <p className="m-0 text-[13px] font-semibold leading-tight text-[#495057]">
                  {user?.fullName ?? "Guest"}
                </p>
                <p className="m-0 text-[11px] leading-tight text-[#878a99]">
                  {user ? roleLabels[user.role] : ""}
                </p>
              </div>
              <ChevronDown size={14} className="hidden text-[#878a99] sm:block" />
            </button>

            {menuOpen && user && (
              <div className="absolute right-0 mt-2 w-52 rounded border border-[#e9ebec] bg-white py-1 shadow-lg">
                <div className="border-b border-[#e9ebec] px-3 py-2">
                  <p className="m-0 text-[13px] font-medium text-[#495057]">{user.fullName}</p>
                  <p className="m-0 text-[11px] text-[#878a99]">{user.email}</p>
                </div>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={14} />
                  Profile (Phase 1)
                </button>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#f06548] hover:bg-[#fde8e4]"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
