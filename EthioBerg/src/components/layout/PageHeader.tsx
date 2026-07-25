import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function PageHeader({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: Crumb[];
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-0 text-[16px] font-semibold tracking-wide text-[#405189] uppercase">
        {title}
      </h4>
      <nav className="text-[13px] text-[#878a99]">
        <ol className="m-0 flex list-none items-center gap-1.5 p-0">
          {breadcrumbs.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="opacity-50">/</span>}
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-[#878a99] no-underline hover:text-[#405189]"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-[#495057]">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
