"use client";
import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

type CartItem = { id: string; name: string; price: number; qty: number; color: string };

const initial: CartItem[] = [
  { id: "1", name: "Branded T-Shirts", price: 161.25, qty: 2, color: "#405189" },
  { id: "2", name: "Bentwood Chair", price: 194.6, qty: 1, color: "#0ab39c" },
  { id: "3", name: "Noise Evolve Smartwatch", price: 243.45, qty: 1, color: "#f7b84b" },
];

export default function CartView() {
  const [items, setItems] = useState(initial);
  const setQty = (id: string, qty: number) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = 25;
  const tax = sub * 0.08;
  const total = sub - discount + tax;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Shopping Cart</h5></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-[13px]">
            <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Product","Price","Quantity","Total","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-[#e9ebec]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded text-[12px] font-bold text-white" style={{ background: it.color }}>{it.name.slice(0,2)}</div>
                      <span className="font-medium text-[#495057]">{it.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">${it.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex overflow-hidden rounded border border-[#e9ebec]">
                      <button type="button" onClick={() => setQty(it.id, it.qty - 1)} className="cursor-pointer border-0 bg-[#f3f6f9] px-2 py-1">−</button>
                      <span className="min-w-[32px] px-2 py-1 text-center">{it.qty}</span>
                      <button type="button" onClick={() => setQty(it.id, it.qty + 1)} className="cursor-pointer border-0 bg-[#f3f6f9] px-2 py-1">+</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">${(it.price * it.qty).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => remove(it.id)} className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#f06548] hover:bg-[#fde8e4]"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card xl:col-span-4">
        <div className="card-header"><h5 className="card-title">Order Summary</h5></div>
        <div className="card-body space-y-3 text-[13px]">
          <div className="flex justify-between"><span className="text-[#878a99]">Sub Total</span><span>${sub.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-[#878a99]">Discount</span><span className="text-[#0ab39c]">-${discount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-[#878a99]">Estimated Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-[#e9ebec] pt-3 text-[15px] font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link href="/apps/ecommerce/checkout" className={btnPrimary + " w-full justify-center no-underline"}>Proceed to Checkout</Link>
          <Link href="/apps/ecommerce/products" className={btnSoft + " w-full justify-center no-underline"}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
