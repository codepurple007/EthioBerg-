"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, DollarSign } from "lucide-react";

type Deal = {
  id: string;
  title: string;
  amount: string;
  company: string;
  date: string;
  probability: number;
  contact: string;
};

type Stage = {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
};

const initialStages: Stage[] = [
  {
    id: "lead",
    title: "Lead Incoming",
    color: "#299cdb",
    deals: [
      {
        id: "1",
        title: "Managing Sales Team Meeting",
        amount: "$4,500",
        company: "Themesbrand",
        date: "01 Jan, 2022",
        probability: 80,
        contact: "Erica Kernan",
      },
      {
        id: "2",
        title: "Annual Billing Subscription",
        amount: "$12,000",
        company: "Nazox",
        date: "05 Jan, 2022",
        probability: 65,
        contact: "Alexis Clarke",
      },
    ],
  },
  {
    id: "contacted",
    title: "Contacted",
    color: "#f7b84b",
    deals: [
      {
        id: "3",
        title: "SASS Tools Marketplace",
        amount: "$8,750",
        company: "Skote",
        date: "10 Jan, 2022",
        probability: 55,
        contact: "James Morris",
      },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    color: "#405189",
    deals: [
      {
        id: "4",
        title: "Admin Dashboard License",
        amount: "$3,200",
        company: "Minible",
        date: "12 Jan, 2022",
        probability: 70,
        contact: "Nancy Martino",
      },
      {
        id: "5",
        title: "Enterprise Support Plan",
        amount: "$15,400",
        company: "Velzon",
        date: "14 Jan, 2022",
        probability: 85,
        contact: "Tonya Johnson",
      },
    ],
  },
  {
    id: "proposal",
    title: "Negotiation",
    color: "#f06548",
    deals: [
      {
        id: "6",
        title: "UI Kit Bundle",
        amount: "$2,100",
        company: "Doot",
        date: "16 Jan, 2022",
        probability: 40,
        contact: "Michael Morris",
      },
    ],
  },
  {
    id: "won",
    title: "Won",
    color: "#0ab39c",
    deals: [
      {
        id: "7",
        title: "Multi-year Contract",
        amount: "$48,000",
        company: "Themesbrand",
        date: "20 Dec, 2021",
        probability: 100,
        contact: "Herbert Stokes",
      },
    ],
  },
];

export default function CrmDeals() {
  const [stages, setStages] = useState(initialStages);

  const addDeal = (stageId: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.id === stageId
          ? {
              ...s,
              deals: [
                ...s.deals,
                {
                  id: String(Date.now()),
                  title: "New Deal",
                  amount: "$1,000",
                  company: "New Company",
                  date: "Today",
                  probability: 50,
                  contact: "Me",
                },
              ],
            }
          : s,
      ),
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-3">
          {stages.map((s) => (
            <div
              key={s.id}
              className="rounded border border-[#e9ebec] bg-white px-3 py-2 text-[12px]"
            >
              <span className="text-[#878a99]">{s.title}: </span>
              <span className="font-semibold text-[#495057]">
                {s.deals.length}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white"
        >
          <Plus size={14} /> Create Deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="w-[280px] shrink-0 rounded border border-[#e9ebec] bg-[#f3f3f9]"
          >
            <div className="flex items-center justify-between border-b border-[#e9ebec] px-3 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: stage.color }}
                />
                <span className="text-[13px] font-semibold text-[#495057]">
                  {stage.title}
                </span>
                <span className="rounded bg-white px-1.5 text-[11px] text-[#878a99]">
                  {stage.deals.length}
                </span>
              </div>
              <button type="button" className="text-[#878a99]">
                <MoreHorizontal size={14} />
              </button>
            </div>
            <div className="space-y-3 p-3">
              {stage.deals.map((deal) => (
                <div key={deal.id} className="card">
                  <div className="card-body p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <h6 className="m-0 text-[13px] font-semibold text-[#495057]">
                        {deal.title}
                      </h6>
                      <MoreHorizontal size={13} className="text-[#878a99]" />
                    </div>
                    <p className="m-0 mb-2 flex items-center gap-1 text-[14px] font-semibold text-[#0ab39c]">
                      <DollarSign size={14} /> {deal.amount}
                    </p>
                    <p className="m-0 text-[12px] text-[#878a99]">
                      {deal.company} · {deal.contact}
                    </p>
                    <p className="m-0 mt-1 text-[11px] text-[#878a99]">
                      {deal.date}
                    </p>
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-[10px] text-[#878a99]">
                        <span>Probability</span>
                        <span>{deal.probability}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded bg-[#e9ebec]">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${deal.probability}%`,
                            background: stage.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addDeal(stage.id)}
                className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-[#e9ebec] bg-white py-2 text-[12px] text-[#878a99] hover:border-[#405189] hover:text-[#405189]"
              >
                <Plus size={13} /> Add Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
