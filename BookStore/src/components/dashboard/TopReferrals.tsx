const referrals = [
  { name: "Google", pct: "24.58%", color: "#405189" },
  { name: "YouTube", pct: "17.51%", color: "#f06548" },
  { name: "Meta", pct: "13.05%", color: "#0ab39c" },
  { name: "Instagram", pct: "11.45%", color: "#f7b84b" },
  { name: "LinkedIn", pct: "8.42%", color: "#299cdb" },
  { name: "Twitter", pct: "5.89%", color: "#6559cc" },
  { name: "Others", pct: "19.10%", color: "#adb5bd" },
];

const segments = [
  { w: "25%", c: "#405189" },
  { w: "18%", c: "#f06548" },
  { w: "13%", c: "#0ab39c" },
  { w: "11%", c: "#f7b84b" },
  { w: "8%", c: "#299cdb" },
  { w: "6%", c: "#6559cc" },
  { w: "19%", c: "#adb5bd" },
];

export default function TopReferrals() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Top Referrals Pages</h5>
      </div>
      <div className="card-body">
        <div className="mb-4 text-center">
          <h3 className="m-0 text-[28px] font-semibold text-[#495057]">
            725,800
          </h3>
          <p className="mt-1 mb-0 text-[13px] text-[#878a99]">
            Total page views of your website
          </p>
        </div>

        <div className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full">
          {segments.map((s) => (
            <div
              key={s.c}
              style={{ width: s.w, background: s.c }}
              className="h-full"
            />
          ))}
        </div>

        <ul className="m-0 list-none space-y-3 p-0">
          {referrals.map((r) => (
            <li
              key={r.name}
              className="flex items-center justify-between text-[13px]"
            >
              <span className="flex items-center gap-2 text-[#495057]">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: r.color }}
                />
                {r.name}
              </span>
              <span className="font-semibold text-[#495057]">{r.pct}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
