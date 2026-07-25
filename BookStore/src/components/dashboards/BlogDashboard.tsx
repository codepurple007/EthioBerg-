"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  Heart,
  Eye,
  ChevronDown,
  MoreVertical,
  Send,
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
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
  { label: "Followers", value: "17.6k", icon: Users, iconBg: "#e2e5ed", iconColor: COLORS.primary },
  { label: "Total Post", value: "149", icon: FileText, iconBg: "#daf4f0", iconColor: COLORS.success },
  { label: "Likes", value: "24.8k", icon: Heart, iconBg: "#fde8e4", iconColor: COLORS.danger },
  { label: "Views", value: "54.3k", icon: Eye, iconBg: "#fef4e4", iconColor: COLORS.warning },
];

const visitorsData = [
  { day: "Mon", visitors: 120, unique: 80 },
  { day: "Tue", visitors: 150, unique: 95 },
  { day: "Wed", visitors: 180, unique: 110 },
  { day: "Thu", visitors: 140, unique: 90 },
  { day: "Fri", visitors: 200, unique: 130 },
  { day: "Sat", visitors: 250, unique: 160 },
  { day: "Sun", visitors: 220, unique: 145 },
];

const socialShares = [
  { name: "Facebook", value: "32k", color: "#405189", Icon: Share2 },
  { name: "Google", value: "13k", color: "#f06548", Icon: Globe },
  { name: "WhatsApp", value: "11k", color: "#0ab39c", Icon: MessageCircle },
  { name: "Invision", value: "19k", color: "#f7b84b", Icon: Eye },
  { name: "Instagram", value: "18k", color: "#e1306c", Icon: Heart },
  { name: "Telegram", value: "26k", color: "#299cdb", Icon: Send },
  { name: "YouTube", value: "9k", color: "#ff0000", Icon: Eye },
];

const comments = [
  {
    name: "Diana Kohler",
    text: "Really well-written and informative. The emotional connection strategy is something I’ll be testing out more!",
    color: "#405189",
  },
  {
    name: "Tonya Noble",
    text: "Incredibly helpful tips, especially about adding a call to action. I’ve been missing that step and will implement it in my next post!",
    color: "#0ab39c",
  },
  {
    name: "Donald Palmer",
    text: "Fantastic read! The power of visuals and trends really stood out to me. Thanks for sharing these useful insights!",
    color: "#f7b84b",
  },
  {
    name: "Joseph Parker",
    text: "Great post! Simple yet powerful tips that I can start using immediately. Thanks for sharing your expertise!",
    color: "#299cdb",
  },
  {
    name: "Timothy Smith",
    text: "Wow, this has opened my eyes to a new perspective on creating content. Emotional triggers—such a smart way to engage users!",
    color: "#f06548",
  },
  {
    name: "Alexis Clarke",
    text: "Fantastic read! The power of visuals and trends really stood out to me. Thanks for sharing these useful insights!",
    color: "#6559cc",
  },
  {
    name: "Thomas Taylor",
    text: "Loved the section on visual storytelling. It’s true that images speak louder on social media platforms.",
    color: "#0ab39c",
  },
];

const articles = [
  {
    no: "01",
    title: "The Evolution of Minimalism in Design",
    date: "20 Sep, 2024",
    category: "MinimalDesign",
    comment: 23,
    like: 157,
    shared: 11,
    viewers: 2149,
  },
  {
    no: "02",
    title: "Mastering User Experience Through Storytelling",
    date: "11 Feb, 2024",
    category: "UXDesign",
    comment: 547,
    like: 1458,
    shared: 317,
    viewers: 34978,
  },
  {
    no: "03",
    title: "Designing for Purpose: A Mindful Approach",
    date: "15 Sep, 2024",
    category: "CreativeProcess",
    comment: 88,
    like: 649,
    shared: 237,
    viewers: 1982,
  },
  {
    no: "04",
    title: "How to Overcome Creative Block",
    date: "09 July, 2024",
    category: "CreativeBlock",
    comment: 67,
    like: 1114,
    shared: 1547,
    viewers: 15747,
  },
  {
    no: "05",
    title: "Building Brand Identity through Design",
    date: "19 Nov, 2024",
    category: "BrandDesign",
    comment: 8,
    like: 10,
    shared: 7,
    viewers: 110,
  },
];

const deviceData = [
  { name: "Desktop", value: 48, color: COLORS.primary },
  { name: "Mobile", value: 34, color: COLORS.success },
  { name: "Tablet", value: 12, color: COLORS.warning },
  { name: "Others", value: 6, color: COLORS.info },
];

function SortSelect({
  label,
  options,
  value,
}: {
  label: string;
  options: string[];
  value: string;
}) {
  return (
    <div className="relative inline-flex items-center gap-1 text-[12px] text-[#878a99]">
      {label ? <span>{label}</span> : null}
      <select
        defaultValue={value}
        className="cursor-pointer appearance-none border-0 bg-transparent pr-4 font-medium text-[#405189] outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#878a99]"
      />
    </div>
  );
}

