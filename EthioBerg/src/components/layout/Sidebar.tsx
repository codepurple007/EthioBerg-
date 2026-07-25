"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  FileSearch,
  ClipboardCheck,
  MessageSquareQuote,
  Building2,
  FileOutput,
  Settings,
  ScrollText,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getMenuForUser } from "@/lib/auth/permissions";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Library,
  FileSearch,
  ClipboardCheck,
  MessageSquareQuote,
  Building2,
  FileOutput,
  Settings,
  ScrollText,
  Globe,
};

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const sections = user ? getMenuForUser(user) : [];

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-[250px] flex-col bg-[#405189] text-white">
      <div className="flex h-[70px] shrink-0 items-center px-6">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2 no-underline">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#0ab39c" opacity="0.25" />
            <path
              d="M6 16V10l4 3 4-3v6M6 8h12"
              stroke="#fff"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[20px] font-bold tracking-wide text-white">EthioBerg</span>
        </Link>
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-3">
            <p className="mb-1 px-3 pt-3 text-[11px] font-semibold tracking-wider text-[#838fb9]">
              {section.title}
            </p>
            <ul className="m-0 list-none p-0">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href} className="mb-0.5">
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded px-3 py-2.5 text-[13.5px] no-underline transition-colors ${
                        active
                          ? "bg-white/10 font-medium text-white"
                          : "text-[#abb9e8] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className="shrink-0 opacity-90" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {user && (
        <div className="shrink-0 border-t border-white/10 px-4 py-3">
          <p className="m-0 truncate text-[12px] font-medium text-white">{user.fullName}</p>
          <p className="m-0 truncate text-[11px] text-[#abb9e8]">{user.email}</p>
        </div>
      )}
    </aside>
  );
}
