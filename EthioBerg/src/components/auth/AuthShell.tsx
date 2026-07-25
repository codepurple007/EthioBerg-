import AuthBrand from "./AuthBrand";

export default function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f9] px-4 py-10">
      <div className="mb-4 text-center">
        <AuthBrand />
        {title && (
          <h5 className="m-0 mt-3 text-[15px] font-semibold text-[#495057]">{title}</h5>
        )}
        {subtitle && <p className="mt-1 mb-0 text-[13px] text-[#878a99]">{subtitle}</p>}
      </div>
      <div className="card w-full max-w-[480px]">{children}</div>
      <p className="mt-6 mb-0 max-w-md text-center text-[12px] leading-relaxed text-[#878a99]">
        Decision-support for ESX and ECMA workflows. Not a compliance certificate or investment
        advice.
      </p>
    </div>
  );
}
