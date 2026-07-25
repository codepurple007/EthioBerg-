"use client";

import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Globe,
} from "lucide-react";

const activities = [
  {
    time: "Just Now",
    title: "Purchased by James Price",
    desc: "Product Purchase from Nestle Corp.",
  },
  {
    time: "30 min ago",
    title: "New ticket received",
    desc: "#999 system notification from DB",
  },
  {
    time: "2 hours ago",
    title: "Responded to need",
    desc: "Commented on your post with 5 replies",
  },
  {
    time: "Yesterday",
    title: "Invoice created",
    desc: "Invoice #9876 created for Themesbrand",
  },
];

export default function ProfileContent() {
  const [tab, setTab] = useState<"overview" | "activities">("overview");

  return (
    <div>
      <div className="card overflow-hidden">
        <div
          className="h-40 bg-gradient-to-r from-[#405189] via-[#3577f1] to-[#299cdb]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #405189 0%, #3577f1 50%, #299cdb 100%)",
          }}
        />
        <div className="card-body relative pt-0">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#405189] text-2xl font-semibold text-white shadow">
              AA
            </div>
            <div className="mb-2 flex-1">
              <h5 className="m-0 text-[16px] font-semibold text-[#495057]">
                Anna Adame
              </h5>
              <p className="mt-0.5 mb-0 text-[13px] text-[#878a99]">
                Owner & Founder
              </p>
            </div>
            <div className="mb-2 flex gap-4 text-[13px] text-[#878a99]">
              <span className="flex items-center gap-1">
                <Briefcase size={14} /> Themesbrand
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> California, USA
              </span>
            </div>
          </div>

          <div className="mt-5 border-b border-[#e9ebec]">
            <div className="flex gap-1">
              {(
                [
                  ["overview", "Overview"],
                  ["activities", "Activities"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`border-0 border-b-2 bg-transparent px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    tab === key
                      ? "border-[#405189] text-[#405189]"
                      : "border-transparent text-[#878a99] hover:text-[#495057]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tab === "overview" ? (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-1">
            <div className="card-header">
              <h5 className="card-title">About</h5>
            </div>
            <div className="card-body space-y-3 text-[13px]">
              <p className="m-0 text-[#878a99]">
                Hi I&apos;m Anna Adame, It will be as simple as Occidental; in fact, it
                will be Occidental. To an English person, it will seem like simplified
                English.
              </p>
              <div className="flex items-center gap-2 text-[#495057]">
                <Mail size={14} className="text-[#878a99]" />
                anna@themesbrand.com
              </div>
              <div className="flex items-center gap-2 text-[#495057]">
                <Phone size={14} className="text-[#878a99]" />
                +(1) 987 65432
              </div>
              <div className="flex items-center gap-2 text-[#495057]">
                <Globe size={14} className="text-[#878a99]" />
                www.themesbrand.com
              </div>
              <div className="flex items-center gap-2 text-[#495057]">
                <Calendar size={14} className="text-[#878a99]" />
                Joined: 24 Nov 2021
              </div>
            </div>
          </div>
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h5 className="card-title">Overview</h5>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Projects", value: "24" },
                  { label: "Tasks", value: "186" },
                  { label: "Team", value: "12" },
                  { label: "Revenue", value: "$45.8k" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded border border-[#e9ebec] bg-[#f3f3f9] p-4 text-center"
                  >
                    <h4 className="m-0 text-xl font-semibold text-[#405189]">
                      {s.value}
                    </h4>
                    <p className="mt-1 mb-0 text-[12px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 mb-0 text-[13px] leading-relaxed text-[#878a99]">
                Anna has 8+ years of experience in UI/UX design and product
                management. She thrives on building clean admin experiences and
                mentoring design teams.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title">Activities</h5>
          </div>
          <div className="card-body">
            <ul className="m-0 list-none space-y-4 p-0">
              {activities.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#405189]" />
                  <div>
                    <p className="m-0 text-[13px] font-medium text-[#495057]">
                      {a.title}
                    </p>
                    <p className="mt-0.5 mb-0 text-[12px] text-[#878a99]">{a.desc}</p>
                    <p className="mt-1 mb-0 text-[11px] text-[#878a99]">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
