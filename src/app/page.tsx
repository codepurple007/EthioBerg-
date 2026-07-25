"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  FileSearch,
  Fingerprint,
  LockKeyhole,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";

const navItems = ["Platform", "Solutions", "Regulatory Library", "Company Data"];

const modules = [
  {
    label: "Listing readiness",
    title: "Pre-file with evidence, not assumptions.",
    copy: "Test objective Main and Growth Market requirements against validated issuer facts before submission.",
    metric: "48",
    metricLabel: "requirements checked",
    icon: FileCheck2,
  },
  {
    label: "Regulatory intelligence",
    title: "Every answer returns to its source.",
    copy: "Ask questions across approved ECMA directives and ESX rules with clause-level citations and safe abstention.",
    metric: "100%",
    metricLabel: "citation coverage target",
    icon: ShieldCheck,
  },
  {
    label: "Document review",
    title: "Turn complex filings into structured evidence.",
    copy: "Extract financial tables, disclosures, dates, and issuer facts while preserving their page-level provenance.",
    metric: "Page-level",
    metricLabel: "source traceability",
    icon: FileSearch,
  },
  {
    label: "Company explorer",
    title: "Professional financial views, controlled by data.",
    copy: "Render verified company facts and approved chart templates without invented prices or market claims.",
    metric: "0",
    metricLabel: "LLM calculations",
    icon: BarChart3,
  },
];

const auditChecks = [
  ["Operating track record", "MET", "ESX Rulebook · C §4.2"],
  ["IFRS financial statements", "MET", "ECMA 1030/2024 · Art. 42"],
  ["Free-float schedule", "REVIEW", "ESX Rulebook · C §6.1"],
];

