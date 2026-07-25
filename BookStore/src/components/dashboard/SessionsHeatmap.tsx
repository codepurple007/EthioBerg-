"use client";

const days = ["Sat", "Fri", "Thu", "Wed", "Tue", "Mon", "Sun"];
const hours = Array.from({ length: 18 }, (_, i) => `${i + 1}h`);

// Heatmap intensity 0-4 matching Velzon look
function seedValue(day: number, hour: number) {
  const n = (day * 17 + hour * 31 + day * hour) % 23;
  if (n > 18) return 4;
  if (n > 13) return 3;
  if (n > 8) return 2;
  if (n > 3) return 1;
  return 0;
}

const colors = ["#daf4f0", "#a3e4d7", "#45c4b0", "#0ab39c", "#087f6e"];

export default function SessionsHeatmap() {
  return (
    <div className="card h-full">
      <div className="card-header">
        <h5 className="card-title">Audiences Sessions by Country</h5>
      </div>
      <div className="card-body overflow-x-auto">
        <div className="min-w-[420px]">
          <div
            className="mb-2 grid gap-1"
            style={{
              gridTemplateColumns: `36px repeat(${hours.length}, minmax(0, 1fr))`,
            }}
          >
            <div />
            {hours.map((h) => (
              <div
                key={h}
                className="text-center text-[10px] text-[#878a99]"
              >
                {h}
              </div>
            ))}
          </div>

          {days.map((day, di) => (
            <div
              key={day}
              className="mb-1 grid gap-1"
              style={{
                gridTemplateColumns: `36px repeat(${hours.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="flex items-center text-[11px] text-[#878a99]">
                {day}
              </div>
              {hours.map((_, hi) => {
                const v = seedValue(di, hi);
                return (
                  <div
                    key={`${day}-${hi}`}
                    className="aspect-square rounded-[2px]"
                    style={{ background: colors[v] }}
                    title={`${day} ${hi + 1}h: ${v + 1}`}
                  />
                );
              })}
            </div>
          ))}

          <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-[#878a99]">
            <span>Less</span>
            {colors.map((c) => (
              <span
                key={c}
                className="inline-block h-3 w-3 rounded-[2px]"
                style={{ background: c }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
