import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  Check,
  Clock3,
  Database,
  Download,
  FileText,
  Headphones,
  KeyRound,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Webhook,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Subscription Plans | EthioBerg",
  description:
    "Choose an EthioBerg market intelligence plan for analysts, advisory teams, and enterprise institutions.",
};

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Plan = {
  name: string;
  eyebrow: string;
  price: string;
  suffix?: string;
  audience: string;
  promise: string;
  cta: string;
  href: string;
  highlighted?: boolean;
  features: Feature[];
};

const plans: Plan[] = [
  {
    name: "Basic",
    eyebrow: "Entry",
    price: "2,000 ETB",
    suffix: "/ month",
    audience: "Individual analysts, single-broker offices, and small research desks.",
    promise: "Full platform access with practical monthly and daily usage limits.",
    cta: "Start with Basic",
    href: "mailto:access@ethioberg.com?subject=EthioBerg%20Basic%20Plan",
    features: [
      {
        icon: BarChart3,
        title: "Daily market data",
        description: "OHLC prices and volume for TELE, WGBX, AWAB, ABAYB, and GDAB.",
      },
      {
        icon: Clock3,
        title: "30 daily lookups",
        description: "Up to 30 queries or requests across the platform each day.",
      },
      {
        icon: Database,
        title: "6-month history",
        description: "Explore up to six months of historical stock trends.",
      },
      {
        icon: Download,
        title: "5 data exports",
        description: "Export up to five CSV or Excel files every month.",
      },
      {
        icon: FileText,
        title: "3 branded reports",
        description: "Generate three client-ready PDF reports per month.",
      },
      {
        icon: BrainCircuit,
        title: "10 daily AI questions",
        description: "Ask up to ten regulatory Q&A questions each day.",
      },
    ],
  },
  {
    name: "Pro",
    eyebrow: "Most popular",
    price: "5,000 ETB",
    suffix: "/ month",
    audience: "Advisory firms, active broker-dealers, and dedicated research teams.",
    promise: "Every EthioBerg capability with zero usage limits for your team.",
    cta: "Choose Pro",
    href: "mailto:access@ethioberg.com?subject=EthioBerg%20Pro%20Plan",
    highlighted: true,
    features: [
      {
        icon: Zap,
        title: "Live market feeds",
        description: "Real-time ESX prices with complete available market depth.",
      },
      {
        icon: Sparkles,
        title: "Unlimited lookups",
        description: "Run unlimited queries across every platform capability.",
      },
      {
        icon: Database,
        title: "Complete archives",
        description: "Access all historical financial statements and disclosures.",
      },
      {
        icon: Download,
        title: "Unlimited exports",
        description: "Export CSV, Excel, and PDF files whenever your work requires.",
      },
      {
        icon: FileText,
        title: "Custom branded reports",
        description: "Create unlimited client reports with your own uploaded logo.",
      },
      {
        icon: BrainCircuit,
        title: "Unlimited AI assistant",
        description: "Search regulations and prospectuses without query limits.",
      },
      {
        icon: Users,
        title: "3–5 analyst seats",
        description: "Collaborate securely with a multi-seat team workspace.",
      },
    ],
  },
  {
    name: "Enterprise",
    eyebrow: "Tailored",
    price: "Custom",
    audience: "Investment banks, capital-market institutions, and corporate advisory arms.",
    promise: "Capacity, integrations, and support designed around your institution.",
    cta: "Talk to our team",
    href: "mailto:access@ethioberg.com?subject=EthioBerg%20Enterprise",
    features: [
      {
        icon: Users,
        title: "Custom seats",
        description: "Allocate access across teams or your entire workforce.",
      },
      {
        icon: KeyRound,
        title: "High-throughput APIs",
        description: "Connect market and regulatory data to internal software.",
      },
      {
        icon: Webhook,
        title: "Bulk extraction",
        description: "Use dedicated webhooks and database access for quantitative models.",
      },
      {
        icon: Headphones,
        title: "SLA and priority support",
        description: "Receive guaranteed uptime and a dedicated account manager.",
      },
      {
        icon: ShieldCheck,
        title: "Institutional controls",
        description: "Tailored governance, permissions, and deployment support.",
      },
    ],
  },
];

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="EthioBerg home">
      <svg viewBox="0 0 44 44" aria-hidden="true" className="size-9 shrink-0">
        <path
          d="M22 1.75 40.25 12.3v19.4L22 42.25 3.75 31.7V12.3L22 1.75Z"
          fill="#2563EB"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        <path d="m8.8 30.2 8.55-13.05 4.1 5.25 4.65-8.05 9.1 15.85H8.8Z" fill="white" />
        <path
          d="m17.35 17.15 4.1 5.25-2.05 3.15-3.1-2.45-3.45 2.45 4.5-8.4Z"
          fill="#BFDBFE"
        />
        <path d="m26.1 14.35 3.05 5.3-2.35-.95-2.1 1.2 1.4-5.55Z" fill="#BFDBFE" />
      </svg>
      <span className="[font-family:var(--font-poppins)]">
        <span className="block text-[17px] font-bold leading-none tracking-[-0.035em] text-white">
          Ethio<span className="text-blue-400">Berg</span>
        </span>
        <span className="mt-1 block text-[6px] font-semibold uppercase tracking-[0.22em] text-blue-200/70">
          Regulatory Intelligence
        </span>
      </span>
    </Link>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden border ${
        plan.highlighted
          ? "border-blue-500 bg-[#071B3D] text-white shadow-2xl shadow-blue-950/20 lg:-translate-y-3"
          : "border-slate-200 bg-white text-[#07142E]"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute right-0 top-0 bg-blue-500 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white">
          Best value
        </div>
      )}

      <div className="border-b border-inherit p-7 sm:p-8">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            plan.highlighted ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {plan.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">{plan.name}</h2>
        <div className="mt-5 flex min-h-12 items-end gap-2">
          <span className="text-3xl font-semibold tracking-[-0.04em]">{plan.price}</span>
          {plan.suffix && (
            <span className={`pb-1 text-xs ${plan.highlighted ? "text-blue-200/60" : "text-slate-500"}`}>
              {plan.suffix}
            </span>
          )}
        </div>
        <p className={`mt-5 text-xs leading-6 ${plan.highlighted ? "text-blue-100/65" : "text-slate-500"}`}>
          {plan.audience}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div
          className={`mb-7 flex gap-3 border-l-2 px-4 py-3 ${
            plan.highlighted
              ? "border-blue-400 bg-blue-500/10 text-blue-100"
              : "border-blue-600 bg-blue-50 text-blue-950"
          }`}
        >
          <Layers3 className="mt-0.5 size-4 shrink-0" />
          <p className="text-[11px] font-semibold leading-5">{plan.promise}</p>
        </div>

        <ul className="space-y-5">
          {plan.features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex gap-3.5">
                <span
                  className={`grid size-8 shrink-0 place-items-center ${
                    plan.highlighted ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs font-bold">{feature.title}</p>
                  <p
                    className={`mt-1 text-[10px] leading-5 ${
                      plan.highlighted ? "text-blue-100/55" : "text-slate-500"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <a
          href={plan.href}
          className={`mt-8 flex h-12 items-center justify-center gap-3 text-xs font-bold transition ${
            plan.highlighted
              ? "bg-blue-500 text-white hover:bg-blue-400"
              : "bg-[#071B3D] text-white hover:bg-blue-700"
          }`}
        >
          {plan.cta} <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
}

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-[#F5F8FD] text-[#07142E]">
      <header className="border-b border-blue-900 bg-[#061B49] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <a
            href="mailto:access@ethioberg.com"
            className="hidden items-center gap-2 text-[11px] font-bold text-blue-100 transition hover:text-white sm:flex"
          >
            Contact sales <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#061B49] px-5 pb-28 pt-20 text-white lg:px-8 lg:pb-36 lg:pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,.18)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 mask-[linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto flex w-fit items-center gap-2 border border-blue-400/25 bg-blue-400/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200">
            <Sparkles size={12} />
            Plans built for Ethiopia&apos;s capital market
          </div>
          <h1 className="mt-7 text-balance text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
            Intelligence that scales with{" "}
            <span className="font-semibold text-blue-300">your ambition.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-blue-100/65 sm:text-base">
            Every plan gives you the full EthioBerg workflow. Choose the capacity that fits
            your research desk, advisory team, or institution.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-16 px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {[
            [ShieldCheck, "Source-grounded", "Built on approved ECMA directives and ESX rules."],
            [Building2, "Institution-ready", "Controlled workflows for regulated professional teams."],
            [Check, "No hidden modules", "Full feature access at every tier; only capacity changes."],
          ].map(([Icon, title, copy]) => {
            const ItemIcon = Icon as LucideIcon;
            return (
              <div key={title as string} className="flex gap-4 bg-white p-6">
                <ItemIcon className="size-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-bold">{title as string}</p>
                  <p className="mt-1 text-[10px] leading-5 text-slate-500">{copy as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="bg-[#020A1B] px-5 py-8 text-blue-100/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[9px] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EthioBerg. All rights reserved.</p>
          <p>Prices exclude applicable taxes. Enterprise capacity is agreed during onboarding.</p>
        </div>
      </footer>
    </main>
  );
}
