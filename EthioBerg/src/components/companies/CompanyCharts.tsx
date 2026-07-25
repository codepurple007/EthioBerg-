import type { ChartVisualization } from "@/lib/types";

function mergePriceVolumeRows(visualization: ChartVisualization) {
  const closeSeries = visualization.series.find((series) => series.key === "close");
  const volumeSeries = visualization.series.find((series) => series.key === "volume");
  if (!closeSeries || !volumeSeries) return [];
  return closeSeries.points.map((point, index) => ({
    label: point.date ?? "",
    close: point.value,
    volume: volumeSeries.points[index]?.value ?? 0,
  }));
}

function buildLinePath(
  values: number[],
  width: number,
  height: number,
  padding: number,
): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  return values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function PriceVolumeChart({ visualization }: { visualization: ChartVisualization }) {
  const rows = mergePriceVolumeRows(visualization);
  const maxVolume = Math.max(...rows.map((row) => row.volume), 1);
  const width = 640;
  const height = 180;
  const padding = 24;
  const closes = rows.map((row) => row.close);
  const min = Math.min(...closes, 0);
  const max = Math.max(...closes, 1);
  const range = Math.max(max - min, 1);
  const linePath = buildLinePath(closes, width, height, padding);
  const dots = closes.map((value, index) => {
    const x = padding + (index / Math.max(closes.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y, label: rows[index].label, value };
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[12px] font-medium text-[#495057]">Closing price (ETB)</p>
        <div className="rounded border border-[#e9ebec] bg-white p-3">
          <svg viewBox="0 0 640 180" className="h-[180px] w-full">
            <path d={linePath} fill="none" stroke="#405189" strokeWidth="2.5" />
            {dots.map((dot) => (
              <g key={dot.label}>
                <circle cx={dot.x} cy={dot.y} r="4" fill="#405189" />
                <text x={dot.x} y="172" textAnchor="middle" fontSize="10" fill="#878a99">
                  {dot.label.slice(5)}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#878a99]">
            {rows.map((row) => (
              <span key={row.label}>
                {row.label}: ETB {row.close.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[12px] font-medium text-[#495057]">Volume (shares)</p>
        <div className="rounded border border-[#e9ebec] bg-white p-3">
          <div className="flex h-[180px] items-end gap-2">
            {rows.map((row) => (
              <div key={row.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[#0ab39c]"
                  style={{ height: `${(row.volume / maxVolume) * 100}%`, minHeight: "8px" }}
                  title={`${row.label}: ${row.volume.toLocaleString()} shares`}
                />
                <span className="text-[10px] text-[#878a99]">{row.label.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {visualization.subtitle ? (
        <p className="m-0 text-[11px] text-[#856404]">{visualization.subtitle}</p>
      ) : null}
    </div>
  );
}

export function FinancialTrendChart({ visualization }: { visualization: ChartVisualization }) {
  const revenue = visualization.series.find((series) => series.key === "revenue");
  const profit = visualization.series.find((series) => series.key === "net_profit");
  const rows =
    revenue?.points.map((point, index) => ({
      period: point.period ?? "",
      revenue: point.value,
      netProfit: profit?.points[index]?.value ?? 0,
    })) ?? [];
  const maxValue = Math.max(...rows.flatMap((row) => [row.revenue, row.netProfit]), 1);

  return (
    <div>
      <div className="rounded border border-[#e9ebec] bg-white p-4">
        <div className="mb-3 flex gap-4 text-[11px] text-[#878a99]">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-[#405189]" /> Revenue
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-[#0ab39c]" /> Net profit
          </span>
        </div>
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.period}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#495057]">{row.period}</span>
                <span className="text-[#878a99]">ETB millions</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-[#878a99]">Revenue</span>
                  <div className="h-3 flex-1 rounded bg-[#f3f3f9]">
                    <div
                      className="h-3 rounded bg-[#405189]"
                      style={{ width: `${(row.revenue / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-[#495057]">{row.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-[#878a99]">Profit</span>
                  <div className="h-3 flex-1 rounded bg-[#f3f3f9]">
                    <div
                      className="h-3 rounded bg-[#0ab39c]"
                      style={{ width: `${(row.netProfit / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-[#495057]">{row.netProfit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {visualization.subtitle ? (
        <p className="mt-2 text-[11px] text-[#878a99]">{visualization.subtitle}</p>
      ) : null}
    </div>
  );
}
