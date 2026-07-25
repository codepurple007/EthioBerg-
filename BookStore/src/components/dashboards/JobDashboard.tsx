"use client";

import { useState } from "react";
import {
  Briefcase,
  FileCheck,
  Sparkles,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Star,
  MapPin,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import ChartContainer from "@/components/dashboard/ChartContainer";

const COLORS = {
  primary: "#405189",
  success: "#0ab39c",
  warning: "#f7b84b",
  danger: "#f06548",
  info: "#299cdb",
  muted: "#878a99",
  border: "#e9ebec",
};

const kpis = [
  { label: "Total Jobs", value: "36,872", icon: Briefcase, iconBg: "#e2e5ed", iconColor: COLORS.primary },
  { label: "Apply Jobs", value: "28,451", icon: FileCheck, iconBg: "#daf4f0", iconColor: COLORS.success },
  { label: "New Jobs", value: "4,034", icon: Sparkles, iconBg: "#e1f0fa", iconColor: COLORS.info },
  { label: "Interview", value: "5,000", icon: Users, iconBg: "#fef4e4", iconColor: COLORS.warning },
  { label: "Hired", value: "3,948", icon: UserCheck, iconBg: "#daf4f0", iconColor: COLORS.success },
  { label: "Rejected", value: "2,403", icon: UserX, iconBg: "#fde8e4", iconColor: COLORS.danger },
];

const companies = [
  { name: "Force Medicines", location: "Cullera, Spain", color: "#405189" },
  { name: "Syntyce Solutions", location: "Mughairah, UAE", color: "#0ab39c" },
  { name: "Moetic Fashion", location: "Mughairah, UAE", color: "#f7b84b" },
  { name: "Meta4Systems", location: "Germany", color: "#299cdb" },
  { name: "Themesbrand", location: "Limestone, US", color: "#f06548" },
];

const statsData = [
  { month: "Jan", applications: 40, interview: 18, hired: 12 },
  { month: "Feb", applications: 48, interview: 22, hired: 15 },
  { month: "Mar", applications: 42, interview: 20, hired: 14 },
  { month: "Apr", applications: 55, interview: 28, hired: 18 },
  { month: "May", applications: 62, interview: 32, hired: 22 },
  { month: "Jun", applications: 58, interview: 30, hired: 20 },
  { month: "Jul", applications: 70, interview: 35, hired: 25 },
  { month: "Aug", applications: 65, interview: 33, hired: 24 },
  { month: "Sep", applications: 75, interview: 40, hired: 28 },
  { month: "Oct", applications: 80, interview: 42, hired: 30 },
  { month: "Nov", applications: 72, interview: 38, hired: 26 },
  { month: "Dec", applications: 88, interview: 48, hired: 35 },
];

const candidates = [
  { name: "Tonya Noble", handle: "@tonya", color: "#405189", following: false },
  { name: "Nicholas Ball", handle: "@nicholas", color: "#0ab39c", following: true },
  { name: "Zynthia Marrow", handle: "@zynthia", color: "#f7b84b", following: false },
  { name: "Cheryl Moore", handle: "@Cheryl", color: "#299cdb", following: false },
  { name: "Jennifer Bailey", handle: "@Jennifer", color: "#f06548", following: true },
  { name: "Hadley Leonard", handle: "@hadley", color: "#6559cc", following: false },
];

const recommendedJobs = [
  { title: "Marketing Director", company: "Themesbrand", type: "Full Time", salary: "$20k - $25k", location: "California, US" },
  { title: "UI / UX Designer", company: "Digitech Galaxy", type: "Part Time", salary: "$12k - $15k", location: "Germany" },
  { title: "Product Sales Specialist", company: "Meta4Systems", type: "Freelance", salary: "$10k - $15k", location: "Limestone, US" },
  { title: "Project Manager", company: "Syntyce Solutions", type: "Full Time", salary: "$25k - $30k", location: "Cullera, Spain" },
];

const applicants = [
  { id: "#VZ2112", name: "Nicholas Ball", designation: "Assistant / Store Keeper", rate: "$109.00", location: "California, US", type: "Full Time", rating: "5.0", votes: "245" },
  { id: "#VZ2111", name: "Elizabeth Allen", designation: "Education Training", rate: "$149.00", location: "Zuweihir, UAE", type: "Freelancer", rating: "4.5", votes: "645" },
  { id: "#VZ2109", name: "Cassian Jenning", designation: "Graphic Designer", rate: "$215.00", location: "Limestone, US", type: "Part Time", rating: "4.9", votes: "89" },
  { id: "#VZ2108", name: "Scott Holt", designation: "UI/UX Designer", rate: "$199.00", location: "Germany", type: "Part Time", rating: "4.3", votes: "47" },
  { id: "#VZ2107", name: "Hadley Leonard", designation: "React Developer", rate: "$330.00", location: "Mughairah, UAE", type: "Full Time", rating: "4.7", votes: "161" },
  { id: "#VZ2110", name: "Harley Watkins", designation: "Project Manager", rate: "$330.00", location: "Texanna, US", type: "Freelancer", rating: "4.7", votes: "3.21k" },
  { id: "#VZ2113", name: "Nadia Harding", designation: "Web Designer", rate: "$330.00", location: "Pahoa, US", type: "Part Time", rating: "4.7", votes: "2.93k" },
  { id: "#VZ2114", name: "Jenson Carlson", designation: "Product Director", rate: "$330.00", location: "Pahoa, US", type: "Full Time", rating: "4.7", votes: "4.31k" },
];

const locations = [
  { name: "Canada", pct: 75, color: COLORS.primary },
  { name: "Greenland", pct: 47, color: COLORS.success },
  { name: "Russia", pct: 82, color: COLORS.warning },
];

const typeBadge: Record<string, string> = {
  "Full Time": "bg-[#daf4f0] text-[#0ab39c]",
  "Part Time": "bg-[#e1f0fa] text-[#299cdb]",
  Freelancer: "bg-[#fef4e4] text-[#f7b84b]",
  Freelance: "bg-[#fef4e4] text-[#f7b84b]",
};

const statsTabs = ["ALL", "1M", "6M", "1Y"] as const;

export default function JobDashboard() {
  const [statsTab, setStatsTab] = useState<(typeof statsTabs)[number]>("ALL");
  const [following, setFollowing] = useState<Record<string, boolean>>(
    Object.fromEntries(candidates.map((c) => [c.handle, c.following])),
  );

  return (
    <div>
      {/* KPIs */}
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className="card-body text-center">
                <div
                  className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded"
                  style={{ background: kpi.iconBg }}
                >
                  <Icon size={20} style={{ color: kpi.iconColor }} />
                </div>
                <h4 className="m-0 mb-0.5 text-[18px] font-semibold text-[#495057]">{kpi.value}</h4>
                <p className="m-0 text-[12px] text-[#878a99]">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Companies + Applications Statistic */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Featured Companies</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">
                View All Companies
              </a>
            </div>
            <div className="card-body !p-0">
              <ul className="m-0 list-none p-0">
                {companies.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between gap-2 border-b border-[#e9ebec] px-5 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded text-[12px] font-bold text-white"
                        style={{ background: c.color }}
                      >
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{c.name}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#878a99]">
                          <MapPin size={10} /> {c.location}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[11px] font-medium text-[#405189] hover:bg-[#f3f6f9]">
                      View More
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mb-0 px-5 py-3 text-center text-[12px] text-[#878a99]">
                Showing <span className="font-semibold text-[#495057]">5</span> of{" "}
                <span className="font-semibold text-[#495057]">25</span> Results
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Applications Statistic</h5>
              <div className="flex gap-1">
                {statsTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatsTab(tab)}
                    className={`cursor-pointer rounded border-0 px-2.5 py-1 text-[12px] font-medium ${
                      statsTab === tab
                        ? "bg-[#405189] text-white"
                        : "bg-[#f3f6f9] text-[#878a99] hover:text-[#405189]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New Applications", value: "4,857" },
                  { label: "Interview", value: "1,902" },
                  { label: "Hired", value: "680" },
                  { label: "Total Applications", value: "34.5k" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <h5 className="m-0 text-[16px] font-semibold text-[#495057]">{s.value}</h5>
                    <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
              <ChartContainer className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={statsData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="applications" name="Applications" fill={COLORS.primary} radius={[3, 3, 0, 0]} barSize={10} />
                    <Bar dataKey="interview" name="Interview" fill={COLORS.warning} radius={[3, 3, 0, 0]} barSize={10} />
                    <Bar dataKey="hired" name="Hired" fill={COLORS.success} radius={[3, 3, 0, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Candidates + Invite + Recommended */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Popular Candidates</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">View All</a>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-3 p-0">
                {candidates.map((c) => (
                  <li key={c.handle} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ background: c.color }}
                      >
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#495057]">{c.name}</p>
                        <span className="text-[11px] text-[#878a99]">{c.handle}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFollowing((prev) => ({
                          ...prev,
                          [c.handle]: !prev[c.handle],
                        }))
                      }
                      className={`cursor-pointer rounded border-0 px-2 py-1 text-[11px] font-medium ${
                        following[c.handle]
                          ? "bg-[#f3f6f9] text-[#878a99]"
                          : "bg-[#405189] text-white"
                      }`}
                    >
                      {following[c.handle] ? "Unfollow" : "Follow"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="card h-full overflow-hidden">
            <div className="card-body flex h-full flex-col justify-center bg-gradient-to-br from-[#405189] to-[#5b6ca8] text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <UserPlus size={22} />
              </div>
              <h5 className="m-0 mb-2 text-[16px] font-semibold">Invite your friends to Velzon</h5>
              <p className="m-0 mb-4 text-[12px] text-white/80">
                Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally.
              </p>
              <button type="button" className="cursor-pointer rounded border-0 bg-white px-4 py-2 text-[13px] font-medium text-[#405189] hover:bg-white/90">
                Invite Friends
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-6">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recommended Jobs</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recommendedJobs.map((j) => (
                  <div key={j.title} className="rounded border border-[#e9ebec] p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h6 className="m-0 text-[14px] font-semibold text-[#495057]">{j.title}</h6>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${typeBadge[j.type]}`}>
                        {j.type}
                      </span>
                    </div>
                    <p className="m-0 mb-1 text-[12px] text-[#878a99]">{j.company}</p>
                    <p className="m-0 mb-1 text-[13px] font-medium text-[#405189]">{j.salary}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#878a99]">
                      <MapPin size={10} /> {j.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Applicants</h5>
              <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189] hover:bg-[#f3f6f9]">
                Generate Report
              </button>
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-3 py-3 font-medium">Candidate Name</th>
                      <th className="px-3 py-3 font-medium">Designation</th>
                      <th className="px-3 py-3 font-medium">Rate/hr</th>
                      <th className="px-3 py-3 font-medium">Location</th>
                      <th className="px-3 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((a) => (
                      <tr key={a.id + a.name} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3 font-medium text-[#405189]">{a.id}</td>
                        <td className="px-3 py-3 text-[#495057]">{a.name}</td>
                        <td className="px-3 py-3 text-[#495057]">{a.designation}</td>
                        <td className="px-3 py-3 font-medium text-[#495057]">{a.rate}</td>
                        <td className="px-3 py-3 text-[#878a99]">{a.location}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${typeBadge[a.type]}`}>
                            {a.type}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1 text-[#495057]">
                            <Star size={12} className="fill-[#f7b84b] text-[#f7b84b]" />
                            {a.rating}
                            <span className="text-[11px] text-[#878a99]">({a.votes})</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Jobs Views Location</h5>
              <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white px-2.5 py-1 text-[12px] text-[#405189]">
                Export Report
              </button>
            </div>
            <div className="card-body">
              <div className="mb-4 flex h-[140px] items-center justify-center rounded bg-[#f3f6f9]">
                <MapPin size={48} className="text-[#405189]/opacity-40" />
              </div>
              <ChartContainer className="mb-3 h-[120px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart
                    data={[
                      { x: 1, v: 30 },
                      { x: 2, v: 45 },
                      { x: 3, v: 35 },
                      { x: 4, v: 55 },
                      { x: 5, v: 50 },
                      { x: 6, v: 70 },
                    ]}
                  >
                    <defs>
                      <linearGradient id="jobViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.info} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={COLORS.info} strokeWidth={2} fill="url(#jobViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ul className="m-0 list-none space-y-3 p-0">
                {locations.map((loc) => (
                  <li key={loc.name}>
                    <div className="mb-1 flex justify-between text-[13px]">
                      <span className="text-[#495057]">{loc.name}</span>
                      <span className="font-medium text-[#495057]">{loc.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9ebec]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${loc.pct}%`, background: loc.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
