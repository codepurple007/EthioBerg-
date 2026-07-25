"use client";
import { useState } from "react";

const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const items = [
  { name: "Branded T-Shirts", qty: 2, price: "$322.50" },
  { name: "Bentwood Chair", qty: 1, price: "$194.60" },
];

export default function EmailEcommerce() {
  const [coupon, setCoupon] = useState("");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded border border-[#e9ebec] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#405189] to-[#0ab39c] px-6 py-8 text-center text-white">
          <p className="m-0 text-[12px] uppercase tracking-wider opacity-80">Ecommerce</p>
          <h2 className="mt-1 mb-0 text-[22px] font-bold">Your Order is Confirmed!</h2>
        </div>
        <div className="px-6 py-6 text-[14px] text-[#495057]">
          <p className="m-0 mb-4 text-[#878a99]">Hi Alex, thanks for shopping with us. Here is your order summary:</p>
          <table className="mb-4 w-full border-collapse text-left text-[13px]">
            <thead><tr className="border-b border-[#e9ebec] text-[#878a99]">{["Product","Qty","Price"].map(h=><th key={h} className="py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{items.map((it)=>(
              <tr key={it.name} className="border-b border-[#e9ebec]">
                <td className="py-2 font-medium">{it.name}</td><td className="py-2">{it.qty}</td><td className="py-2 font-semibold">{it.price}</td>
              </tr>
            ))}</tbody>
          </table>
          <div className="mb-4 flex justify-between text-[14px] font-semibold"><span>Total</span><span className="text-[#0ab39c]">$517.10</span></div>
          <div className="mb-4 flex gap-2">
            <input className={inputCls} placeholder="Have a coupon?" value={coupon} onChange={(e)=>setCoupon(e.target.value)} />
            <button type="button" className={btnSoft}>Apply</button>
          </div>
          <a href="/apps/ecommerce/order-details" className={btnPrimary + " no-underline"}>Track Order</a>
        </div>
        <div className="border-t border-[#e9ebec] bg-[#f3f6f9] px-6 py-4 text-center text-[12px] text-[#878a99]">Need help? Contact support@themesbrand.com</div>
      </div>
    </div>
  );
}
