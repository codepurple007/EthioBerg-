"use client";

import { useState } from "react";
import {
  Briefcase,
  UserPlus,
  Clock,
  MoreVertical,
  ChevronDown,
  Send,
  Settings,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
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
  {
    label: "Active Projects",
    value: "825",
    change: "5.02 %",
    sub: "Projects this month",
    icon: Briefcase,
    iconBg: "#e2e5ed",
    iconColor: COLORS.primary,
  },
  {
    label: "New Leads",
    value: "7,522",
    change: "3.58 %",
    sub: "Leads this month",
    icon: UserPlus,
    iconBg: "#daf4f0",
    iconColor: COLORS.success,
  },
  {
    label: "Total Hours",
    value: "168h 40m",
    change: "10.35 %",
    sub: "Work this month",
    icon: Clock,
    iconBg: "#fef4e4",
    iconColor: COLORS.warning,
  },
];

const overviewData = [
  { month: "Jan", projects: 12, active: 8, hours: 120 },
  { month: "Feb", projects: 18, active: 10, hours: 140 },
  { month: "Mar", projects: 15, active: 12, hours: 110 },
  { month: "Apr", projects: 22, active: 14, hours: 160 },
  { month: "May", projects: 28, active: 16, hours: 180 },
  { month: "Jun", projects: 24, active: 15, hours: 170 },
  { month: "Jul", projects: 30, active: 18, hours: 200 },
  { month: "Aug", projects: 26, active: 17, hours: 190 },
  { month: "Sep", projects: 32, active: 20, hours: 210 },
  { month: "Oct", projects: 35, active: 22, hours: 230 },
  { month: "Nov", projects: 30, active: 19, hours: 200 },
  { month: "Dec", projects: 38, active: 24, hours: 250 },
];

const schedules = [
  { day: "09", title: "Development planning", company: "iTest Factory", time: "9:20 am" },
  { day: "12", title: "Design new UI and check sales", company: "Meta4Systems", time: "11:30 am" },
  { day: "25", title: "Weekly catch-up", company: "Nesta Technologies", time: "02:00 pm" },
  { day: "27", title: "James Bangs (Client) Meeting", company: "Nesta Technologies", time: "03:45 pm" },
];

const projects = [
  { name: "Chat App Update", company: "Nesta Technologies", progress: 54, status: "Inprogress" as const, deadline: "05 Jan, 2022", members: 3 },
  { name: "ABC Project Customization", company: "Nesta Technologies", progress: 65, status: "Progress" as const, deadline: "12 Oct, 2021", members: 5 },
  { name: "Client - James", company: "Themesbrand", progress: 78, status: "Inprogress" as const, deadline: "21 Dec, 2021", members: 4 },
  { name: "Brand Logo Design", company: "Meta4Systems", progress: 34, status: "Pending" as const, deadline: "15 Oct, 2021", members: 2 },
  { name: "Chat App", company: "Syntyce Solutions", progress: 90, status: "Completed" as const, deadline: "01 Dec, 2021", members: 6 },
];

const tasks = [
  { name: "Create new Admin Template", deadline: "03 Nov 2021", status: "Completed" as const, assignee: "DR", color: "#405189" },
  { name: "Marketing Coordinator", deadline: "17 Nov 2021", status: "Progress" as const, assignee: "JB", color: "#0ab39c" },
  { name: "Administrative Analyst", deadline: "26 Nov 2021", status: "Completed" as const, assignee: "CA", color: "#f7b84b" },
  { name: "E-commerce Landing Page", deadline: "10 Dec 2021", status: "Pending" as const, assignee: "WP", color: "#299cdb" },
  { name: "UI/UX Design", deadline: "22 Dec 2021", status: "Progress" as const, assignee: "GF", color: "#f06548" },
  { name: "Projects Design", deadline: "31 Dec 2021", status: "Pending" as const, assignee: "SD", color: "#6559cc" },
];

const members = [
  { name: "Donald Risher", role: "Product Manager", hours: "110h : 150h", tasks: 258, pct: 73 },
  { name: "Jansh Brown", role: "Lead Developer", hours: "83h : 150h", tasks: 105, pct: 55 },
  { name: "Carroll Adams", role: "Lead Designer", hours: "58h : 150h", tasks: 75, pct: 39 },
  { name: "William Pinto", role: "UI/UX Designer", hours: "96h : 150h", tasks: 85, pct: 64 },
  { name: "Garry Fournier", role: "Web Designer", hours: "76h : 150h", tasks: 69, pct: 51 },
  { name: "Susan Denton", role: "Lead Designer", hours: "123h : 150h", tasks: 658, pct: 82 },
  { name: "Joseph Jackson", role: "React Developer", hours: "117h : 150h", tasks: 125, pct: 78 },
];

