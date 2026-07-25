"use client";

import { ArrowUp, Settings } from "lucide-react";

export default function FloatingActions() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-2">
      <button
        type="button"
        onClick={scrollTop}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f7b84b] text-white shadow-md hover:bg-[#f5a623]"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
      <button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-[#405189] text-white shadow-md hover:bg-[#364574]"
        aria-label="Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
