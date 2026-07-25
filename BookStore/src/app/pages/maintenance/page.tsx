import Link from "next/link";
import { Wrench } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "Maintenance | Velzon - Admin Dashboard",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f9] px-4 py-10">
      <AuthBrand />
      <div className="mt-8 w-full max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef4e4]">
          <Wrench className="text-[#f7b84b]" size={36} />
        </div>
        <h3 className="m-0 text-xl font-semibold text-[#495057]">
          Site is Under Maintenance
        </h3>
        <p className="mt-2 mb-6 text-[13px] text-[#878a99]">
          Please check back in sometime. We are working hard to improve our
          website and we&apos;ll be ready to launch after some time.
        </p>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Why is the Site Down?", text: "Scheduled upgrades." },
            { label: "What is the Downtime?", text: "About 2–4 hours." },
            { label: "Do you need support?", text: "support@themesbrand.com" },
          ].map((b) => (
            <div key={b.label} className="card p-3 text-left">
              <p className="m-0 text-[12px] font-semibold text-[#495057]">
                {b.label}
              </p>
              <p className="mt-1 mb-0 text-[11px] text-[#878a99]">{b.text}</p>
            </div>
          ))}
        </div>
        <Link
          href="/"
          className="inline-block rounded bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#099885]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
