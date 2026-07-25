"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

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

export default function NftMarketplace() {
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState<number[]>([]);
  const list = nfts.filter((n) => !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.creator.toLowerCase().includes(query.toLowerCase()));
  const toggle = (id: number) => setLiked((p) => p.includes(id) ? p.filter((x)=>x!==id) : [...p, id]);

  return (
    <div className="space-y-4">
      <div className="card"><div className="card-body">
        <div className="relative max-w-md">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search marketplace..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" />
        </div>
      </div></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((n) => (
          <div key={n.id} className="card overflow-hidden">
            <div className="relative flex h-40 items-center justify-center" style={{ background: `linear-gradient(135deg, ${n.color}33, ${n.color}11)` }}>
              <span className="text-[32px] font-bold" style={{ color: n.color }}>{n.title.slice(0,2)}</span>
              <button type="button" onClick={()=>toggle(n.id)} className="absolute top-2 right-2 cursor-pointer rounded-full border-0 bg-white/90 p-1.5 shadow">
                <Heart size={14} className={liked.includes(n.id) ? "fill-[#f06548] text-[#f06548]" : "text-[#878a99]"} />
              </button>
            </div>
            <div className="card-body">
              <Link href="/apps/nft/item-details" className="font-semibold text-[#405189] no-underline hover:underline">{n.title}</Link>
              <p className="m-0 mt-1 text-[12px] text-[#878a99]">by {n.creator}</p>
              <div className="mt-3 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#0ab39c]">{n.price}</span>
                <span className="text-[#878a99]">{n.likes} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
