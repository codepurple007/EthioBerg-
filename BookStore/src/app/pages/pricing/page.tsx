import { Check } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Pricing | Velzon - Admin Dashboard",
};

const plans = [
  {
    name: "Basic",
    price: "19.99",
    desc: "For personal use and starter projects",
    features: ["3 Projects", "299 Customers", "Scalable Bandwidth", "5 FTP Login"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "29.99",
    desc: "For growing teams and agencies",
    features: [
      "15 Projects",
      "Unlimited Customers",
      "Scalable Bandwidth",
      "12 FTP Login",
      "24/7 Support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "39.99",
    desc: "For large organizations",
    features: [
      "Unlimited Projects",
      "Unlimited Customers",
      "Scalable Bandwidth",
      "35 FTP Login",
      "24/7 Support",
      "Custom Domain",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Pricing"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Pricing" },
        ]}
      />
      <div className="mb-6 text-center">
        <h5 className="m-0 text-[16px] font-semibold text-[#495057]">
          Our plans scale with your business
        </h5>
        <p className="mt-1 mb-0 text-[13px] text-[#878a99]">
          Simple transparent pricing. No hidden fees.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`card relative ${p.highlight ? "border-[#405189] shadow-md" : ""}`}
          >
            {p.highlight && (
              <span className="absolute top-3 right-3 rounded bg-[#405189] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                Popular
              </span>
            )}
            <div className="card-body p-6 text-center">
              <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                {p.name}
              </h5>
              <p className="mt-1 mb-4 text-[12px] text-[#878a99]">{p.desc}</p>
              <div className="mb-5">
                <span className="text-[13px] text-[#878a99]">$</span>
                <span className="text-4xl font-bold text-[#405189]">{p.price}</span>
                <span className="text-[13px] text-[#878a99]"> / Month</span>
              </div>
              <ul className="mb-6 list-none space-y-2.5 p-0 text-left text-[13px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[#495057]">
                    <Check size={14} className="shrink-0 text-[#0ab39c]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full rounded px-4 py-2.5 text-[13px] font-medium ${
                  p.highlight
                    ? "border-0 bg-[#405189] text-white hover:bg-[#364574]"
                    : "border border-[#405189] bg-white text-[#405189] hover:bg-[#e2e5ed]"
                }`}
              >
                Sign Up Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
