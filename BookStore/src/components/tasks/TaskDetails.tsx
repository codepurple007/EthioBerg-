"use client";
import { useState } from "react";
import { CheckCircle2, Circle, MessageSquare, Paperclip, CalendarDays } from "lucide-react";

const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const initialSubtasks = [
  { id: 1, text: "Create wireframes", done: true },
  { id: 2, text: "Design high-fidelity mockups", done: true },
  { id: 3, text: "Developer handoff", done: false },
  { id: 4, text: "QA & feedback", done: false },
];
const comments = [
  { user: "Erica Kernan", date: "02 Dec, 2021", text: "Mockups look great. Ready for handoff." },
  { user: "James Forbes", date: "03 Dec, 2021", text: "I will start implementing tomorrow morning." },
];

export default function TaskDetails() {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [comment, setComment] = useState("");
  const [list, setList] = useState(comments);
  const toggle = (id: number) => setSubtasks((p) => p.map((s) => s.id === id ? { ...s, done: !s.done } : s));
  const addComment = () => {
    if (!comment.trim()) return;
    setList((p) => [...p, { user: "You", date: "Just now", text: comment.trim() }]);
    setComment("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <div className="card">
          <div className="card-body space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="rounded bg-[#e1f0fa] px-2 py-0.5 text-[11px] font-medium text-[#299cdb]">Inprogress</span>
                <h4 className="mt-2 mb-0 text-[20px] font-semibold text-[#495057]">Design Dashboard Wireframes</h4>
              </div>
              <span className="rounded bg-[#fde8e4] px-2 py-0.5 text-[11px] font-medium text-[#f06548]">High Priority</span>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-[#878a99]">
              Create wireframes and high-fidelity designs for the new analytics dashboard. Collaborate with product and engineering for handoff.
            </p>
            <div>
              <h5 className="mb-2 text-[14px] font-semibold">Sub Tasks</h5>
              <div className="space-y-2">
                {subtasks.map((s) => (
                  <button key={s.id} type="button" onClick={() => toggle(s.id)} className="flex w-full cursor-pointer items-center gap-2 rounded border border-[#e9ebec] bg-white px-3 py-2 text-left text-[13px] hover:bg-[#f8f9fa]">
                    {s.done ? <CheckCircle2 size={16} className="text-[#0ab39c]" /> : <Circle size={16} className="text-[#878a99]" />}
                    <span className={s.done ? "text-[#878a99] line-through" : "text-[#495057]"}>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h5 className="card-title"><MessageSquare size={16} className="mr-1 inline" /> Comments</h5></div>
          <div className="card-body space-y-4">
            {list.map((c, i) => (
              <div key={i} className="rounded border border-[#e9ebec] p-3">
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="font-medium text-[#495057]">{c.user}</span>
                  <span className="text-[12px] text-[#878a99]">{c.date}</span>
                </div>
                <p className="m-0 text-[13px] text-[#878a99]">{c.text}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <input className={inputCls} placeholder="Write a comment..." value={comment} onChange={(e)=>setComment(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addComment()} />
              <button type="button" className={btnPrimary} onClick={addComment}>Post</button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Task Info</h5></div>
          <div className="card-body space-y-3 text-[13px]">
            {[
              ["Assigned To", "Erica Kernan"],
              ["Project", "Velzon Admin"],
              ["Due Date", "15 Dec, 2021"],
              ["Status", "Inprogress"],
              ["Priority", "High"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#e9ebec] pb-2 last:border-0">
                <span className="text-[#878a99]">{k}</span>
                <span className="font-medium text-[#495057]">{v}</span>
              </div>
            ))}
            <p className="m-0 inline-flex items-center gap-1 text-[12px] text-[#878a99]"><CalendarDays size={12} /> Created 01 Dec, 2021</p>
            <p className="m-0 inline-flex items-center gap-1 text-[12px] text-[#878a99]"><Paperclip size={12} /> 3 Attachments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
