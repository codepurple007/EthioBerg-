"use client";
import { useState } from "react";
import { Wallet, Copy, Check } from "lucide-react";

const wallets = [
  { name: "MetaMask", address: "0x3f8a...9c2d", balance: "12.45 ETH", color: "#f7b84b" },
  { name: "Coinbase", address: "0x7b1e...4a8f", balance: "3.20 ETH", color: "#299cdb" },
  { name: "WalletConnect", address: "0x9d2c...1e5b", balance: "0.88 ETH", color: "#405189" },
];

export default function NftWallet() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (a: string) => { setCopied(a); setTimeout(() => setCopied(null), 1500); };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {wallets.map((w) => (
        <div key={w.name} className="card">
          <div className="card-body">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: w.color + "22" }}>
              <Wallet size={22} style={{ color: w.color }} />
            </div>
            <h5 className="m-0 text-[15px] font-semibold text-[#495057]">{w.name}</h5>
            <p className="mt-1 mb-3 text-[20px] font-semibold text-[#0ab39c]">{w.balance}</p>
            <button type="button" onClick={() => copy(w.address)} className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-[#f3f6f9] px-2.5 py-1.5 text-[12px] text-[#495057] hover:bg-white">
              {copied === w.address ? <Check size={12} className="text-[#0ab39c]" /> : <Copy size={12} />}
              {w.address}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
