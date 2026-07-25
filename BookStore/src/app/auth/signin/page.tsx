import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Sign In | Velzon - Admin Dashboard",
};

export default function SignInPage() {
  return (
    <AuthShell title="Welcome Back !" subtitle="Sign in to continue to Velzon.">
      <div className="card-body p-6">
        <form className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
              Username
            </label>
            <input
              type="email"
              defaultValue="admin@themesbrand.com"
              placeholder="Enter username"
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#495057]">
                Password
              </label>
              <Link
                href="/auth/reset-password"
                className="text-[12px] text-[#405189] no-underline hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              defaultValue="123456"
              placeholder="Enter password"
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
          <label className="flex items-center gap-2 text-[13px] text-[#495057]">
            <input type="checkbox" defaultChecked className="accent-[#405189]" />
            Remember me
          </label>
          <button
            type="submit"
            className="w-full rounded border-0 bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Sign In
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-0 text-[13px] text-[#878a99]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-[#405189] no-underline hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
