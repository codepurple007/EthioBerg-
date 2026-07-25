"use client";

import Image from "next/image";
import {
  Search,
  Menu,
  ShoppingBag,
  Maximize,
  Moon,
  Bell,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

type HeaderProps = {
  onToggleSidebar?: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e9ebec] bg-white">
      <div className="flex h-[70px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden sm:block">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-[220px] rounded border border-[#e9ebec] bg-[#f3f3f9] py-2 pr-3 pl-9 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white lg:w-[260px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-[#f3f6f9]"
            aria-label="Language"
          >
            <span className="text-lg leading-none">🇺🇸</span>
          </button>

          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Apps"
          >
            <LayoutGrid size={18} />
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#405189] px-1 text-[10px] font-semibold text-white">
              5
            </span>
          </button>

          <button
            type="button"
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9] md:flex"
            aria-label="Fullscreen"
          >
            <Maximize size={18} />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Dark mode"
          >
            <Moon size={18} />
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#495057] hover:bg-[#f3f6f9]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f06548] px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <button
            type="button"
            className="ml-1 flex cursor-pointer items-center gap-2 rounded border-0 bg-transparent py-1 pr-1 pl-2 hover:bg-[#f3f6f9]"
          >
            <Image
              src="/avatar-anna.svg"
              alt="Anna Adame"
              className="h-8 w-8 rounded-full object-cover"
              width={32}
              height={32}
            />
            <div className="hidden text-left sm:block">
              <p className="m-0 text-[13px] font-semibold leading-tight text-[#495057]">
                Anna Adame
              </p>
              <p className="m-0 text-[11px] leading-tight text-[#878a99]">
                Founder
              </p>
            </div>
            <ChevronDown size={14} className="hidden text-[#878a99] sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
