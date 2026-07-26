"use client";

import { Loader2, WifiOff } from "lucide-react";
import { useEthioApi } from "@/providers/ApiProvider";

/**
 * Says out loud when the app is serving demo data.
 *
 * Without this the fallback is invisible: every page still renders, actions
 * still report success, and there is nothing to distinguish a scrape that ran
 * from a canned response. Silence here is what makes the fallback dangerous,
 * not the fallback itself.
 */
export default function DemoModeBanner() {
  const { mode } = useEthioApi();

  if (mode === "remote") return null;

  if (mode === "loading") {
    return (
      <div className="mb-4 flex items-start gap-2 rounded border border-[#e9ebec] bg-[#f8f9fa] px-4 py-2">
        <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-[#878a99]" />
        <p className="m-0 text-[12px] text-[#878a99]">Connecting to the EthioBerg API…</p>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-start gap-2 rounded border border-[#f06548] bg-[#fdf0ee] px-4 py-3">
      <WifiOff size={18} className="mt-0.5 shrink-0 text-[#f06548]" />
      <p className="m-0 text-[13px] leading-relaxed text-[#f06548]">
        <span className="font-semibold">Demo mode — this is not live data.</span> The app is not
        connected to the EthioBerg API, so every figure on screen is sample data and actions
        such as scraping, uploading, and evaluation are simulated rather than performed.
        Reconnecting automatically; this banner disappears once the API responds.
      </p>
    </div>
  );
}
