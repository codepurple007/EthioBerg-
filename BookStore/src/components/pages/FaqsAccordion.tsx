"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does it work?",
    a: "Velzon is a full-featured admin template with dashboards, apps, and pages. Install dependencies, run the next.js app, and customize components to fit your product.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. Themesbrand offers a 14-day refund policy for eligible purchases if the product does not meet your expectations.",
  },
  {
    q: "What is your shipping policy?",
    a: "Digital products are delivered instantly after purchase via download links in your customer account.",
  },
  {
    q: "Where are you located?",
    a: "Themesbrand is a global design team shipping admin templates used by thousands of developers worldwide.",
  },
  {
    q: "Do you offer technical support?",
    a: "Yes. Support is available through the Themesbrand support portal for all licensed customers.",
  },
];

export default function FaqsAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">General Questions</h5>
      </div>
      <div className="card-body space-y-2">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded border border-[#e9ebec]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between border-0 bg-[#f3f3f9] px-4 py-3 text-left text-[13px] font-medium text-[#495057]"
              >
                {f.q}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#878a99] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="bg-white px-4 py-3 text-[13px] leading-relaxed text-[#878a99]">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
