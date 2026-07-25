"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Clock,
} from "lucide-react";

type CalEvent = {
  id: number;
  title: string;
  day: number;
  color: string;
  soft: string;
  category: string;
};

const categories = [
  { label: "New Event Planning", color: "#405189", soft: "#e2e5ed" },
  { label: "Meeting", color: "#0ab39c", soft: "#daf4f0" },
  { label: "Generating Reports", color: "#f7b84b", soft: "#fef4e4" },
  { label: "Create New theme", color: "#f06548", soft: "#fde8e4" },
];

const initialEvents: CalEvent[] = [
  { id: 1, title: "World Braille Day", day: 4, color: "#405189", soft: "#e2e5ed", category: "Meeting" },
  { id: 2, title: "World Leprosy Day", day: 9, color: "#0ab39c", soft: "#daf4f0", category: "Meeting" },
  { id: 3, title: "Sales Report", day: 11, color: "#f7b84b", soft: "#fef4e4", category: "Generating Reports" },
  { id: 4, title: "Anniversary Celebration", day: 13, color: "#f06548", soft: "#fde8e4", category: "New Event Planning" },
  { id: 5, title: "Team Meeting", day: 18, color: "#0ab39c", soft: "#daf4f0", category: "Meeting" },
  { id: 6, title: "Theme Review", day: 21, color: "#299cdb", soft: "#e1f0fa", category: "Create New theme" },
  { id: 7, title: "Client Call", day: 24, color: "#405189", soft: "#e2e5ed", category: "Meeting" },
  { id: 8, title: "UX Workshop", day: 27, color: "#f7b84b", soft: "#fef4e4", category: "New Event Planning" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarApp() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(18);
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0].label);

  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const total = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const day = i - startWeekday + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  }, [daysInMonth, startWeekday]);

  const upcoming = events
    .filter((e) => selectedDay == null || e.day >= selectedDay)
    .sort((a, b) => a.day - b.day)
    .slice(0, 5);

  const addEvent = () => {
    if (!title.trim() || selectedDay == null) return;
    const cat = categories.find((c) => c.label === category) ?? categories[0];
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: title.trim(),
        day: selectedDay,
        color: cat.color,
        soft: cat.soft,
        category: cat.label,
      },
    ]);
    setTitle("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-3">
        <div className="card">
          <div className="card-body">
            <button
              type="button"
              onClick={addEvent}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded border-0 bg-[#405189] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              <Plus size={15} /> Create New Event
            </button>
            <p className="mb-3 text-[12px] text-[#878a99]">
              Drag and drop your event or click in the calendar
            </p>
            <div className="mb-4 space-y-2">
              {categories.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCategory(c.label)}
                  className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-[13px] ${
                    category === c.label
                      ? "border-transparent text-white"
                      : "border-[#e9ebec] bg-white text-[#495057]"
                  }`}
                  style={
                    category === c.label
                      ? { background: c.color }
                      : { borderLeftWidth: 3, borderLeftColor: c.color }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="mb-3 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
            <div className="rounded border border-[#e9ebec] bg-[#f3f3f9] p-3">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#405189]">
                <CalendarDays size={14} /> Upcoming Events
              </div>
              <p className="mb-3 text-[12px] text-[#878a99]">
                Don&apos;t miss scheduled events
              </p>
              {upcoming.length === 0 ? (
                <p className="text-[13px] text-[#878a99]">
                  Welcome to your Calendar! Event that applications book will
                  appear here.
                </p>
              ) : (
                <ul className="m-0 list-none space-y-2 p-0">
                  {upcoming.map((e) => (
                    <li
                      key={e.id}
                      className="rounded border border-[#e9ebec] bg-white px-3 py-2"
                    >
                      <div
                        className="mb-1 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium"
                        style={{ background: e.soft, color: e.color }}
                      >
                        {e.category}
                      </div>
                      <p className="m-0 text-[13px] font-medium text-[#495057]">
                        {e.title}
                      </p>
                      <p className="m-0 mt-0.5 flex items-center gap-1 text-[11px] text-[#878a99]">
                        <Clock size={11} />
                        {monthLabel.split(" ")[0]} {e.day}, {year}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-9">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">{monthLabel}</h5>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMonthOffset((v) => v - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f3f3f9]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset(0)}
                className="rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] font-medium text-[#495057] hover:bg-[#f3f3f9]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset((v) => v + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#e9ebec] bg-white text-[#495057] hover:bg-[#f3f3f9]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="grid grid-cols-7 border-b border-[#e9ebec]">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="border-r border-[#e9ebec] px-2 py-2 text-center text-[12px] font-semibold text-[#878a99] last:border-r-0"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                const dayEvents = events.filter((e) => e.day === day);
                const isSelected = day != null && day === selectedDay;
                const isToday =
                  day != null &&
                  monthOffset === 0 &&
                  day === now.getDate();
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={day == null}
                    onClick={() => day != null && setSelectedDay(day)}
                    className={`min-h-[96px] border-r border-b border-[#e9ebec] p-2 text-left align-top last:border-r-0 disabled:bg-[#fafafa] ${
                      isSelected ? "bg-[#e2e5ed]/40" : "bg-white hover:bg-[#f3f3f9]"
                    }`}
                  >
                    {day != null && (
                      <>
                        <span
                          className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium ${
                            isToday
                              ? "bg-[#405189] text-white"
                              : "text-[#495057]"
                          }`}
                        >
                          {day}
                        </span>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium"
                              style={{ background: e.soft, color: e.color }}
                            >
                              {e.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[10px] text-[#878a99]">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
