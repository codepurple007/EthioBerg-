import Link from "next/link";
import { Home } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "404 Error | Velzon - Admin Dashboard",
};

export default function Auth404Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f3f9] px-4 py-10">
      <AuthBrand />
      <div className="mt-8 w-full max-w-[500px] text-center">
        <div className="relative mx-auto mb-6 flex h-48 w-full max-w-sm items-center justify-center">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(to bottom right, #e2e5ed, #f3f3f9)",
            }}
          />
          <span className="relative text-[96px] font-bold leading-none text-[#405189]">
            404
          </span>
        </div>
        <h3 className="m-0 text-xl font-semibold text-[#495057]">
          Looking for something?
        </h3>
        <p className="mt-2 mb-6 text-[13px] text-[#878a99]">
          We can&apos;t find this page. The page you are looking for doesn&apos;t
          exist or has been moved.
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
