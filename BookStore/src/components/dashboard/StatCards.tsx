import {
  Users,
  Activity,
  Clock,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Users",
    value: "28.05k",
    change: "16.24 %",
    positive: true,
    icon: Users,
  },
  {
    label: "Sessions",
    value: "97.66k",
    change: "3.96 %",
    positive: false,
    icon: Activity,
  },
  {
    label: "Avg. Visit Duration",
    value: "3m 40sec",
    change: "0.24 %",
    positive: false,
    icon: Clock,
  },
  {
    label: "Bounce Rate",
    value: "33.48%",
    change: "7.05 %",
    positive: true,
    icon: ExternalLink,
  },
];

type StatCardsProps = {
  /** Use a 2×2 grid under the upgrade card */
  compact?: boolean;
};

export default function StatCards({ compact = false }: StatCardsProps) {
  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      }
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

        return (
          <div key={stat.label} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-2 text-[13px] font-medium text-[#878a99]">
                    {stat.label}
                  </p>
                  <h4 className="m-0 text-[22px] font-semibold tracking-tight text-[#495057]">
                    {stat.value}
                  </h4>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e2e5ed]">
                  <Icon
                    size={22}
                    className="text-[#405189]"
                    strokeWidth={1.75}
                  />
                </div>
              </div>

              <p className="m-0 flex flex-wrap items-center gap-1.5 text-[12px]">
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    stat.positive ? "text-[#0ab39c]" : "text-[#f06548]"
                  }`}
                >
                  <TrendIcon size={14} strokeWidth={2.25} />
                  {stat.change}
                </span>
                <span className="text-[#878a99]">vs. previous month</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
