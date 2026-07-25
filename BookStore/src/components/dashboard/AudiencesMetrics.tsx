"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ChartContainer from "./ChartContainer";

const data = [
  { month: "Jan", lastYear: 42, currentYear: 28 },
  { month: "Feb", lastYear: 55, currentYear: 32 },
  { month: "Mar", lastYear: 38, currentYear: 48 },
  { month: "Apr", lastYear: 62, currentYear: 35 },
  { month: "May", lastYear: 48, currentYear: 55 },
  { month: "Jun", lastYear: 70, currentYear: 40 },
  { month: "Jul", lastYear: 52, currentYear: 58 },
  { month: "Aug", lastYear: 65, currentYear: 45 },
  { month: "Sep", lastYear: 45, currentYear: 62 },
  { month: "Oct", lastYear: 58, currentYear: 38 },
  { month: "Nov", lastYear: 72, currentYear: 50 },
  { month: "Dec", lastYear: 50, currentYear: 55 },
];

const metrics = [
  { label: "Avg. Session", value: "793" },
  { label: "Conversion Rate", value: "17.33%" },
  { label: "Avg. Session Duration", value: "3m 49s" },
];

export default function AudiencesMetrics() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Audiences Metrics</h5>
      </div>
      <div className="card-body">
        <div className="mb-4 grid grid-cols-3 gap-2 border-b border-[#e9ebec] pb-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="mb-1 text-[12px] text-[#878a99]">{m.label}</p>
              <h5 className="m-0 text-[16px] font-semibold text-[#495057]">
                {m.value}
              </h5>
            </div>
          ))}
        </div>

        <ChartContainer className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9ebec"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#878a99", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#878a99", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 4,
                  border: "1px solid #e9ebec",
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: "#878a99" }}
              />
              <Bar
                dataKey="lastYear"
                name="Last Year"
                fill="#0ab39c"
                radius={[2, 2, 0, 0]}
                barSize={10}
              />
              <Bar
                dataKey="currentYear"
                name="Current Year"
                fill="#adb5bd"
                radius={[2, 2, 0, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
