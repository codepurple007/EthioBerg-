"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/providers/AuthProvider";
import { demoUsers } from "@/lib/mock/seed-data";
import { roleLabels } from "@/lib/auth/permissions";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("adviser@ethioberg.et");
  const [password, setPassword] = useState("Adviser@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.replace("/dashboard");
      return;
    }
    setError("Invalid email or password. Use one of the demo accounts below.");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your ESX listing and disclosure workflows."
    >
      <div className="card-body p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[13px] font-medium text-[#495057]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ethioberg.et"
              required
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[13px] font-medium text-[#495057]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] text-[#495057] outline-none focus:border-[#405189]"
            />
          </div>

          {error && (
            <p className="m-0 rounded border border-[#f7b84b] bg-[#fef4e4] px-3 py-2 text-[12px] text-[#856404]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded border-0 bg-[#405189] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#364574] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#e9ebec] pt-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#878a99]">
            Demo accounts
          </p>
          <ul className="m-0 space-y-2 p-0">
            {demoUsers.map((user) => (
              <li key={user.id} className="list-none">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(
                      user.role === "listing_adviser"
                        ? "Adviser@123"
                        : user.role === "issuer"
                          ? "Issuer@12345"
                          : user.role === "compliance_officer"
                            ? "Compliance@123"
                            : user.role === "investor"
                              ? "Investor@123"
                              : "Admin@12345",
                    );
                  }}
                  className="w-full cursor-pointer rounded border border-[#e9ebec] bg-[#f8f9fa] px-3 py-2 text-left text-[12px] text-[#495057] hover:border-[#405189]"
                >
                  <span className="font-medium">{roleLabels[user.role]}</span>
                  <span className="block text-[#878a99]">{user.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthShell>
  );
}
