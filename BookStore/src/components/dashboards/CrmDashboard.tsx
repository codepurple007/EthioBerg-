"use client";

import { useState } from "react";
import {
  Rocket,
  BadgeDollarSign,
  Activity,
  Trophy,
  HeartHandshake,
  Settings,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  body: "#f3f3f9",
  border: "#e9ebec",
  heading: "#495057",
};

const kpis = [
  {
    label: "Campaign Sent",
    value: "197",
    positive: true,
    icon: Rocket,
    iconBg: "#e2e5ed",
    iconColor: COLORS.primary,
  },
  {
    label: "Annual Profit",
    value: "$489.4k",
    positive: true,
    icon: BadgeDollarSign,
    iconBg: "#daf4f0",
    iconColor: COLORS.success,
  },
  {
    label: "Lead Conversation",
    value: "32.89%",
    positive: false,
    icon: Activity,
    iconBg: "#fde8e4",
    iconColor: COLORS.danger,
  },
  {
    label: "Daily Average Income",
    value: "$1,596.5",
    positive: true,
    icon: Trophy,
    iconBg: "#fef4e4",
    iconColor: COLORS.warning,
  },
  {
    label: "Annual Deals",
    value: "2,659",
    positive: false,
    icon: HeartHandshake,
    iconBg: "#e1f0fa",
    iconColor: COLORS.info,
  },
];

const salesForecastData = [
  {
    name: "Total",
    Forecasted: 67,
    Goal: 37,
    Pending: 12,
    Revenue: 18,
  },
];

const dealTypeData = [
  { year: "2016", Pending: 80, Loss: 20, Won: 44 },
  { year: "2017", Pending: 50, Loss: 30, Won: 76 },
  { year: "2018", Pending: 30, Loss: 40, Won: 78 },
  { year: "2019", Pending: 40, Loss: 80, Won: 13 },
  { year: "2020", Pending: 100, Loss: 20, Won: 43 },
  { year: "2021", Pending: 20, Loss: 80, Won: 10 },
];

const balanceData = [
  { month: "Jan", Revenue: 20, Expenses: 12 },
  { month: "Feb", Revenue: 25, Expenses: 17 },
  { month: "Mar", Revenue: 30, Expenses: 45 },
  { month: "Apr", Revenue: 35, Expenses: 42 },
  { month: "May", Revenue: 40, Expenses: 24 },
  { month: "Jun", Revenue: 55, Expenses: 35 },
  { month: "Jul", Revenue: 70, Expenses: 42 },
  { month: "Aug", Revenue: 110, Expenses: 75 },
  { month: "Sep", Revenue: 150, Expenses: 102 },
  { month: "Oct", Revenue: 180, Expenses: 108 },
  { month: "Nov", Revenue: 210, Expenses: 156 },
  { month: "Dec", Revenue: 250, Expenses: 199 },
];

const dealsStatus = [
  {
    name: "Absternet LLC",
    lastContacted: "Sep 20, 2021",
    rep: "Donald Risher",
    initials: "DR",
    avatarColor: "#405189",
    status: "Deal Won" as const,
    value: "$100.1K",
  },
  {
    name: "Raitech Soft",
    lastContacted: "Sep 23, 2021",
    rep: "Sofia Cunha",
    initials: "SC",
    avatarColor: "#0ab39c",
    status: "Intro Call" as const,
    value: "$150K",
  },
  {
    name: "William PVT",
    lastContacted: "Sep 27, 2021",
    rep: "Luis Rocha",
    initials: "LR",
    avatarColor: "#f7b84b",
    status: "Stuck" as const,
    value: "$78.18K",
  },
  {
    name: "Loiusee LLP",
    lastContacted: "Sep 30, 2021",
    rep: "Vitoria Rodrigues",
    initials: "VR",
    avatarColor: "#299cdb",
    status: "Deal Won" as const,
    value: "$180K",
  },
  {
    name: "Apple Inc.",
    lastContacted: "Sep 30, 2021",
    rep: "Vitoria Rodrigues",
    initials: "VR",
    avatarColor: "#6559cc",
    status: "New Lead" as const,
    value: "$78.9K",
  },
];

const statusBadge: Record<
  (typeof dealsStatus)[number]["status"],
  string
