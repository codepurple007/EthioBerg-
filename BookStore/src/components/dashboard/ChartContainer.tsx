"use client";

import { useEffect, useState } from "react";

export default function ChartContainer({
  children,
  className = "h-[300px] w-full",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${className} flex items-center justify-center text-[12px] text-[#878a99]`}
      >
        Loading chart...
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
