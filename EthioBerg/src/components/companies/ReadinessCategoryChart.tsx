import type { ChartVisualization } from "@/lib/types";
import { REQUIREMENT_STATE_LABELS } from "@/lib/readiness/labels";

const barColors: Record<string, string> = {
  MET: "bg-[#0ab39c]",
  NOT_MET: "bg-[#f06548]",
  MISSING_EVIDENCE: "bg-[#f7b84b]",
  PROFESSIONAL_REVIEW: "bg-[#299cdb]",
  CONFLICT: "bg-[#f06548]",
  NOT_APPLICABLE: "bg-[#878a99]",
};

export default function ReadinessCategoryChart({
  visualization,
}: {
  visualization: ChartVisualization;
}) {
  const rows = visualization.series.map((series) => {
    const counts: Record<string, number> = Object.fromEntries(
      series.points.map((point) => [String(point.period), point.value]),
    );
    const total = series.points.reduce((sum, point) => sum + point.value, 0);
    return { category: series.label, counts, total };
  });

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.category}>
          <div className="mb-1 flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#495057]">{row.category}</span>
            <span className="text-[#878a99]">{row.total} requirements</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded bg-[#f3f3f9]">
            {Object.entries(row.counts).map(([state, value]) =>
              value > 0 ? (
                <div
                  key={state}
                  className={barColors[state] ?? "bg-[#878a99]"}
                  style={{ width: `${(value / Math.max(row.total, 1)) * 100}%` }}
                  title={`${REQUIREMENT_STATE_LABELS[state] ?? state}: ${value}`}
                />
              ) : null,
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
