import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Sign Up | Velzon - Admin Dashboard",
};

export default function SignUpPage() {
  return (
    <AuthShell title="Create New Account" subtitle="Get your free Velzon account now">
      <div className="card-body p-6">
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
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
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
          <p className="m-0 text-[12px] text-[#878a99]">
            By registering you agree to the Velzon{" "}
            <Link href="/pages/terms" className="text-[#405189] no-underline">
              Terms of Use
            </Link>
          </p>
          <button
            type="submit"
            className="w-full rounded border-0 bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-0 text-[13px] text-[#878a99]">
            Already have an account?{" "}
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
