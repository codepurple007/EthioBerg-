"use client";
import { Wallet } from "lucide-react";

const wallets = [
  { coin: "Bitcoin", symbol: "BTC", balance: "0.4825 BTC", usd: "$22,614.52", color: "#f7b84b" },
  { coin: "Ethereum", symbol: "ETH", balance: "12.45 ETH", usd: "$38,625.50", color: "#405189" },
  { coin: "Litecoin", symbol: "LTC", balance: "48.20 LTC", usd: "$4,304.26", color: "#299cdb" },
  { coin: "Tether", symbol: "USDT", balance: "5,420 USDT", usd: "$5,420.00", color: "#0ab39c" },
];

export default function CryptoWallet() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {wallets.map((w) => (
          <div key={w.symbol} className="card">
            <div className="card-body">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="mb-1 text-[13px] text-[#878a99]">{w.coin}</p>
                  <h4 className="m-0 text-[18px] font-semibold text-[#495057]">{w.balance}</h4>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: w.color + "22" }}>
                  <Wallet size={18} style={{ color: w.color }} />
                </div>
              </div>
              <p className="m-0 text-[13px] font-medium text-[#495057]">{w.usd}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><h5 className="card-title">Recent Activity</h5></div>
        <div className="card-body space-y-3 text-[13px]">
          {[
            ["Received 0.05 BTC", "24 Dec, 2021", "+$2,342", true],
            ["Sent 0.8 ETH", "23 Dec, 2021", "-$2,482", false],
            ["Bought 100 USDT", "22 Dec, 2021", "-$100", false],
          ].map(([t, d, a, up]) => (
            <div key={String(t)} className="flex items-center justify-between border-b border-[#e9ebec] pb-3 last:border-0 last:pb-0">
              <div>
                <p className="m-0 font-medium text-[#495057]">{t}</p>
                <p className="m-0 text-[12px] text-[#878a99]">{d}</p>
              </div>
              <span className={`font-semibold ${up ? "text-[#0ab39c]" : "text-[#f06548]"}`}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
