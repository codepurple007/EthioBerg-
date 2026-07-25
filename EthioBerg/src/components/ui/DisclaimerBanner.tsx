import { AlertTriangle } from "lucide-react";
import { PRE_REVIEW_DISCLAIMER } from "@/lib/mock/seed-data";

export default function DisclaimerBanner() {
  return (
    <div className="mb-4 flex items-start gap-2 rounded border border-[#f7b84b] bg-[#fef4e4] px-4 py-3">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#b8860b]" />
      <p className="m-0 text-[13px] leading-relaxed text-[#856404]">{PRE_REVIEW_DISCLAIMER}</p>
    </div>
  );
}
