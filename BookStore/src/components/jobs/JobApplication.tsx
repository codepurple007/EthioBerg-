"use client";
import { useState } from "react";
import { Upload, Check } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function JobApplication() {
  const [done, setDone] = useState(false);
  return (
    <div className="mx-auto max-w-3xl card">
      <div className="card-header"><h5 className="card-title">Application Form — Business Associate</h5></div>
      <div className="card-body space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-[13px] font-medium">First Name</label><input className={inputCls} placeholder="First name" /></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Last Name</label><input className={inputCls} placeholder="Last name" /></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Email</label><input className={inputCls} placeholder="email@example.com" /></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Phone</label><input className={inputCls} placeholder="Phone number" /></div>
        </div>
        <div><label className="mb-1.5 block text-[13px] font-medium">Cover Letter</label><textarea rows={4} className={inputCls+" h-auto py-2"} placeholder="Write your cover letter..." /></div>
        <button type="button" className={btnSoft + " w-full justify-center border-dashed py-6"}><Upload size={16} /> Upload Resume (PDF, DOC)</button>
        <button type="button" className={btnPrimary} onClick={()=>setDone(true)}>Submit Application</button>
        {done && <p className="m-0 inline-flex items-center gap-1 text-[13px] text-[#0ab39c]"><Check size={15} /> Application submitted (demo).</p>}
      </div>
    </div>
  );
}
