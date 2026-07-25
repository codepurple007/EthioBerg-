import PageHeader from "@/components/layout/PageHeader";

export default function ModulePlaceholder({
  title,
  phase,
  description,
  srsRefs,
}: {
  title: string;
  phase: string;
  description: string;
  srsRefs?: string[];
}) {
  return (
    <>
      <PageHeader title={title} breadcrumbs={[{ label: "EthioBerg", href: "/dashboard" }, { label: title }]} />
      <div className="card">
        <div className="card-body">
          <span className="mb-3 inline-flex rounded bg-[#e2e5ed] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#405189]">
            {phase}
          </span>
          <h5 className="m-0 mb-2 text-[16px] font-semibold text-[#495057]">{title}</h5>
          <p className="m-0 mb-4 max-w-2xl text-[13px] leading-relaxed text-[#878a99]">
            {description}
          </p>
          {srsRefs && srsRefs.length > 0 && (
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#878a99]">
                SRS references
              </p>
              <ul className="m-0 list-disc pl-5 text-[13px] text-[#495057]">
                {srsRefs.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
