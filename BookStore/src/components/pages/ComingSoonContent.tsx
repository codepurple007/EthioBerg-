"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthBrand from "@/components/auth/AuthBrand";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function ComingSoonContent() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 24 * 45);
  const [time, setTime] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f9] px-4 py-10">
      <AuthBrand />
      <div className="mt-8 w-full max-w-xl text-center">
        <h3 className="m-0 text-xl font-semibold text-[#495057]">
          Coming Soon
        </h3>
        <p className="mt-2 mb-8 text-[13px] text-[#878a99]">
          We&apos;re building something amazing. Stay tuned!
        </p>
        <div className="mb-8 grid grid-cols-4 gap-3">
          {blocks.map((b) => (
            <div key={b.label} className="card py-4">
              <div className="text-2xl font-bold text-[#405189]">
                {String(b.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[11px] tracking-wide text-[#878a99] uppercase">
                {b.label}
              </div>
            </div>
          ))}
        </div>
        <form className="mx-auto flex max-w-md gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
          />
          <button
            type="submit"
            className="rounded border-0 bg-[#0ab39c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Notify Me
          </button>
        </form>
        <Link
          href="/"
          className="mt-6 inline-block text-[13px] text-[#405189] no-underline hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
