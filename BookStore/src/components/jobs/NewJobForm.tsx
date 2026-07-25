"use client";
import { useState } from "react";
import { Save } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function NewJobForm() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Job Details</h5></div>
        <div className="card-body space-y-4">
          <div><label className="mb-1.5 block text-[13px] font-medium">Job Title</label><input className={inputCls} placeholder="e.g. React Developer" /></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Job Description</label><textarea rows={5} className={inputCls+" h-auto py-2"} placeholder="Describe the role..." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-[13px] font-medium">Job Type</label><select className={selectCls}><option>Full Time</option><option>Part Time</option><option>Freelance</option><option>Remote</option></select></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Experience</label><select className={selectCls}><option>0-1 Years</option><option>1-2 Years</option><option>2-5 Years</option><option>5+ Years</option></select></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Location</label><input className={inputCls} placeholder="City, Country" /></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Salary Range</label><input className={inputCls} placeholder="$40k - $60k" /></div>
          </div>
        </div>
      </div>
      <div className="card xl:col-span-4">
        <div className="card-header"><h5 className="card-title">Publish</h5></div>
        <div className="card-body space-y-4">
          <div><label className="mb-1.5 block text-[13px] font-medium">Status</label><select className={selectCls}><option>Active</option><option>Draft</option><option>Close</option></select></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Category</label><select className={selectCls}><option>Business</option><option>Design</option><option>Development</option><option>Marketing</option></select></div>
          <button type="button" className={btnPrimary + " w-full justify-center"} onClick={()=>setSaved(true)}><Save size={15} /> Create Job</button>
          {saved && <p className="m-0 text-[13px] text-[#0ab39c]">Job created (demo).</p>}
        </div>
      </div>
    </div>
  );
}
