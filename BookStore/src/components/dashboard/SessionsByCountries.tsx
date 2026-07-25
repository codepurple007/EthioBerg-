"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ChartContainer from "./ChartContainer";

const data = [
  { country: "India", value: 2590, color: "#405189" },
  { country: "United States", value: 1850, color: "#0ab39c" },
  { country: "China", value: 1420, color: "#f7b84b" },
  { country: "Indonesia", value: 980, color: "#f06548" },
  { country: "Russia", value: 760, color: "#299cdb" },
  { country: "Bangladesh", value: 540, color: "#3577f1" },
  { country: "Canada", value: 420, color: "#6559cc" },
  { country: "Brazil", value: 310, color: "#f672a7" },
  { country: "Vietnam", value: 250, color: "#299cdb" },
  { country: "UK", value: 180, color: "#212529" },
];

const periods = ["ALL", "1M", "6M"] as const;

export default function SessionsByCountries() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("ALL");

  return (
    <div className="card h-full">
      <div className="card-header !border-b-0 pb-0">
        <h5 className="card-title">Sessions by Countries</h5>
        <div className="flex overflow-hidden rounded border border-[#e9ebec]">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`cursor-pointer border-0 px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                period === p
                  ? "bg-[#405189] text-white"
                  : "bg-white text-[#878a99] hover:bg-[#f3f6f9]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body pt-2">
        <ChartContainer className="h-[340px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
              barCategoryGap="18%"
            >
              <XAxis
                type="number"
                tick={{ fill: "#878a99", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="country"
                width={95}
                tick={{ fill: "#495057", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(64,81,137,0.06)" }}
                contentStyle={{
                  borderRadius: 4,
                  border: "1px solid #e9ebec",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {data.map((entry) => (
                  <Cell key={entry.country} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
