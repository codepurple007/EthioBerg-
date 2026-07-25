"use client";
import { useState } from "react";
import { Upload, Save } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

export default function NftCreate() {
  const [form, setForm] = useState({ title: "", desc: "", price: "", collection: "Artworks", royalties: "10" });
  const [created, setCreated] = useState(false);
  const set = (k: string, v: string) => setForm((f)=>({...f,[k]:v}));
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-8">
        <div className="card-header"><h5 className="card-title">Create New Item</h5></div>
        <div className="card-body space-y-4">
          <button type="button" className={btnSoft + " w-full justify-center border-dashed py-12"}><Upload size={20} /> Upload File (Image, Video, Audio)</button>
          <div><label className="mb-1.5 block text-[13px] font-medium">Item Name</label><input className={inputCls} value={form.title} onChange={(e)=>set("title",e.target.value)} placeholder="e.g. Abstract Art #21" /></div>
          <div><label className="mb-1.5 block text-[13px] font-medium">Description</label><textarea rows={4} className={inputCls+" h-auto py-2"} value={form.desc} onChange={(e)=>set("desc",e.target.value)} placeholder="Provide a detailed description..." /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="mb-1.5 block text-[13px] font-medium">Price (ETH)</label><input className={inputCls} value={form.price} onChange={(e)=>set("price",e.target.value)} placeholder="0.00" /></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Collection</label><select className={selectCls} value={form.collection} onChange={(e)=>set("collection",e.target.value)}><option>Artworks</option><option>Crypto Card</option><option>Anime Kingdom</option></select></div>
            <div><label className="mb-1.5 block text-[13px] font-medium">Royalties %</label><input className={inputCls} value={form.royalties} onChange={(e)=>set("royalties",e.target.value)} /></div>
          </div>
          <button type="button" className={btnPrimary} onClick={()=>setCreated(true)}><Save size={15} /> Create Item</button>
          {created && <p className="m-0 text-[13px] text-[#0ab39c]">NFT created (demo).</p>}
        </div>
      </div>
      <div className="card xl:col-span-4">
        <div className="card-header"><h5 className="card-title">Preview</h5></div>
        <div className="card-body">
          <div className="mb-3 flex h-40 items-center justify-center rounded bg-[#e2e5ed] text-[28px] font-bold text-[#405189]">{(form.title||"NF").slice(0,2)}</div>
          <p className="m-0 font-semibold text-[#495057]">{form.title || "Untitled Item"}</p>
          <p className="mt-1 mb-0 text-[13px] text-[#0ab39c]">{form.price ? `${form.price} ETH` : "— ETH"}</p>
        </div>
      </div>
    </div>
  );
}
