"use client";

const durationRows = [
  { duration: "0-30", sessions: "2,250", views: "4,250" },
  { duration: "31-60", sessions: "1,501", views: "2,050" },
  { duration: "61-120", sessions: "750", views: "1,600" },
  { duration: "121-240", sessions: "540", views: "1,040" },
];

const markers = [
  { x: 168, y: 88 },
  { x: 198, y: 128 },
  { x: 248, y: 198 },
  { x: 452, y: 92 },
  { x: 498, y: 148 },
  { x: 568, y: 138 },
  { x: 628, y: 168 },
  { x: 698, y: 218 },
  { x: 478, y: 218 },
];

export default function LiveUsersMap() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Live Users By Country</h5>
      </div>
      <div className="card-body pt-2">
        <div className="relative mb-3 overflow-hidden rounded bg-[#fafbfc]">
          <svg
            viewBox="0 0 800 300"
            className="h-auto w-full"
            role="img"
            aria-label="World map with live users"
          >
            <defs>
              <pattern
                id="mapGrid"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="0.9" fill="#9aa5b5" />
              </pattern>
              <clipPath id="worldClip">
                {/* North America */}
                <path d="M80 70c40-40 90-45 130-25 30 15 55 45 50 85-5 35-35 55-70 70-40 15-80 5-100-25-20-30-25-70-10-105z" />
                {/* South America */}
                <path d="M210 165c25-5 45 15 50 45 5 35-5 70-25 95-15 18-40 20-55 5-18-18-22-50-15-80 5-25 20-55 45-65z" />
                {/* Europe */}
                <path d="M410 55c35-20 70-10 85 15 12 20 8 45-10 58-25 18-55 12-75-5-18-16-20-45 0-68z" />
                {/* Africa */}
                <path d="M430 125c35-10 65 5 75 40 10 40-5 85-35 110-25 20-55 15-70-10-18-28-15-70 0-100 8-22 15-35 30-40z" />
                {/* Asia */}
                <path d="M500 45c60-25 120-15 160 20 35 30 50 70 40 110-8 30-40 45-75 50-45 6-90-10-120-40-30-30-35-80-5-140z" />
                {/* Australia */}
                <path d="M650 195c40-10 70 10 75 40 5 28-15 50-45 55-30 5-55-15-60-40-5-22 10-48 30-55z" />
              </clipPath>
            </defs>

            <rect
              width="800"
              height="300"
              fill="url(#mapGrid)"
              clipPath="url(#worldClip)"
              opacity="0.85"
            />

            <g stroke="#405189" strokeWidth="1.1" opacity="0.4" fill="none">
              <path d="M198 128 C 300 70, 380 70, 452 92" />
              <path d="M198 128 C 320 160, 400 200, 478 218" />
              <path d="M452 92 C 510 110, 540 125, 568 138" />
              <path d="M568 138 C 610 150, 650 180, 698 218" />
              <path d="M248 198 C 340 190, 420 200, 478 218" />
              <path d="M168 88 C 280 40, 380 50, 452 92" />
            </g>

            {markers.map((m, i) => (
              <g key={i}>
                <circle
                  cx={m.x}
                  cy={m.y}
                  r="12"
                  fill="#405189"
                  opacity="0.18"
                  className="map-marker"
                />
                <circle cx={m.x} cy={m.y} r="5" fill="#405189" />
                <circle cx={m.x} cy={m.y} r="2.2" fill="#fff" />
              </g>
            ))}
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] text-[#878a99]">
                <th className="py-2 pr-2 font-medium">Duration (Secs)</th>
                <th className="px-2 py-2 font-medium">Sessions</th>
                <th className="py-2 pl-2 font-medium">Views</th>
              </tr>
            </thead>
            <tbody>
              {durationRows.map((row) => (
                <tr key={row.duration} className="border-b border-[#e9ebec]">
                  <td className="py-2.5 pr-2 font-medium text-[#495057]">
                    {row.duration}
                  </td>
                  <td className="px-2 py-2.5 text-[#495057]">{row.sessions}</td>
                  <td className="py-2.5 pl-2 text-[#495057]">{row.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
