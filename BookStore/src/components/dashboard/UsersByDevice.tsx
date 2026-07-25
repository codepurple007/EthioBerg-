"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Monitor, Smartphone, Tablet, TrendingUp, TrendingDown } from "lucide-react";
import ChartContainer from "./ChartContainer";

const data = [
  { name: "Desktop", value: 78.56, color: "#405189" },
  { name: "Mobile", value: 16.34, color: "#f7b84b" },
  { name: "Tablet", value: 5.1, color: "#299cdb" },
];

const devices = [
  {
    name: "Desktop",
    value: "78.56%",
    users: "2.32k",
    change: "+1.82%",
    positive: true,
    icon: Monitor,
    color: "#405189",
  },
  {
    name: "Mobile",
    value: "16.34%",
    users: "1.24k",
    change: "-0.63%",
    positive: false,
    icon: Smartphone,
    color: "#f7b84b",
  },
  {
    name: "Tablet",
    value: "5.10%",
    users: "0.42k",
    change: "+0.58%",
    positive: true,
    icon: Tablet,
    color: "#299cdb",
  },
];

export default function UsersByDevice() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Users by Device</h5>
      </div>
      <div className="card-body">
        <ChartContainer className="relative mx-auto h-[220px] w-full max-w-[260px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Share"]}
                contentStyle={{
                  borderRadius: 4,
                  border: "1px solid #e9ebec",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="m-0 text-[12px] text-[#878a99]">Total Users</p>
            <h4 className="m-0 text-[20px] font-semibold text-[#495057]">
              3.98k
            </h4>
          </div>
        </ChartContainer>

        <div className="mt-2 space-y-3">
          {devices.map((d) => {
            const Icon = d.icon;
            const Trend = d.positive ? TrendingUp : TrendingDown;
            return (
              <div
                key={d.name}
                className="flex items-center gap-3 border-b border-[#e9ebec] pb-3 last:border-0 last:pb-0"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded"
                  style={{ background: `${d.color}18` }}
                >
                  <Icon size={16} style={{ color: d.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[13px] font-medium text-[#495057]">
                    {d.name}
                  </p>
                  <p className="m-0 text-[11px] text-[#878a99]">{d.users} Users</p>
                </div>
                <div className="text-right">
                  <p className="m-0 text-[13px] font-semibold text-[#495057]">
                    {d.value}
                  </p>
                  <p
                    className={`m-0 flex items-center justify-end gap-0.5 text-[11px] font-medium ${
                      d.positive ? "text-[#0ab39c]" : "text-[#f06548]"
                    }`}
                  >
                    <Trend size={11} />
                    {d.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
