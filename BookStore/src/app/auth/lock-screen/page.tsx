import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Lock Screen | Velzon - Admin Dashboard",
};

export default function LockScreenPage() {
  return (
    <AuthShell title="Lock Screen" subtitle="Enter your password to unlock the screen!">
      <div className="card-body p-6">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#405189] text-2xl font-semibold text-white">
            AA
          </div>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Anna Adame
          </h5>
        </div>
        <form className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded border-0 bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Unlock
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-0 text-[13px] text-[#878a99]">
            Not you? return{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-[#405189] no-underline hover:underline"
            >
              Signin
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
