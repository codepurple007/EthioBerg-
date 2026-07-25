"use client";
import Link from "next/link";

const items = [
  { name: "Branded T-Shirts", price: "$161.25", qty: 2, total: "$322.50" },
  { name: "Noise Evolve Smartwatch", price: "$243.45", qty: 1, total: "$243.45" },
];

export default function OrderDetails() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <div className="card">
          <div className="card-header flex-wrap gap-2">
            <h5 className="card-title">Order #VZ2101</h5>
            <span className="rounded bg-[#daf4f0] px-2 py-0.5 text-[11px] font-medium text-[#0ab39c]">Delivered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Product","Price","Quantity","Total"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.name} className="border-b border-[#e9ebec]">
                    <td className="px-4 py-3 font-medium text-[#405189]">{it.name}</td>
                    <td className="px-4 py-3">{it.price}</td>
                    <td className="px-4 py-3">{it.qty}</td>
                    <td className="px-4 py-3 font-semibold">{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body flex justify-end">
            <div className="w-56 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#878a99]">Sub Total</span><span>$565.95</span></div>
              <div className="flex justify-between"><span className="text-[#878a99]">Discount</span><span className="text-[#0ab39c]">-$25.00</span></div>
              <div className="flex justify-between"><span className="text-[#878a99]">Shipping</span><span>$12.00</span></div>
              <div className="flex justify-between border-t border-[#e9ebec] pt-2 font-semibold text-[#495057]"><span>Total</span><span>$552.95</span></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h5 className="card-title">Order Status</h5></div>
          <div className="card-body">
            <ol className="m-0 space-y-4 border-l-2 border-[#e9ebec] pl-4">
              {[
                ["Order Placed", "15 Feb, 2021 · 10:30 AM", true],
                ["Packed", "15 Feb, 2021 · 02:15 PM", true],
                ["Shipped", "16 Feb, 2021 · 09:00 AM", true],
                ["Delivered", "18 Feb, 2021 · 04:45 PM", true],
              ].map(([t, d, done]) => (
                <li key={String(t)} className="relative">
                  <span className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full ${done ? "bg-[#0ab39c]" : "bg-[#e9ebec]"}`} />
                  <p className="m-0 font-medium text-[#495057]">{t}</p>
                  <p className="m-0 text-[12px] text-[#878a99]">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Customer Details</h5></div>
          <div className="card-body space-y-2 text-[13px]">
            <p className="m-0 font-semibold text-[#495057]">Alex Smith</p>
            <p className="m-0 text-[#878a99]">alexsmith@themesbrand.com</p>
            <p className="m-0 text-[#878a99]">+(123) 456-7890</p>
            <Link href="/apps/ecommerce/customers" className="text-[#405189] no-underline hover:underline">View Customer</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h5 className="card-title">Shipping Address</h5></div>
          <div className="card-body text-[13px] text-[#878a99]">
            <p className="m-0">305 S San Gabriel Blvd,</p>
            <p className="m-0">San Gabriel,</p>
            <p className="m-0">CA 91776, USA</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h5 className="card-title">Payment</h5></div>
          <div className="card-body text-[13px]">
            <p className="m-0 text-[#878a99]">Mastercard ending •••• 4242</p>
            <p className="mt-1 mb-0 font-medium text-[#0ab39c]">Paid</p>
          </div>
        </div>
      </div>
    </div>
  );
}