export default function BlogDashboard() {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  return (
    <div>
      {/* KPIs */}
      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded"
                    style={{ background: kpi.iconBg }}
                  >
                    <Icon size={22} style={{ color: kpi.iconColor }} />
                  </div>
                  <div>
                    <h4 className="m-0 text-[22px] font-semibold text-[#495057]">
                      {kpi.value}
                    </h4>
                    <p className="m-0 text-[13px] text-[#878a99]">{kpi.label}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Site Visitors + Social Shares */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Site Visitors</h5>
              <SortSelect
                label="Sort by:"
                value="Current Week"
                options={["Today", "Last Week", "Last Month", "Current Year", "Current Week"]}
              />
            </div>
            <div className="card-body">
              <ChartContainer className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={visitorsData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="blogVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="blogUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="day" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="visitors" name="Visitors" stroke={COLORS.primary} strokeWidth={2} fill="url(#blogVisitors)" />
                    <Area type="monotone" dataKey="unique" name="Unique" stroke={COLORS.success} strokeWidth={2} fill="url(#blogUnique)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Top Social Media Shares</h5>
              <SortSelect
                label=""
                value="Today"
                options={["Today", "Last Week", "Last Month", "Current Year"]}
              />
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {socialShares.map((s) => {
                  const Icon = s.Icon;
                  return (
                    <li
                      key={s.name}
                      className="flex items-center justify-between border-b border-[#e9ebec] py-2.5 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded"
                          style={{ background: `${s.color}18`, color: s.color }}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="text-[13px] font-medium text-[#495057]">{s.name}</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#495057]">{s.value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comments + Articles */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Comment</h5>
              <a href="#" className="text-[12px] font-medium text-[#405189] no-underline hover:underline">
                View All
              </a>
            </div>
            <div className="card-body max-h-[480px] overflow-y-auto !pt-2">
              <ul className="m-0 list-none space-y-0 p-0">
                {comments.map((c) => (
                  <li key={c.name} className="border-b border-[#e9ebec] py-3 last:border-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ background: c.color }}
                      >
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <p className="m-0 text-[13px] font-medium text-[#495057]">
                        {c.name}{" "}
                        <span className="font-normal text-[#878a99]">Has commented</span>
                      </p>
                    </div>
                    <p className="m-0 mb-2 text-[12px] leading-relaxed text-[#878a99]">
                      &quot;{c.text}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setLikedComments((prev) => ({
                          ...prev,
                          [c.name]: !prev[c.name],
                        }))
                      }
                      className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[11px] text-[#878a99] hover:text-[#f06548]"
                    >
                      <Heart
                        size={12}
                        className={
                          likedComments[c.name]
                            ? "fill-[#f06548] text-[#f06548]"
                            : ""
                        }
                      />
                      {likedComments[c.name] ? "Liked" : "Like"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Recent Article</h5>
              <SortSelect
                label="Sort by:"
                value="Popular"
                options={["Popular", "Newest", "Oldest"]}
              />
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">No</th>
                      <th className="px-3 py-3 font-medium">Blog Title</th>
                      <th className="px-3 py-3 font-medium">Post Date</th>
                      <th className="px-3 py-3 font-medium">Category</th>
                      <th className="px-3 py-3 font-medium">Comment</th>
                      <th className="px-3 py-3 font-medium">Like</th>
                      <th className="px-3 py-3 font-medium">Shared</th>
                      <th className="px-5 py-3 font-medium">Viewers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((a) => (
                      <tr key={a.no} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3 font-medium text-[#878a99]">{a.no}</td>
                        <td className="px-3 py-3 font-medium text-[#405189]">{a.title}</td>
                        <td className="px-3 py-3 text-[#878a99]">{a.date}</td>
                        <td className="px-3 py-3">
                          <span className="rounded bg-[#e2e5ed] px-2 py-0.5 text-[11px] font-medium text-[#405189]">
                            {a.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#495057]">{a.comment}</td>
                        <td className="px-3 py-3 text-[#495057]">{a.like}</td>
                        <td className="px-3 py-3 text-[#495057]">{a.shared}</td>
                        <td className="px-5 py-3 font-medium text-[#495057]">{a.viewers.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-0 px-5 py-3 text-center text-[12px] text-[#878a99]">
                Showing <span className="font-semibold text-[#495057]">5</span> of{" "}
                <span className="font-semibold text-[#495057]">14</span> Results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Author + Used Device */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-body text-center">
              <div className="mb-3 flex justify-end">
                <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                  <MoreVertical size={16} />
                </button>
              </div>
              <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#405189] text-[18px] font-semibold text-white">
                AA
              </span>
              <h5 className="m-0 mb-0.5 text-[16px] font-semibold text-[#495057]">Anna Adame</h5>
              <p className="m-0 mb-4 text-[13px] text-[#878a99]">Founder</p>
              <div className="grid grid-cols-3 gap-2 border-t border-[#e9ebec] pt-4">
                {[
                  { label: "Total Post", value: "26" },
                  { label: "Subscribes", value: "17k" },
                  { label: "Viewers", value: "487k" },
                ].map((s) => (
                  <div key={s.label}>
                    <h5 className="m-0 text-[16px] font-semibold text-[#495057]">{s.value}</h5>
                    <p className="m-0 text-[11px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Used Device</h5>
              <SortSelect
                label=""
                value="Today"
                options={["Today", "Last Week", "Last Month", "Current Year"]}
              />
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChartContainer className="h-[240px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                      >
                        {deviceData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                      <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartContainer className="h-[240px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart
                      data={deviceData}
                      layout="vertical"
                      margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.border} />
                      <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                      <Bar dataKey="value" name="%" radius={[0, 3, 3, 0]} barSize={16}>
                        {deviceData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
