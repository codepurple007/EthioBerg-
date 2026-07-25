"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

const nfts = [
  { id: 1, title: "Abstract Art", creator: "Artistic", price: "4.32 ETH", likes: 142, category: "Art", color: "#405189" },
  { id: 2, title: "Crystal Cube", creator: "Xena Ward", price: "2.15 ETH", likes: 89, category: "3D Art", color: "#0ab39c" },
  { id: 3, title: "Cute Cub", creator: "Zozoic", price: "1.80 ETH", likes: 210, category: "Art", color: "#f7b84b" },
  { id: 4, title: "Funky Toad", creator: "Themesbrand", price: "3.50 ETH", likes: 56, category: "Music", color: "#f06548" },
  { id: 5, title: "Robotic Body", creator: "PixelForge", price: "5.00 ETH", likes: 178, category: "Games", color: "#299cdb" },
  { id: 6, title: "Space Owl", creator: "NFTeam", price: "1.25 ETH", likes: 94, category: "Photography", color: "#6559cc" },
  { id: 7, title: "Neon Mask", creator: "Artistic", price: "2.90 ETH", likes: 133, category: "Art", color: "#405189" },
  { id: 8, title: "Pixel Knight", creator: "GameDev", price: "0.95 ETH", likes: 67, category: "Games", color: "#0ab39c" },
];

const cats = ["All","Art","Music","Games","3D Art","Photography"] as const;
export default function NftExplore() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [sort, setSort] = useState("Popular");
  const list = useMemo(() => {
    let x = nfts.filter((n) => cat === "All" || n.category === cat);
    if (sort === "Price High") x = [...x].sort((a,b)=>parseFloat(b.price)-parseFloat(a.price));
    if (sort === "Price Low") x = [...x].sort((a,b)=>parseFloat(a.price)-parseFloat(b.price));
    return x;
  }, [cat, sort]);

  return (
    <div className="space-y-4">
      <div className="card"><div className="card-body flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {cats.map((c)=><button key={c} type="button" onClick={()=>setCat(c)} className={`cursor-pointer rounded border px-3 py-1.5 text-[13px] font-medium ${cat===c?"border-[#405189] bg-[#405189] text-white":"border-[#e9ebec] text-[#878a99]"}`}>{c}</button>)}
        </div>
        <select className={selectCls + " ml-auto w-auto"} value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option>Popular</option><option>Price High</option><option>Price Low</option>
        </select>
      </div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((n)=>(
          <div key={n.id} className="card">
            <div className="flex h-36 items-center justify-center rounded-t" style={{ background: n.color + "22" }}>
              <span className="text-[28px] font-bold" style={{ color: n.color }}>{n.title.slice(0,2)}</span>
            </div>
            <div className="card-body">
              <Link href="/apps/nft/item-details" className="font-semibold text-[#405189] no-underline hover:underline">{n.title}</Link>
              <p className="m-0 mt-1 text-[12px] text-[#878a99]">{n.category}</p>
              <p className="mt-2 mb-0 font-semibold text-[#0ab39c]">{n.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