function Wordmark() {
  return (
    <a href="#" className="group inline-flex items-center gap-2.5" aria-label="EthioBerg home">
      <svg
        viewBox="0 0 44 44"
        aria-hidden="true"
        className="size-9 shrink-0 overflow-visible"
      >
        <path
          d="M22 1.75 40.25 12.3v19.4L22 42.25 3.75 31.7V12.3L22 1.75Z"
          fill="#2563EB"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        <path
          d="m8.8 30.2 8.55-13.05 4.1 5.25 4.65-8.05 9.1 15.85H8.8Z"
          fill="white"
        />
        <path
          d="m17.35 17.15 4.1 5.25-2.05 3.15-3.1-2.45-3.45 2.45 4.5-8.4Z"
          fill="#BFDBFE"
        />
        <path
          d="m26.1 14.35 3.05 5.3-2.35-.95-2.1 1.2 1.4-5.55Z"
          fill="#BFDBFE"
        />
        <path d="M11.25 31.4h21.5" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="min-w-0 [font-family:var(--font-poppins)]">
        <span className="block whitespace-nowrap text-[17px] font-bold leading-none tracking-[-0.035em] text-white">
          Ethio<span className="text-blue-400">Berg</span>
        </span>
        <span className="mt-1 block whitespace-nowrap text-[6px] font-semibold uppercase tracking-[0.22em] text-blue-200/70">
          Regulatory Intelligence
        </span>
      </span>
    </a>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("ethioberg-theme");
    const enabled = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", enabled);
    const frame = window.requestAnimationFrame(() => setDark(enabled));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("ethioberg-theme", next ? "dark" : "light");
  }

  const active = modules[activeModule];
  const ActiveIcon = active.icon;

  return (
    <main className="min-h-screen bg-white text-[#07142E] transition-colors dark:bg-[#050914] dark:text-white">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#061B49] text-white shadow-lg shadow-blue-950/10">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-5 lg:px-8">
          <div className="w-48 shrink-0">
            <Wordmark />
          </div>

          <nav className="hidden h-full flex-1 items-stretch justify-center lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={item === "Platform" ? "#platform" : "#solutions"}
                className="flex items-center gap-2 border-x border-transparent px-5 text-xs font-semibold text-blue-100/80 transition hover:border-blue-900 hover:bg-blue-950/40 hover:text-white"
              >
                {item}
                <ChevronDown size={12} strokeWidth={1.8} />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex w-48 items-center justify-end gap-1">
            <button
              type="button"
              className="grid size-10 place-items-center text-blue-100 transition hover:bg-blue-950/50 hover:text-white"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="grid size-10 place-items-center text-blue-100 transition hover:bg-blue-950/50 hover:text-white"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a
              href="#access"
              className="ml-2 hidden h-9 items-center bg-blue-600 px-4 text-[11px] font-bold text-white transition hover:bg-blue-500 xl:flex"
            >
              Institutional access
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid size-10 place-items-center lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-blue-900 bg-[#041538] px-5 py-4 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item}
                href={item === "Platform" ? "#platform" : "#solutions"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-blue-900/70 py-4 text-sm font-semibold text-blue-100"
              >
                {item} <ChevronRight size={15} />
              </a>
            ))}
            <a href="#access" className="mt-4 flex h-11 items-center justify-center bg-blue-600 text-sm font-bold">
              Request institutional access
            </a>
          </nav>
        )}
      </header>

      <section className="exchange-hero relative mt-16 min-h-[570px] overflow-hidden bg-[#020A1B] text-white">
        <div className="exchange-ribbon exchange-ribbon-one" />
        <div className="exchange-ribbon exchange-ribbon-two" />
        <div className="exchange-ribbon exchange-ribbon-three" />
        <div className="exchange-dots" />

        <div className="relative z-10 mx-auto grid min-h-[570px] max-w-[1280px] items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="animate-rise max-w-2xl border-l-2 border-blue-500 pl-6 sm:pl-10">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300">
              Ethiopian capital market intelligence
            </p>
            <h1 className="text-balance text-4xl font-light leading-[1.08] tracking-[-0.035em] sm:text-6xl">
              Compliance decisions built on{" "}
              <span className="font-semibold text-white">verifiable evidence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100/70 sm:text-base">
              Audit prospectuses, test listing requirements, and answer regulatory questions
              against approved ECMA directives and ESX rules.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#platform"
                className="cta-glow flex h-12 items-center justify-center gap-3 bg-blue-600 px-6 text-xs font-bold uppercase tracking-wide transition hover:bg-blue-500"
              >
                Start pre-filing audit <ArrowRight size={15} />
              </a>
              <a
                href="#sample"
                className="flex h-12 items-center justify-center gap-3 border border-blue-300/30 px-6 text-xs font-bold uppercase tracking-wide text-blue-100 transition hover:border-blue-300 hover:bg-blue-900/30"
              >
                View sample analysis
              </a>
            </div>
          </div>

          <div id="sample" className="animate-rise animation-delay-2 relative hidden lg:block">
            <div className="absolute -inset-10 bg-blue-600/10 blur-3xl" />
            <div className="relative ml-auto max-w-2xl border border-blue-800/80 bg-[#06142E]/90 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-blue-900 px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-100/80">
                  <FileSearch size={14} className="text-blue-400" />
                  ABAY INDUSTRIES · DRAFT PROSPECTUS
                </div>
                <span className="bg-blue-500/15 px-2 py-1 text-[9px] font-bold text-blue-300">
                  MAIN MARKET
                </span>
              </div>
              <div className="grid grid-cols-[0.78fr_1.22fr]">
                <div className="border-r border-blue-900 bg-[#081833] p-5">
                  <p className="text-[9px] font-bold tracking-wider text-blue-300">PAGE 42 / 68</p>
                  <div className="mt-4 min-h-72 bg-white p-5 text-[#07142E]">
                    <div className="h-1.5 w-12 bg-[#07142E]" />
                    <p className="mt-5 font-serif text-sm font-bold">8. Share Capital</p>
                    <div className="mt-5 space-y-2">
                      <div className="h-1 w-full bg-slate-200" />
                      <div className="h-1 w-10/12 bg-slate-200" />
                      <div className="h-1 w-11/12 bg-slate-200" />
                    </div>
                    <div className="mt-6 border-l-2 border-blue-600 bg-blue-50 p-3 font-serif text-[9px] leading-5">
                      “The Company&apos;s issued capital is ETB 1,250,000,000…”
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.18em] text-blue-400">LIVE REVIEW</p>
                      <h2 className="mt-2 text-base font-semibold">Listing readiness</h2>
                    </div>
                    <Fingerprint size={18} className="text-blue-400" />
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {auditChecks.map(([title, status, citation]) => (
                      <div key={title} className="border border-blue-900/80 bg-blue-950/20 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid size-5 place-items-center ${status === "MET" ? "bg-blue-500/20 text-blue-300" : "bg-sky-200/10 text-sky-300"}`}>
                              {status === "MET" ? <Check size={12} strokeWidth={3} /> : "!"}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-50">{title}</span>
                          </div>
                          <span className="text-[8px] font-black text-blue-300">{status}</span>
                        </div>
                        <p className="mt-2 pl-7 text-[8px] text-blue-200/50">{citation}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-blue-900 pt-4">
                    <span className="text-[10px] text-blue-200/60">42 of 48 evaluated</span>
                    <span className="text-[10px] font-bold text-blue-300">VIEW REPORT →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-blue-100 bg-[#F5F8FD] dark:border-blue-950 dark:bg-[#08101E]">
        <div className="mx-auto grid max-w-[1280px] sm:grid-cols-3">
          {[
            [ShieldCheck, "Official-source grounded", "Approved ECMA & ESX corpus"],
            [LockKeyhole, "Institutional security", "Controlled document processing"],
            [Fingerprint, "Auditable by design", "Evidence, rules, and run versions"],
          ].map(([Icon, title, subtitle], index) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div
                key={title as string}
                className={`flex items-center gap-4 px-6 py-5 ${index > 0 ? "border-t border-blue-100 sm:border-l sm:border-t-0 dark:border-blue-950" : ""}`}
              >
                <ItemIcon size={20} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-[#07142E] dark:text-white">{title as string}</p>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-blue-200/50">{subtitle as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="platform" className="scroll-mt-20 bg-white py-20 dark:bg-[#050914] lg:py-28">
        <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 border-b border-blue-100 pb-8 sm:flex-row sm:items-end dark:border-blue-950">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Platform overview
              </p>
              <h2 className="mt-3 text-3xl font-light tracking-[-0.03em] sm:text-4xl">
                One controlled workflow.{" "}
                <span className="font-semibold">Four critical capabilities.</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-6 text-slate-500 dark:text-blue-100/50">
              Deterministic checks and source-grounded AI for issuers, advisers, and compliance teams.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-y border-blue-100 dark:border-blue-950">
              {modules.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveModule(index)}
                  className={`flex w-full items-center justify-between border-b border-blue-100 px-4 py-5 text-left text-sm font-semibold transition last:border-b-0 dark:border-blue-950 ${
                    activeModule === index
                      ? "border-l-2 border-l-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200"
                      : "text-slate-600 hover:bg-slate-50 dark:text-blue-100/60 dark:hover:bg-blue-950/20"
                  }`}
                >
                  {item.label}
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>

            <div className="module-panel relative min-h-80 overflow-hidden bg-[#061B49] p-8 text-white sm:p-10">
              <div className="module-grid absolute inset-0 opacity-40" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center border border-blue-400/40 text-blue-300">
                    <ActiveIcon size={23} />
                  </span>
                  <span className="font-mono text-[10px] text-blue-300">0{activeModule + 1} / 04</span>
                </div>
                <div className="mt-12">
                  <h3 className="max-w-xl text-2xl font-light tracking-tight sm:text-3xl">{active.title}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/65">{active.copy}</p>
                  <div className="mt-8 flex items-end gap-3 border-t border-blue-800 pt-5">
                    <span className="text-2xl font-semibold text-blue-300">{active.metric}</span>
                    <span className="pb-1 text-[10px] uppercase tracking-wider text-blue-200/50">{active.metricLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-[#F2F6FC] py-20 dark:bg-[#08101E] lg:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Designed for market participants
            </p>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight">
              Clarity for every step before filing.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-blue-100/55">
              EthioBerg separates evidence, calculation, and professional judgment so teams can move faster without hiding uncertainty.
            </p>
          </div>
          <div className="grid gap-px bg-blue-200 dark:bg-blue-950 sm:grid-cols-2">
            {[
              ["01", "Issuer teams", "Understand requirements and missing evidence before adviser review."],
              ["02", "Listing advisers", "Run repeatable, source-linked checks across every engagement."],
              ["03", "Compliance officers", "Review disclosures and explain attention signals with evidence."],
              ["04", "Market educators", "Present verified company information without investment advice."],
            ].map(([number, title, copy]) => (
              <article key={number} className="group bg-white p-7 transition hover:bg-blue-50 dark:bg-[#07101F] dark:hover:bg-blue-950/40">
                <p className="font-mono text-[10px] text-blue-500">{number}</p>
                <h3 className="mt-8 text-base font-bold">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-blue-100/50">{copy}</p>
                <ArrowRight size={15} className="mt-6 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-400" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="bg-[#061B49] px-5 py-16 text-white">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Institutional pilot</p>
            <h2 className="mt-3 text-2xl font-light sm:text-3xl">Make your next filing review-ready.</h2>
          </div>
          <a
            href="mailto:access@ethioberg.com"
            className="cta-glow flex h-12 items-center gap-3 bg-blue-600 px-6 text-xs font-bold uppercase tracking-wide hover:bg-blue-500"
          >
            Request access <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <footer className="bg-[#020A1B] px-5 py-10 text-blue-100/55">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <Wordmark />
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-semibold">
              <a href="#platform" className="hover:text-white">Platform</a>
              <a href="https://ecma.gov.et/" className="hover:text-white">ECMA</a>
              <a href="https://esx.et/" className="hover:text-white">ESX</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-3 border-t border-blue-950 pt-6 text-[9px] sm:flex-row sm:justify-between">
            <p>© 2026 EthioBerg. All rights reserved.</p>
            <p>Decision-support only — not regulatory approval, legal advice, or investment advice.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
