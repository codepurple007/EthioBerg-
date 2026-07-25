import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "500 Error | Velzon - Admin Dashboard",
};

export default function Auth500Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f9] px-4 py-10">
      <AuthBrand />
      <div className="mt-8 w-full max-w-[500px] text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fde8e4]">
          <AlertTriangle className="text-[#f06548]" size={40} />
        </div>
        <h1 className="m-0 text-[64px] font-bold leading-none text-[#405189]">500</h1>
        <h3 className="mt-3 mb-0 text-xl font-semibold text-[#495057]">
          Internal Server Error
        </h3>
        <p className="mt-2 mb-6 text-[13px] text-[#878a99]">
          Server Error 500. We&apos;re not exactly sure what happened, but our servers
          say something is wrong.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#099885]"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
      <p className="mt-10 mb-0 text-center text-[13px] text-[#878a99]">
        © {new Date().getFullYear()} Velzon
      </p>
    </div>
  );
}