const statusData = [
  { name: "Completed", value: 125, hours: "15,870hrs", color: COLORS.success },
  { name: "In Progress", value: 42, hours: "243hrs", color: COLORS.warning },
  { name: "Yet to Start", value: 58, hours: "~2,050hrs", color: COLORS.info },
  { name: "Cancelled", value: 89, hours: "~900hrs", color: COLORS.danger },
];

const chatMessages = [
  { from: "me", text: "Good morning 😊", time: "09:07 am" },
  { from: "them", text: "Good morning, How are you? What about our next meeting?", time: "09:08 am" },
  { from: "me", text: "Yeah everything is fine. Our next meeting tomorrow at 10.00 AM", time: "09:10 am" },
  { from: "them", text: "Hey, I'm going to meet a friend of mine at the department store. I have to buy some presents for my parents 🎁.", time: "09:12 am" },
  { from: "me", text: "Wow that's great", time: "09:30 am" },
];

const overviewTabs = ["ALL", "1M", "6M", "1Y"] as const;
const taskFilters = ["All Tasks", "Completed", "Inprogress", "Pending"] as const;

const projectStatusBadge = {
  Inprogress: "bg-[#e1f0fa] text-[#299cdb]",
  Progress: "bg-[#fef4e4] text-[#f7b84b]",
  Pending: "bg-[#fde8e4] text-[#f06548]",
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
};

const taskStatusBadge = {
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
  Progress: "bg-[#fef4e4] text-[#f7b84b]",
  Pending: "bg-[#fde8e4] text-[#f06548]",
};

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

