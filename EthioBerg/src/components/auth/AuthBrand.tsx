import Link from "next/link";

export default function AuthBrand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-2 no-underline">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#0ab39c" opacity="0.15" />
        <path
          d="M6 16V10l4 3 4-3v6M6 8h12"
          stroke={light ? "#fff" : "#405189"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`text-[22px] font-bold tracking-wide ${light ? "text-white" : "text-[#405189]"}`}
      >
        EthioBerg
      </span>
    </Link>
  );
}