> = {
  "Deal Won": "bg-[#daf4f0] text-[#0ab39c]",
  "Intro Call": "bg-[#fef4e4] text-[#f7b84b]",
  Stuck: "bg-[#fde8e4] text-[#f06548]",
  "New Lead": "bg-[#e1f0fa] text-[#299cdb]",
};

const initialTasks = [
  {
    id: "1",
    text: "Review and make sure nothing slips through cracks",
    date: "15 Sep, 2021",
    done: false,
  },
  {
    id: "2",
    text: "Send meeting invites for sales upcampaign",
    date: "20 Sep, 2021",
    done: false,
  },
  {
    id: "3",
    text: "Weekly closed sales won checking with sales team",
    date: "24 Sep, 2021",
    done: true,
  },
  {
    id: "4",
    text: "Add notes that can be viewed from the individual view",
    date: "27 Sep, 2021",
    done: false,
  },
  {
    id: "5",
    text: "Move stuff to another page",
    date: "27 Sep, 2021",
    done: true,
  },
  {
    id: "6",
    text: "Styling wireframe design and documentation for velzon admin",
    date: "27 Sep, 2021",
    done: false,
  },
];

const activities = [
  {
    day: "25",
    weekday: "Tue",
    time: "12:00am - 03:30pm",
    title: "Meeting for campaign with sales team",
    avatars: [
      { initials: "DR", color: "#405189" },
      { initials: "SC", color: "#0ab39c" },
      { initials: "LR", color: "#f7b84b" },
    ],
  },
  {
    day: "20",
    weekday: "Wed",
    time: "02:00pm - 03:45pm",
    title: "Adding a new event with attachments",
    avatars: [
      { initials: "VR", color: "#299cdb" },
      { initials: "JB", color: "#f06548" },
    ],
  },
  {
    day: "17",
    weekday: "Wed",
    time: "04:30pm - 07:15pm",
    title: "Create new project Bundling Product",
    avatars: [
      { initials: "AH", color: "#6559cc" },
      { initials: "JW", color: "#0ab39c" },
      { initials: "DR", color: "#405189" },
      { initials: "SC", color: "#f7b84b" },
    ],
  },
  {
    day: "12",
    weekday: "Tue",
    time: "10:30am - 01:15pm",
    title: "Weekly closed sales won checking with sales team",
    avatars: [
      { initials: "LR", color: "#f06548" },
      { initials: "VR", color: "#299cdb" },
    ],
  },
];

const closingDeals = [
  {
    name: "Acme Inc Install",
    rep: "Donald Risher",
    initials: "DR",
    avatarColor: "#405189",
    amount: "$96k",
    closeDate: "Today",
  },
  {
    name: "Save lots Stores",
    rep: "Jansh Brown",
    initials: "JB",
    avatarColor: "#0ab39c",
    amount: "$55.7k",
    closeDate: "30 Dec 2021",
  },
  {
    name: "William PVT",
    rep: "Ayaan Hudda",
    initials: "AH",
    avatarColor: "#f7b84b",
    amount: "$102k",
    closeDate: "25 Nov 2021",
  },
  {
    name: "Raitech Soft",
    rep: "Julia William",
    initials: "JW",
    avatarColor: "#299cdb",
    amount: "$89.5k",
    closeDate: "20 Sep 2021",
  },
  {
    name: "Absternet LLC",
    rep: "Vitoria Rodrigues",
    initials: "VR",
    avatarColor: "#6559cc",
    amount: "$89.5k",
    closeDate: "20 Sep 2021",
  },
];

const closingTabs = [
  "Closed Deals",
  "Active Deals",
  "Paused Deals",
  "Canceled Deals",
] as const;

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
      <span>{label}</span>
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

function Avatar({
  initials,
  color,
  size = 28,
  className = "",
}: {
  initials: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
      }}
    >
      {initials}
    </span>
  );
}

