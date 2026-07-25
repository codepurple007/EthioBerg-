"use client";
import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function CryptoKyc() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card">
        <div className="card-header"><h5 className="card-title">KYC Verification</h5></div>
        <div className="card-body">
          <div className="mb-6 flex flex-wrap gap-2">
            {["Personal Info","Document","Selfie","Review"].map((l,i)=>(
              <button key={l} type="button" onClick={()=>setStep(i+1)} className={`cursor-pointer rounded border px-3 py-1.5 text-[13px] font-medium ${step===i+1?"border-[#405189] bg-[#405189] text-white":"border-[#e9ebec] text-[#878a99]"}`}>{i+1}. {l}</button>
            ))}
          </div>
          {step===1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-[13px] font-medium">First Name</label><input className={inputCls} placeholder="First name" /></div>
              <div><label className="mb-1.5 block text-[13px] font-medium">Last Name</label><input className={inputCls} placeholder="Last name" /></div>
              <div className="sm:col-span-2"><label className="mb-1.5 block text-[13px] font-medium">Date of Birth</label><input type="date" className={inputCls} /></div>
              <div className="sm:col-span-2"><label className="mb-1.5 block text-[13px] font-medium">Country</label><select className={selectCls}><option>United States</option><option>United Kingdom</option><option>Germany</option><option>Canada</option></select></div>
            </div>
          )}
          {step===2 && (
            <div className="space-y-4">
              <div><label className="mb-1.5 block text-[13px] font-medium">Document Type</label><select className={selectCls}><option>Passport</option><option>ID Card</option><option>Driver License</option></select></div>
              <button type="button" className={btnSoft + " w-full justify-center border-dashed py-8"}><Upload size={18} /> Upload Document</button>
            </div>
          )}
          {step===3 && (
            <button type="button" className={btnSoft + " w-full justify-center border-dashed py-12"}><Upload size={18} /> Upload Selfie with Document</button>
          )}
          {step===4 && (
            <div className="rounded border border-[#e9ebec] bg-[#f3f6f9] p-4 text-[13px] text-[#878a99]">
              Please review your information. Submitting will start verification (usually 1–2 business days).
            </div>
          )}
          <div className="mt-6 flex gap-2">
            {step>1 && <button type="button" className={btnSoft} onClick={()=>setStep(step-1)}>Back</button>}
            {step<4 ? <button type="button" className={btnPrimary} onClick={()=>setStep(step+1)}>Continue</button>
              : <button type="button" className={btnPrimary} onClick={()=>setSubmitted(true)}>Submit KYC</button>}
          </div>
          {submitted && <p className="mt-3 mb-0 inline-flex items-center gap-1 text-[13px] text-[#0ab39c]"><CheckCircle2 size={15} /> KYC submitted (demo).</p>}
        </div>
      </div>
    </div>
  );
}
