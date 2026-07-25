import { AlertTriangle, ArrowRight } from "lucide-react";

export default function UpgradeCard() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 bg-[#fef4e4] px-5 py-2.5">
        <p className="m-0 flex items-center gap-2 text-[13px] font-medium text-[#d29c36]">
          <AlertTriangle size={15} className="shrink-0 text-[#f7b84b]" />
          <span>
            Your free trial expired in <b>17</b> days.
          </span>
        </p>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[#d29c36] hover:underline"
        >
          Upgrade
        </button>
      </div>

      <div className="card-body flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h5 className="mb-3 text-[15px] font-semibold leading-snug text-[#495057]">
            Upgrade your plan from a <b>Free trial</b>, to &apos;
            <b>Premium Plan</b>&apos;{" "}
            <ArrowRight
              size={16}
              className="relative top-0.5 inline text-[#405189]"
            />
          </h5>
          <button
            type="button"
            className="cursor-pointer rounded border-0 bg-[#0ab39c] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            Upgrade Account!
          </button>
        </div>

        <div className="flex shrink-0 justify-center sm:w-[150px]">
          <svg viewBox="0 0 180 150" width="150" height="130" aria-hidden>
            <ellipse cx="90" cy="138" rx="55" ry="8" fill="#e9ebec" />

            {/* Books */}
            <rect x="18" y="108" width="42" height="14" rx="2" fill="#405189" />
            <rect x="22" y="96" width="38" height="12" rx="2" fill="#0ab39c" />
            <rect x="26" y="85" width="34" height="11" rx="2" fill="#f7b84b" />
            <rect x="30" y="75" width="30" height="10" rx="2" fill="#299cdb" />

            {/* Microscope */}
            <rect x="145" y="95" width="8" height="28" rx="2" fill="#878a99" />
            <ellipse cx="149" cy="92" rx="12" ry="5" fill="#adb5bd" />
            <circle cx="149" cy="78" r="8" fill="#405189" />
            <circle cx="149" cy="78" r="4" fill="#c5d0e6" />

            {/* Atom */}
            <ellipse
              cx="58"
              cy="55"
              rx="16"
              ry="7"
              fill="none"
              stroke="#f06548"
              strokeWidth="1.5"
            />
            <ellipse
              cx="58"
              cy="55"
              rx="7"
              ry="16"
              fill="none"
              stroke="#405189"
              strokeWidth="1.5"
            />
            <circle cx="58" cy="55" r="3" fill="#0ab39c" />

            {/* Person sitting */}
            <circle cx="105" cy="42" r="13" fill="#f5d0c5" />
            <path d="M93 38c3-9 12-12 20-8 4 2 6 7 5 12" fill="#2c2c2c" />
            <path
              d="M80 72c6-16 18-20 28-16 12 4 18 18 16 32l-6 28H78l2-44z"
              fill="#405189"
            />
            <path d="M78 112c8 10 28 12 40 2l-4 14H82z" fill="#3577f1" />

            {/* Laptop */}
            <rect x="88" y="70" width="40" height="24" rx="2" fill="#ced4da" />
            <rect x="91" y="73" width="34" height="18" rx="1" fill="#212529" />
            <rect x="84" y="94" width="48" height="4" rx="1" fill="#adb5bd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
