"use client";
import { useState } from "react";
import { CreditCard, Check } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("card");
  const [done, setDone] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Checkout Steps</h5></div>
          <div className="card-body">
            <div className="mb-6 flex flex-wrap gap-2">
              {["Personal Info", "Shipping", "Payment"].map((label, i) => (
                <button key={label} type="button" onClick={() => setStep(i + 1)}
                  className={`cursor-pointer rounded border px-3 py-1.5 text-[13px] font-medium ${step === i + 1 ? "border-[#405189] bg-[#405189] text-white" : "border-[#e9ebec] bg-white text-[#878a99]"}`}>
                  {i + 1}. {label}
                </button>
              ))}
            </div>
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-[13px] font-medium">First Name</label><input className={inputCls} defaultValue="Alex" /></div>
                <div><label className="mb-1.5 block text-[13px] font-medium">Last Name</label><input className={inputCls} defaultValue="Smith" /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[13px] font-medium">Email</label><input className={inputCls} defaultValue="alexsmith@themesbrand.com" /></div>
                <div className="sm:col-span-2"><label className="mb-1.5 block text-[13px] font-medium">Phone</label><input className={inputCls} defaultValue="+(123) 456-7890" /></div>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-4">
                <div><label className="mb-1.5 block text-[13px] font-medium">Address</label><input className={inputCls} defaultValue="305 S San Gabriel Blvd" /></div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><label className="mb-1.5 block text-[13px] font-medium">City</label><input className={inputCls} defaultValue="San Gabriel" /></div>
                  <div><label className="mb-1.5 block text-[13px] font-medium">State</label><input className={inputCls} defaultValue="CA" /></div>
                  <div><label className="mb-1.5 block text-[13px] font-medium">Zip</label><input className={inputCls} defaultValue="91776" /></div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[["card","Credit / Debit Card"],["paypal","PayPal"],["cod","Cash on Delivery"]].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setMethod(id)}
                      className={`cursor-pointer rounded border px-3 py-2 text-[13px] ${method === id ? "border-[#0ab39c] bg-[#daf4f0] text-[#0ab39c]" : "border-[#e9ebec] text-[#495057]"}`}>{label}</button>
                  ))}
                </div>
                {method === "card" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><label className="mb-1.5 block text-[13px] font-medium">Card Number</label><input className={inputCls} placeholder="xxxx xxxx xxxx xxxx" /></div>
                    <div><label className="mb-1.5 block text-[13px] font-medium">Expiry</label><input className={inputCls} placeholder="MM/YY" /></div>
                    <div><label className="mb-1.5 block text-[13px] font-medium">CVV</label><input className={inputCls} placeholder="xxx" /></div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {step > 1 && <button type="button" className={btnSoft} onClick={() => setStep(step - 1)}>Back</button>}
              {step < 3 ? (
                <button type="button" className={btnPrimary} onClick={() => setStep(step + 1)}>Continue</button>
              ) : (
                <button type="button" className={btnPrimary} onClick={() => setDone(true)}><CreditCard size={15} /> Place Order</button>
              )}
            </div>
            {done && <p className="mt-3 mb-0 inline-flex items-center gap-1 text-[13px] text-[#0ab39c]"><Check size={15} /> Order placed successfully (demo).</p>}
          </div>
        </div>
      </div>
      <div className="card xl:col-span-4">
        <div className="card-header"><h5 className="card-title">Order Summary</h5></div>
        <div className="card-body space-y-2 text-[13px]">
          <div className="flex justify-between"><span>Branded T-Shirts × 2</span><span>$322.50</span></div>
          <div className="flex justify-between"><span>Bentwood Chair × 1</span><span>$194.60</span></div>
          <div className="flex justify-between border-t border-[#e9ebec] pt-2 font-semibold"><span>Total</span><span>$517.10</span></div>
        </div>
      </div>
    </div>
  );
}
