import Link from "next/link";
import { ArrowRight, LayoutDashboard, Shield, Sparkles } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "Landing | Velzon",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f3f9]">
      <header className="border-b border-[#e9ebec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <AuthBrand />
          <nav className="hidden items-center gap-6 text-[13px] md:flex">
            <a href="#features" className="text-[#878a99] no-underline hover:text-[#405189]">
              Features
            </a>
            <a href="#plans" className="text-[#878a99] no-underline hover:text-[#405189]">
              Plans
            </a>
            <Link href="/auth/signin" className="text-[#878a99] no-underline hover:text-[#405189]">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded bg-[#405189] px-3 py-2 font-medium text-white no-underline"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#405189] via-[#364574] to-[#299cdb] px-4 py-20 text-white">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="m-0 mb-3 text-[12px] tracking-[0.2em] text-white/70 uppercase">
            Admin & Dashboard Template
          </p>
          <h1 className="m-0 text-4xl font-bold tracking-tight sm:text-5xl">
            Build faster with Velzon
          </h1>
          <p className="mx-auto mt-4 mb-8 max-w-xl text-[15px] text-white/80">
            A modern admin experience with dashboards, apps, auth pages, and
            marketing landings — ready for your next product.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded bg-[#0ab39c] px-5 py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#099885]"
            >
              View Demo <ArrowRight size={16} />
            </Link>
            <Link
              href="/pages/pricing"
              className="inline-flex items-center gap-2 rounded border border-white/40 bg-white/10 px-5 py-2.5 text-[13px] font-medium text-white no-underline hover:bg-white/20"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#0ab39c]/20" />
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="m-0 text-2xl font-semibold text-[#495057]">
            Everything you need
          </h2>
          <p className="mt-2 mb-0 text-[13px] text-[#878a99]">
            Production-ready pages styled like the Velzon HTML template.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: LayoutDashboard,
              title: "Dashboards",
              text: "Analytics, CRM, and more with card-based layouts.",
            },
            {
              icon: Shield,
              title: "Authentication",
              text: "Sign in, sign up, lock screen, and error pages.",
            },
            {
              icon: Sparkles,
              title: "Apps & Pages",
              text: "Invoices, tickets, profile, pricing, and gallery.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-[#e2e5ed] text-[#405189]">
                <f.icon size={20} />
              </div>
              <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                {f.title}
              </h5>
              <p className="mt-2 mb-0 text-[13px] text-[#878a99]">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="border-t border-[#e9ebec] bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div>
            <h3 className="m-0 text-xl font-semibold text-[#495057]">
              Ready to get started?
            </h3>
            <p className="mt-1 mb-0 text-[13px] text-[#878a99]">
              Explore plans or jump straight into the admin demo.
            </p>
          </div>
          <Link
            href="/pages/pricing"
            className="rounded bg-[#405189] px-4 py-2.5 text-[13px] font-medium text-white no-underline"
          >
            View Pricing
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e9ebec] py-6 text-center text-[12px] text-[#878a99]">
        © {new Date().getFullYear()} Velzon. Themesbrand.
      </footer>
    </div>
  );
}
