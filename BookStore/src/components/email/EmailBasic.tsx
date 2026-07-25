"use client";
import { useState } from "react";

const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function EmailBasic() {
  const [subject, setSubject] = useState("Velzon - Admin Dashboard");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded border border-[#e9ebec] bg-white shadow-sm">
        <div className="bg-[#405189] px-6 py-8 text-center text-white">
          <h2 className="m-0 text-[24px] font-bold tracking-wide">VELZON</h2>
          <p className="mt-2 mb-0 text-[13px] opacity-80">Admin & Dashboard Template</p>
        </div>
        <div className="space-y-4 px-6 py-8 text-[14px] leading-relaxed text-[#495057]">
          <p className="m-0">Hello, <strong>Edward</strong></p>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#878a99]">Subject</label>
            <input className={inputCls} value={subject} onChange={(e)=>setSubject(e.target.value)} />
          </div>
          <p className="m-0 text-[#878a99]">
            Thank you for purchasing Velzon Admin Template. Your order has been confirmed and will be delivered soon.
            If you have any questions, feel free to reply to this email.
          </p>
          <div className="rounded border border-[#e9ebec] bg-[#f3f6f9] p-4 text-[13px]">
            <div className="flex justify-between border-b border-[#e9ebec] pb-2 mb-2"><span className="text-[#878a99]">Order ID</span><span className="font-medium">#VZ2101</span></div>
            <div className="flex justify-between"><span className="text-[#878a99]">Amount</span><span className="font-semibold text-[#0ab39c]">$49.00</span></div>
          </div>
          <a href="#" className={btnPrimary + " no-underline"}>View Order</a>
        </div>
        <div className="border-t border-[#e9ebec] bg-[#f3f6f9] px-6 py-4 text-center text-[12px] text-[#878a99]">
          © 2021 Themesbrand. All rights reserved.
        </div>
      </div>
    </div>
  );
}
