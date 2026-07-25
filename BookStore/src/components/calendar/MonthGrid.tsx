"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const events: Record<number, { title: string; color: string }[]> = {
  3: [{ title: "Design Review", color: "#405189" }],
  8: [{ title: "Team Sync", color: "#0ab39c" }, { title: "Client Call", color: "#f7b84b" }],
  12: [{ title: "Sprint Planning", color: "#299cdb" }],
  15: [{ title: "Product Launch", color: "#f06548" }],
  18: [{ title: "Standup", color: "#0ab39c" }],
  22: [{ title: "Board Meeting", color: "#6559cc" }],
  25: [{ title: "Demo Day", color: "#405189" }],
  28: [{ title: "Retrospective", color: "#f7b84b" }],
};

export default function MonthGrid() {
  const [month] = useState("December 2021");
  const [selected, setSelected] = useState<number | null>(15);
  // Dec 2021 starts on Wednesday — pad 3 empty cells
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const pad = Array.from({ length: 3 }, (_, i) => null);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white p-1.5 text-[#878a99] hover:bg-[#f3f6f9]"><ChevronLeft size={16} /></button>
          <h5 className="card-title min-w-[140px] text-center">{month}</h5>
          <button type="button" className="cursor-pointer rounded border border-[#e9ebec] bg-white p-1.5 text-[#878a99] hover:bg-[#f3f6f9]"><ChevronRight size={16} /></button>
        </div>
        {selected && events[selected] && (
          <span className="text-[13px] text-[#878a99]">Selected day {selected}: {events[selected].map((e) => e.title).join(", ")}</span>
        )}
      </div>
      <div className="card-body p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-px rounded border border-[#e9ebec] bg-[#e9ebec] overflow-hidden">
          {weekdays.map((d) => (
            <div key={d} className="bg-[#f3f6f9] px-2 py-2 text-center text-[12px] font-semibold text-[#878a99]">{d}</div>
          ))}
          {pad.map((_, i) => <div key={`pad-${i}`} className="min-h-[80px] bg-white sm:min-h-[100px]" />)}
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelected(day)}
              className={`min-h-[80px] cursor-pointer border-0 bg-white p-1.5 text-left align-top sm:min-h-[100px] hover:bg-[#f8f9fa] ${selected === day ? "ring-2 ring-inset ring-[#405189]" : ""}`}
            >
              <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium ${selected === day ? "bg-[#405189] text-white" : "text-[#495057]"}`}>{day}</span>
              <div className="space-y-0.5">
                {(events[day] || []).map((ev) => (
                  <div key={ev.title} className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white" style={{ background: ev.color }}>{ev.title}</div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