export default function CrmDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [closingTab, setClosingTab] =
    useState<(typeof closingTabs)[number]>("Closed Deals");

  const remaining = tasks.filter((t) => !t.done).length;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <div>
      {/* Row 1 — KPI cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{ background: kpi.iconBg }}
                  >
                    <Icon size={22} style={{ color: kpi.iconColor }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <h4 className="m-0 text-[20px] font-semibold tracking-tight text-[#495057]">
                        {kpi.value}
                      </h4>
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{
                          background: kpi.positive
                            ? COLORS.success
                            : COLORS.danger,
                        }}
                      />
                    </div>
                    <p className="m-0 text-[13px] text-[#878a99]">{kpi.label}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Charts */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Sales Forecast */}
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Sales Forecast</h5>
              <SortSelect
                label="SORT BY:"
                value="Nov 2021"
                options={["Oct 2021", "Nov 2021", "Dec 2021", "Jan 2022"]}
              />
            </div>
            <div className="card-body">
              <ChartContainer className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={salesForecastData}
                    margin={{ top: 8, right: 8, left: -4, bottom: 0 }}
                    barGap={8}
                    barCategoryGap="28%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="name"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: "Total Forecasted Value",
                        position: "insideBottom",
                        offset: -2,
                        fill: COLORS.muted,
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      tick={{ fill: COLORS.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}k`}
                      domain={[0, 80]}
                      ticks={[0, 20, 40, 60, 80]}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}k`, undefined]}
                      contentStyle={{
                        borderRadius: 4,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, color: COLORS.muted }}
                    />
                    <Bar
                      dataKey="Forecasted"
                      fill={COLORS.primary}
                      radius={[3, 3, 0, 0]}
                      barSize={18}
                    />
                    <Bar
                      dataKey="Goal"
                      fill={COLORS.success}
                      radius={[3, 3, 0, 0]}
                      barSize={18}
                    />
                    <Bar
                      dataKey="Pending"
                      fill={COLORS.warning}
                      radius={[3, 3, 0, 0]}
                      barSize={18}
                    />
                    <Bar
                      dataKey="Revenue"
                      fill={COLORS.info}
                      radius={[3, 3, 0, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Deal Type */}
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Deal Type</h5>
              <SortSelect
                label="SORT BY:"
                value="Monthly"
                options={["Today", "Weekly", "Monthly", "Yearly"]}
              />
            </div>
            <div className="card-body">
              <ChartContainer className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={dealTypeData}
                    margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: COLORS.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: COLORS.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 4,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, color: COLORS.muted }}
                    />
                    <Bar
                      dataKey="Pending"
                      stackId="a"
                      fill={COLORS.warning}
                      barSize={22}
                    />
                    <Bar
                      dataKey="Loss"
                      stackId="a"
                      fill={COLORS.danger}
                      barSize={22}
                    />
                    <Bar
                      dataKey="Won"
                      stackId="a"
                      fill={COLORS.success}
                      radius={[3, 3, 0, 0]}
                      barSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="xl:col-span-4">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Balance Overview</h5>
              <SortSelect
                label="SORT BY:"
                value="Current Year"
                options={[
                  "Today",
                  "Last Week",
                  "Last Month",
                  "Current Year",
                ]}
              />
            </div>
            <div className="card-body">
              <div className="mb-3 grid grid-cols-3 gap-2 border-b border-[#e9ebec] pb-3">
                <div className="text-center">
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                    $584k{" "}
                    <span className="text-[12px] font-normal text-[#878a99]">
                      Revenue
                    </span>
                  </h5>
                </div>
                <div className="text-center">
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                    $497k{" "}
                    <span className="text-[12px] font-normal text-[#878a99]">
                      Expenses
                    </span>
                  </h5>
                </div>
                <div className="text-center">
                  <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                    3.6%{" "}
                    <span className="text-[12px] font-normal text-[#878a99]">
                      Profit Ratio
                    </span>
                  </h5>
                </div>
              </div>
              <ChartContainer className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart
                    data={balanceData}
                    margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="crmRevenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.success}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.success}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                      <linearGradient
                        id="crmExpensesFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.danger}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.danger}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: COLORS.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: COLORS.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}k`}
                      domain={[0, 260]}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}k`, undefined]}
                      contentStyle={{
                        borderRadius: 4,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={28}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, color: COLORS.muted }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Revenue"
                      stroke={COLORS.success}
                      strokeWidth={2}
                      fill="url(#crmRevenueFill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Expenses"
                      stroke={COLORS.danger}
                      strokeWidth={2}
                      fill="url(#crmExpensesFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Deals Status + My Tasks */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2">
              <h5 className="card-title">Deals Status</h5>
              <SortSelect
                label=""
                value="02 Nov 2021 to 31 Dec 2021"
                options={[
                  "02 Nov 2021 to 31 Dec 2021",
                  "Today",
                  "Last Week",
                  "Last Month",
                  "Current Year",
                ]}
              />
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Last Contacted</th>
                      <th className="px-3 py-3 font-medium">
                        Sales Representative
                      </th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Deal Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealsStatus.map((deal) => (
                      <tr
                        key={deal.name}
                        className="border-b border-[#e9ebec] last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-[#405189]">
                          {deal.name}
                        </td>
                        <td className="px-3 py-3 text-[#495057]">
                          {deal.lastContacted}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              initials={deal.initials}
                              color={deal.avatarColor}
                            />
                            <span className="text-[#495057]">{deal.rep}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${statusBadge[deal.status]}`}
                          >
                            {deal.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-medium text-[#495057]">
                          {deal.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">My Tasks</h5>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:text-[#405189]"
                  aria-label="Settings"
                >
                  <Settings size={16} />
                </button>
                <button
                  type="button"
                  className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:text-[#405189]"
                  aria-label="More"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="m-0 text-[12px] text-[#878a99]">
                  <span className="font-semibold text-[#495057]">
                    {remaining}
                  </span>{" "}
                  of {tasks.length} remaining
                </p>
                <button
                  type="button"
                  className="cursor-pointer rounded border-0 bg-[#0ab39c] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#099885]"
                >
                  + Add Task
                </button>
              </div>
              <ul className="m-0 max-h-[320px] list-none space-y-0 overflow-y-auto p-0">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 border-b border-[#e9ebec] py-3 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0ab39c]"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`m-0 mb-1 text-[13px] ${
                          task.done
                            ? "text-[#878a99] line-through"
                            : "text-[#495057]"
                        }`}
                      >
                        {task.text}
                      </p>
                      <span className="text-[11px] text-[#878a99]">
                        {task.date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Upcoming Activities + Closing Deals */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <div className="card h-full">
            <div className="card-header">
              <h5 className="card-title">Upcoming Activities</h5>
              <button
                type="button"
                className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:text-[#405189]"
                aria-label="More"
              >
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-0 p-0">
                {activities.map((a) => (
                  <li
                    key={`${a.day}-${a.title}`}
                    className="flex gap-3 border-b border-[#e9ebec] py-3 last:border-0"
                  >
                    <div className="flex h-[52px] w-[48px] shrink-0 flex-col items-center justify-center rounded bg-[#f3f6f9] text-center">
                      <span className="text-[15px] font-semibold leading-tight text-[#405189]">
                        {a.day}
                      </span>
                      <span className="text-[11px] text-[#878a99]">
                        {a.weekday}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 mb-0.5 text-[12px] text-[#878a99]">
                        {a.time}
                      </p>
                      <p className="m-0 mb-2 text-[13px] font-medium text-[#495057]">
                        {a.title}
                      </p>
                      <div className="flex items-center">
                        {a.avatars.map((av, i) => (
                          <Avatar
                            key={`${av.initials}-${i}`}
                            initials={av.initials}
                            color={av.color}
                            size={26}
                            className={i > 0 ? "-ml-2 ring-2 ring-white" : ""}
                          />
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-3 text-center text-[12px] text-[#878a99]">
                Showing{" "}
                <span className="font-semibold text-[#495057]">4</span> of{" "}
                <span className="font-semibold text-[#495057]">125</span> Results
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="card h-full">
            <div className="card-header flex-wrap gap-2 !border-b-0">
              <h5 className="card-title">Closing Deals</h5>
            </div>
            <div className="flex flex-wrap gap-1 border-b border-[#e9ebec] px-5">
              {closingTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setClosingTab(tab)}
                  className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2 text-[13px] font-medium transition-colors ${
                    closingTab === tab
                      ? "border-[#405189] text-[#405189]"
                      : "border-transparent text-[#878a99] hover:text-[#405189]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="card-body !p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">
                      <th className="px-5 py-3 font-medium">Deal Name</th>
                      <th className="px-3 py-3 font-medium">Sales Rep</th>
                      <th className="px-3 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Close Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closingDeals.map((deal) => (
                      <tr
                        key={deal.name}
                        className="border-b border-[#e9ebec] last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-[#405189]">
                          {deal.name}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              initials={deal.initials}
                              color={deal.avatarColor}
                            />
                            <span className="text-[#495057]">{deal.rep}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-medium text-[#495057]">
                          {deal.amount}
                        </td>
                        <td className="px-5 py-3 text-[#495057]">
                          {deal.closeDate}
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
    </div>
  );
}
