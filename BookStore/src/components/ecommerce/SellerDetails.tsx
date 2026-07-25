"use client";
import { Star, MapPin, Mail, Phone } from "lucide-react";

const products = [
  { name: "Branded T-Shirts", price: "$161.25", stock: 12 },
  { name: "Off White Disc", price: "$122.20", stock: 6 },
  { name: "Ribbed Soft Cotton", price: "$120.32", stock: 7 },
  { name: "Sport Shoes", price: "$94.99", stock: 15 },
];

export default function SellerDetails() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-4">
        <div className="card-body text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#405189] text-[22px] font-bold text-white">FM</div>
          <h5 className="m-0 text-[16px] font-semibold text-[#495057]">Force Medicines</h5>
          <p className="mt-1 mb-3 text-[13px] text-[#878a99]">Since 2010 · Verified Seller</p>
          <div className="mb-4 inline-flex items-center gap-1 text-[#f7b84b]"><Star size={14} fill="#f7b84b" /> 4.5 (1,852 reviews)</div>
          <div className="space-y-2 text-left text-[13px]">
            <p className="m-0 flex items-center gap-2 text-[#878a99]"><MapPin size={14} /> Phoenix, USA</p>
            <p className="m-0 flex items-center gap-2 text-[#878a99]"><Mail size={14} /> force@themesbrand.com</p>
            <p className="m-0 flex items-center gap-2 text-[#878a99]"><Phone size={14} /> +(253) 12345 67890</p>
          </div>
        </div>
      </div>
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Seller Products</h5></div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Product","Price","Stock"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name} className="border-b border-[#e9ebec]">
                  <td className="px-4 py-3 font-medium text-[#405189]">{p.name}</td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