export default function ProjectsDashboard() {
  const [overviewTab, setOverviewTab] =
    useState<(typeof overviewTabs)[number]>("ALL");
  const [taskFilter, setTaskFilter] =
    useState<(typeof taskFilters)[number]>("All Tasks");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);

  const filteredTasks =
    taskFilter === "All Tasks"
      ? tasks
      : tasks.filter((t) =>
          taskFilter === "Inprogress"
            ? t.status === "Progress"
            : t.status === taskFilter,
        );

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "me", text: chatInput.trim(), time: "Just now" },
    ]);
    setChatInput("");
  };

  return (
    <div>
      {/* KPIs */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-[13px] text-[#878a99]">{kpi.label}</p>
                    <h4 className="m-0 text-[22px] font-semibold text-[#495057]">
                      {kpi.value}
                    </h4>
                    <p className="m-0 text-[12px]">
                      <span className="font-medium text-[#0ab39c]">{kpi.change}</span>{" "}
                      <span className="text-[#878a99]">{kpi.sub}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview + Schedules */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Projects Overview</h5>
              <div className="flex gap-1">
                {overviewTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setOverviewTab(tab)}
                    className={`cursor-pointer rounded border-0 px-2.5 py-1 text-[12px] font-medium ${
                      overviewTab === tab
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
                  { label: "Number of Projects", value: "165" },
                  { label: "Active Projects", value: "5" },
                  { label: "Revenue", value: "$25k" },
                  { label: "Working Hours", value: "285h" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <h5 className="m-0 text-[16px] font-semibold text-[#495057]">{s.value}</h5>
                    <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                  </div>
                ))}
              </div>
              <ChartContainer className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={overviewData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="projFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="projects" name="Projects" stroke={COLORS.primary} strokeWidth={2} fill="url(#projFill)" />
                    <Area type="monotone" dataKey="active" name="Active" stroke={COLORS.success} strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Upcoming Schedules</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="More">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body">
              <p className="m-0 mb-3 text-[12px] font-semibold text-[#878a99]">Events:</p>
              <ul className="m-0 list-none space-y-0 p-0">
                {schedules.map((s) => (
                  <li key={s.title} className="flex gap-3 border-b border-[#e9ebec] py-3 last:border-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#f3f6f9] text-[15px] font-semibold text-[#405189]">
                      {s.day}
                    </div>
                    <div className="min-w-0">
                      <p className="m-0 mb-0.5 text-[13px] font-medium text-[#495057]">{s.title}</p>
                      <p className="m-0 text-[12px] text-[#878a99]">{s.company}</p>
                      <span className="text-[11px] text-[#878a99]">{s.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects + My Tasks */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Active Projects</h5>
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Project Name</th>
                      <th className="px-3 py-3 font-medium">Progress</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.name} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3">
                          <p className="m-0 font-medium text-[#405189]">{p.name}</p>
                          <span className="text-[11px] text-[#878a99]">{p.company}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e9ebec]">
                              <div
                                className="h-full rounded-full bg-[#405189]"
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                            <span className="text-[#495057]">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${projectStatusBadge[p.status]}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#495057]">{p.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-0 px-5 py-3 text-center text-[12px] text-[#878a99]">
                Showing <span className="font-semibold text-[#495057]">5</span> of{" "}
                <span className="font-semibold text-[#495057]">25</span> Results
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">My Tasks</h5>
              <div className="relative inline-flex items-center gap-1 text-[12px] text-[#878a99]">
                <select
                  value={taskFilter}
                  onChange={(e) =>
                    setTaskFilter(e.target.value as (typeof taskFilters)[number])
                  }
                  className="cursor-pointer appearance-none border-0 bg-transparent pr-4 font-medium text-[#405189] outline-none"
                >
                  {taskFilters.map((o) => (
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
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Deadline</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr key={t.name} className="border-b border-[#e9ebec] last:border-0">
                        <td className="px-5 py-3 font-medium text-[#495057]">{t.name}</td>
                        <td className="px-3 py-3 text-[#878a99]">{t.deadline}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${taskStatusBadge[t.status]}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                            style={{ background: t.color }}
                          >
                            {t.assignee}
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
      </div>

      {/* Team + Chat + Status */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Team Members</h5>
              <SortSelect
                label="Sort by:"
                value="Last 30 Days"
                options={["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month"]}
              />
            </div>
            <div className="card-body !p-0 max-h-[400px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                    <th className="px-5 py-3 font-medium">Member</th>
                    <th className="px-3 py-3 font-medium">Hours</th>
                    <th className="px-5 py-3 font-medium">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.name} className="border-b border-[#e9ebec] last:border-0">
                      <td className="px-5 py-3">
                        <p className="m-0 font-medium text-[#495057]">{m.name}</p>
                        <span className="text-[11px] text-[#878a99]">{m.role}</span>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#e9ebec]">
                          <div
                            className="h-full rounded-full bg-[#0ab39c]"
                            style={{ width: `${m.pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[#878a99]">{m.hours}</td>
                      <td className="px-5 py-3 font-medium text-[#495057]">{m.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card flex h-full flex-col">
            <div className="card-header">
              <h5 className="card-title">Chat</h5>
              <button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99]" aria-label="Settings">
                <Settings size={16} />
              </button>
            </div>
            <div className="card-body flex flex-1 flex-col !pt-2">
              <div className="mb-3 max-h-[280px] flex-1 space-y-3 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.time}-${i}`}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-[13px] ${
                        msg.from === "me"
                          ? "bg-[#405189] text-white"
                          : "bg-[#f3f6f9] text-[#495057]"
                      }`}
                    >
                      <p className="m-0">{msg.text}</p>
                      <span className={`mt-1 block text-[10px] ${msg.from === "me" ? "text-white/70" : "text-[#878a99]"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-[#e9ebec] pt-3">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Enter Message..."
                  className="flex-1 rounded border border-[#e9ebec] px-3 py-2 text-[13px] outline-none focus:border-[#405189]"
                />
                <button
                  type="button"
                  onClick={sendChat}
                  className="cursor-pointer rounded border-0 bg-[#405189] px-3 text-white hover:bg-[#364574]"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Projects Status</h5>
              <SortSelect
                label=""
                value="All Time"
                options={["All Time", "Last 7 Days", "Last 30 Days", "Last 90 Days"]}
              />
            </div>
            <div className="card-body">
              <div className="mb-4 text-center">
                <h2 className="m-0 text-[32px] font-semibold text-[#495057]">258</h2>
                <p className="m-0 text-[13px] text-[#878a99]">
                  Total Projects <span className="font-medium text-[#0ab39c]">+3 New</span>
                </p>
              </div>
              <ChartContainer className="mb-3 h-[180px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {statusData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ul className="m-0 list-none space-y-2 p-0">
                {statusData.map((s) => (
                  <li key={s.name} className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-[#495057]">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="text-[#878a99]">
                      {s.value} Projects · {s.hours}
                    </span>
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
