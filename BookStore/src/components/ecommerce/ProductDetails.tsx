"use client";
import { useState } from "react";
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const reviews = [
  { name: "Scott Wilson", date: "17 Dec, 2021", rating: 5, text: "Really well made product. Highly recommend." },
  { name: "Sarai Shinks", date: "02 Oct, 2021", rating: 4, text: "Good quality for the price. Arrived quickly." },
  { name: "Tom Hughes", date: "24 Sep, 2021", rating: 5, text: "Perfect fit and soft fabric. Will buy again." },
];

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "reviews">("desc");
  const [liked, setLiked] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="card xl:col-span-4">
        <div className="card-body">
          <div className="mb-4 flex aspect-square items-center justify-center rounded bg-gradient-to-br from-[#e2e5ed] to-[#f3f6f9]">
            <span className="text-[48px] font-bold text-[#405189]">TS</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex aspect-square cursor-pointer items-center justify-center rounded border border-[#e9ebec] bg-[#f3f6f9] text-[12px] font-semibold text-[#405189] hover:border-[#405189]">
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card xl:col-span-8">
        <div className="card-body space-y-4">
          <div>
            <p className="mb-1 text-[12px] font-medium text-[#0ab39c]">Fashion</p>
            <h4 className="m-0 text-[22px] font-semibold text-[#495057]">Branded T-Shirts</h4>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
              <span className="inline-flex items-center gap-1 text-[#f7b84b]"><Star size={14} fill="#f7b84b" /> 4.2 (245 Reviews)</span>
              <span className="rounded bg-[#daf4f0] px-2 py-0.5 text-[11px] font-medium text-[#0ab39c]">In Stock</span>
            </div>
          </div>
          <p className="m-0 text-[13px] leading-relaxed text-[#878a99]">
            Tommy Hilfiger men striped pink sweatshirt. Crafted with cotton. Perfect for everyday wear with a modern slim fit.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="mb-1 text-[12px] text-[#878a99]">Price</p>
              <h3 className="m-0 text-[28px] font-semibold text-[#495057]">
                $161.25 <span className="text-[16px] font-normal text-[#878a99] line-through">$180.00</span>
              </h3>
            </div>
            <div>
              <p className="mb-1 text-[12px] text-[#878a99]">Quantity</p>
              <div className="flex items-center overflow-hidden rounded border border-[#e9ebec]">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="cursor-pointer border-0 bg-[#f3f6f9] px-3 py-2 hover:bg-[#e9ebec]">−</button>
                <span className="min-w-[40px] text-center text-[13px] font-medium">{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="cursor-pointer border-0 bg-[#f3f6f9] px-3 py-2 hover:bg-[#e9ebec]">+</button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary}><ShoppingCart size={15} /> Add to Cart</button>
            <button type="button" onClick={() => setLiked(!liked)} className={btnSoft}>
              <Heart size={15} className={liked ? "fill-[#f06548] text-[#f06548]" : ""} /> Wishlist
            </button>
            <button type="button" className={btnSoft}><Share2 size={15} /> Share</button>
          </div>
          <div className="border-t border-[#e9ebec] pt-2">
            <div className="flex gap-1 border-b border-[#e9ebec]">
              {(["desc", "reviews"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)}
                  className={`cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[13px] font-medium ${tab === t ? "border-[#405189] text-[#405189]" : "border-transparent text-[#878a99]"}`}>
                  {t === "desc" ? "Description" : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>
            {tab === "desc" ? (
              <p className="mt-4 text-[13px] leading-relaxed text-[#878a99]">
                Cotton blend fabric, machine washable, available in multiple sizes. SKU #TB010001. Seller rating 4.8.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div key={r.name} className="rounded border border-[#e9ebec] p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-[#495057]">{r.name}</span>
                      <span className="text-[12px] text-[#878a99]">{r.date}</span>
                    </div>
                    <div className="mb-1 flex gap-0.5 text-[#f7b84b]">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="#f7b84b" />)}</div>
                    <p className="m-0 text-[13px] text-[#878a99]">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
