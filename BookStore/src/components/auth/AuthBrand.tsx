import Link from "next/link";

export default function AuthBrand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="mb-4 inline-flex items-center gap-2 no-underline">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0ab39c" />
        <path
          d="M2 17l10 5 10-5M2 12l10 5 10-5"
          stroke={light ? "#fff" : "#405189"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`text-[22px] font-bold tracking-wide ${light ? "text-white" : "text-[#405189]"}`}
      >
        VELZON
      </span>
    </Link>
  );
}
