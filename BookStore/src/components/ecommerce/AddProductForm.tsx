"use client";
import { useState } from "react";
import { Save, X } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: "", category: "Fashion", price: "", stock: "", description: "", status: "Published",
  });
  const [saved, setSaved] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Product Information</h5></div>
        <div className="card-body space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Product Title</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Enter product title" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Product Description</label>
            <textarea rows={5} className={inputCls + " h-auto py-2"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Enter product description" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Category</label>
              <select className={selectCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {["Fashion", "Furniture", "Electronics", "Footwear", "Accessories"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Status</label>
              <select className={selectCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option>Published</option><option>Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <div className="card">
          <div className="card-header"><h5 className="card-title">Pricing & Stock</h5></div>
          <div className="card-body space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Price ($)</label>
              <input className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#495057]">Stock</label>
              <input className={inputCls} value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={() => setSaved(true)}><Save size={15} /> Submit</button>
            <button type="button" className={btnSoft} onClick={() => { setForm({ name: "", category: "Fashion", price: "", stock: "", description: "", status: "Published" }); setSaved(false); }}><X size={15} /> Discard</button>
          </div>
          {saved && <p className="m-0 px-4 pb-4 text-[13px] text-[#0ab39c]">Product saved (demo).</p>}
        </div>
      </div>
    </div>
  );
}
