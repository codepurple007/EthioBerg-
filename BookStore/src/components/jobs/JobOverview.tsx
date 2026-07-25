"use client";
import Link from "next/link";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";

export default function JobOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <div className="card">
          <div className="card-body">
            <div className="mb-4 flex flex-wrap items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded bg-[#405189] text-[16px] font-bold text-white">TB</div>
              <div>
                <h4 className="m-0 text-[20px] font-semibold text-[#495057]">Business Associate</h4>
                <p className="mt-1 mb-0 text-[13px] text-[#878a99]">Themesbrand · California, USA</p>
                <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-[#878a99]">
                  <span className="inline-flex items-center gap-1"><Briefcase size={12} /> Full Time</span>
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> Experience: 2-5 years</span>
                  <span className="inline-flex items-center gap-1"><DollarSign size={12} /> $40k - $60k</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> On-site</span>
                </div>
              </div>
            </div>
            <h5 className="mb-2 text-[14px] font-semibold">Job Description</h5>
            <p className="text-[13px] leading-relaxed text-[#878a99]">
              We are looking for a Business Associate to support our sales and client success teams. You will manage accounts, prepare reports, and collaborate across departments.
            </p>
            <h5 className="mb-2 text-[14px] font-semibold">Responsibilities</h5>
            <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-[#878a99]">
              <li>Coordinate with clients and internal stakeholders</li>
              <li>Prepare weekly performance reports</li>
              <li>Support marketing campaigns and events</li>
              <li>Maintain CRM records and follow-ups</li>
            </ul>
            <h5 className="mt-4 mb-2 text-[14px] font-semibold">Requirements</h5>
            <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-[#878a99]">
              <li>Bachelor&apos;s degree in Business or related field</li>
              <li>2+ years experience in business development</li>
              <li>Strong communication and Excel skills</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Job Overview</h5></div>
          <div className="card-body space-y-3 text-[13px]">
            {[
              ["Job ID", "#JB001"],
              ["Job Type", "Full Time"],
              ["Category", "Business"],
              ["Experience", "2-5 Years"],
              ["Location", "California"],
              ["Salary", "$40k - $60k"],
              ["Posted", "02 Dec, 2021"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#e9ebec] pb-2 last:border-0">
                <span className="text-[#878a99]">{k}</span>
                <span className="font-medium text-[#495057]">{v}</span>
              </div>
            ))}
            <Link href="/apps/jobs/application" className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white no-underline hover:bg-[#099885]">Apply Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
