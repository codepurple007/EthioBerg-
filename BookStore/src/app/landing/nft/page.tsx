import Link from "next/link";
import { ArrowRight, Hexagon, Wallet, Layers } from "lucide-react";
import AuthBrand from "@/components/auth/AuthBrand";

export const metadata = {
  title: "NFT Landing | Velzon",
};

const drops = [
  { title: "Abstract Wave #21", bid: "1.24 ETH", color: "#405189" },
  { title: "Neon Cube #08", bid: "0.86 ETH", color: "#0ab39c" },
  { title: "Pixel Fox #77", bid: "2.10 ETH", color: "#f7b84b" },
  { title: "Crystal Orb #03", bid: "1.55 ETH", color: "#f06548" },
];

export default function NftLandingPage() {
  return (
    <div className="min-h-screen bg-[#212529] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <AuthBrand light />
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-[13px] text-white/70 no-underline hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/"
              className="rounded bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white no-underline"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <p className="m-0 mb-2 text-[12px] tracking-widest text-[#0ab39c] uppercase">
            NFT Marketplace
          </p>
          <h1 className="m-0 text-4xl font-bold leading-tight sm:text-5xl">
            Discover, collect &amp; sell extraordinary NFTs
          </h1>
          <p className="mt-4 mb-8 max-w-md text-[14px] text-white/60">
            Explore trending collections and exclusive drops on the Velzon NFT
            marketplace experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded bg-[#405189] px-5 py-2.5 text-[13px] font-medium no-underline"
            >
              Explore <ArrowRight size={16} />
            </Link>
            <Link
              href="/pages/gallery"
              className="inline-flex items-center gap-2 rounded border border-white/20 px-5 py-2.5 text-[13px] font-medium no-underline hover:bg-white/5"
            >
              Create NFT
            </Link>
          </div>
          <div className="mt-8 flex gap-6 text-[13px]">
            {[
              { icon: Hexagon, label: "Collections", value: "2.4k+" },
              { icon: Layers, label: "Items", value: "48k+" },
              { icon: Wallet, label: "Artists", value: "9k+" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center gap-1.5 text-white/50">
                  <s.icon size={14} /> {s.label}
                </div>
                <div className="mt-1 text-lg font-semibold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {drops.map((d) => (
            <div
              key={d.title}
              className="overflow-hidden rounded-lg border border-white/10 bg-white/5"
            >
              <div
                className="aspect-square"
                style={{
                  background: `linear-gradient(145deg, ${d.color}, ${d.color}66)`,
                }}
              />
              <div className="p-3">
                <p className="m-0 text-[13px] font-medium">{d.title}</p>
                <p className="mt-1 mb-0 text-[12px] text-[#0ab39c]">
                  Current bid {d.bid}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-[12px] text-white/40">
        © {new Date().getFullYear()} Velzon NFT. Themesbrand.
      </footer>
    </div>
  );
}
