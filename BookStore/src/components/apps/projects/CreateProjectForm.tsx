"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import Link from "next/link";

const inputClass =
  "w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[#878a99]";

export default function CreateProjectForm() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("New");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [budget, setBudget] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="card-header">
        <h5 className="card-title">Create Project</h5>
      </div>
      <div className="card-body space-y-4">
        {saved && (
          <div className="rounded border border-[#0ab39c]/30 bg-[#daf4f0] px-3 py-2 text-[13px] text-[#0ab39c]">
            Project saved successfully (demo).
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Project Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Project Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {["New", "Inprogress", "Pending", "Completed"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Project Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="Enter project description..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClass}
            >
              {["High", "Medium", "Low"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Budget</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$0.00"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Team Members</label>
            <select className={inputClass} defaultValue="">
              <option value="" disabled>
                Select members
              </option>
              <option>Erica Kernan</option>
              <option>Alexis Clarke</option>
              <option>James Morris</option>
              <option>Nancy Martino</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Attached Files</label>
          <div className="rounded border border-dashed border-[#e9ebec] bg-[#f3f3f9] px-4 py-8 text-center text-[13px] text-[#878a99]">
            Drop files here or click to upload
            <input type="file" className="mt-2 block w-full text-[12px]" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-[#e9ebec] px-4 py-3">
        <Link
          href="/apps/projects/list"
          className="inline-flex items-center gap-1 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] no-underline hover:bg-[#f3f3f9]"
        >
          <X size={14} /> Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
        >
          <Save size={14} /> Create Project
        </button>
      </div>
    </form>
  );
}
