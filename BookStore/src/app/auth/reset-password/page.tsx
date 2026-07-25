import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Reset Password | Velzon - Admin Dashboard",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Forgot Password?"
      subtitle="Reset password with Velzon"
    >
      <div className="card-body p-6">
        <div className="mb-4 rounded border border-[#e1f0fa] bg-[#e1f0fa] px-3 py-2.5 text-[13px] text-[#299cdb]">
          Enter your email and instructions will be sent to you!
        </div>
        <form className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded border-0 bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Send Reset Link
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-0 text-[13px] text-[#878a99]">
            Wait, I remember my password...{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-[#405189] no-underline hover:underline"
            >
              Click here
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
