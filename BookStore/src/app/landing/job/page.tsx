import Link from "next/link";
import { Briefcase, MapPin, Search, Building2 } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "Job Landing | Velzon",
};

const jobs = [
  { title: "UI/UX Designer", company: "Themesbrand", loc: "Remote", type: "Full Time" },
  { title: "Frontend Developer", company: "SoftTech", loc: "New York", type: "Full Time" },
  { title: "Product Manager", company: "Creative Hub", loc: "California", type: "Contract" },
  { title: "Marketing Lead", company: "Brand Co", loc: "London", type: "Part Time" },
];

export default function JobLandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f3f9]">
      <header className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <AuthBrand />
          <div className="flex items-center gap-3 text-[13px]">
            <Link href="/auth/signin" className="text-[#878a99] no-underline hover:text-[#405189]">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded bg-[#405189] px-3 py-2 font-medium text-white no-underline"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#405189] to-[#3577f1] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="m-0 text-4xl font-bold">Find your dream job</h1>
          <p className="mt-3 mb-8 text-[14px] text-white/80">
            Search thousands of openings across design, engineering, and product.
          </p>
          <form className="flex flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                placeholder="Job title, keywords..."
                className="w-full rounded border-0 py-2.5 pr-3 pl-9 text-[13px] text-[#495057] outline-none"
              />
            </div>
            <div className="relative flex-1">
              <MapPin
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                placeholder="Location"
                className="w-full rounded border-0 py-2.5 pr-3 pl-9 text-[13px] text-[#495057] outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded border-0 bg-[#0ab39c] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
            >
              Find Jobs
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-xl font-semibold text-[#495057]">
            Featured Jobs
          </h2>
          <span className="text-[12px] text-[#878a99]">24 openings this week</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {jobs.map((j) => (
            <div key={j.title} className="card p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-[#e2e5ed] text-[#405189]">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <h5 className="m-0 text-[14px] font-semibold text-[#495057]">
                    {j.title}
                  </h5>
                  <p className="mt-0.5 mb-2 text-[12px] text-[#878a99]">
                    {j.company}
                  </p>
                  <div className="flex flex-wrap gap-3 text-[12px] text-[#878a99]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {j.loc}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={12} /> {j.type}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded border border-[#405189] px-3 py-1.5 text-[12px] font-medium text-[#405189] hover:bg-[#e2e5ed]"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#e9ebec] bg-white py-6 text-center text-[12px] text-[#878a99]">
        © {new Date().getFullYear()} Velzon Jobs. Themesbrand.
      </footer>
    </div>
  );
}
