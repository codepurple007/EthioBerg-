"use client";
import Link from "next/link";

const collections = [
  { name: "Artworks", items: 1245, creators: 320, volume: "1,245 ETH", color: "#405189" },
  { name: "Crypto Card", items: 890, creators: 156, volume: "780 ETH", color: "#0ab39c" },
  { name: "Anime Kingdom", items: 2100, creators: 445, volume: "2,340 ETH", color: "#f7b84b" },
  { name: "Meta Heroes", items: 567, creators: 98, volume: "512 ETH", color: "#f06548" },
  { name: "Space Cats", items: 334, creators: 67, volume: "298 ETH", color: "#299cdb" },
  { name: "Pixel Worlds", items: 1560, creators: 210, volume: "1,890 ETH", color: "#6559cc" },
];

export default function NftCollections() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {collections.map((c) => (
        <div key={c.name} className="card">
          <div className="h-24" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}88)` }} />
          <div className="card-body">
            <div className="-mt-10 mb-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-[14px] font-bold text-white" style={{ background: c.color }}>{c.name.slice(0,2)}</div>
            <Link href="/apps/nft/item-details" className="text-[15px] font-semibold text-[#405189] no-underline hover:underline">{c.name}</Link>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px]">
              <div><p className="m-0 text-[#878a99]">Items</p><p className="m-0 font-semibold text-[#495057]">{c.items}</p></div>
              <div><p className="m-0 text-[#878a99]">Creators</p><p className="m-0 font-semibold text-[#495057]">{c.creators}</p></div>
              <div><p className="m-0 text-[#878a99]">Volume</p><p className="m-0 font-semibold text-[#0ab39c]">{c.volume}</p></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
