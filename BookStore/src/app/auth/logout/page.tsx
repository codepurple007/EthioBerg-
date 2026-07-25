import Link from "next/link";
import { CheckCircle } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = {
  title: "Logout | Velzon - Admin Dashboard",
};

export default function LogoutPage() {
  return (
    <AuthShell>
      <div className="card-body p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#daf4f0]">
          <CheckCircle className="text-[#0ab39c]" size={32} />
        </div>
        <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
          You are Logged Out
        </h5>
        <p className="mt-2 mb-5 text-[13px] text-[#878a99]">
          Thank you for using <span className="font-semibold text-[#405189]">Velzon</span>{" "}
          admin template
        </p>
        <Link
          href="/auth/signin"
          className="inline-block w-full rounded bg-[#0ab39c] px-4 py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#099885]"
        >
          Sign In
        </Link>
      </div>
    </AuthShell>
  );
}
