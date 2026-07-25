import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import FaqsAccordion from "@/components/pages/FaqsAccordion";

export const metadata = {
  title: "FAQs | Velzon - Admin Dashboard",
};

export default function FaqsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="FAQs"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "FAQs" },
        ]}
      />
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <h5 className="m-0 text-[16px] font-semibold text-[#495057]">
            Have any Questions?
          </h5>
          <p className="mt-1 mb-0 text-[13px] text-[#878a99]">
            Find answers to commonly asked questions about Velzon.
          </p>
        </div>
        <FaqsAccordion />
      </div>
    </DashboardLayout>
  );
}
