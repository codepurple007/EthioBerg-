import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Starter | Velzon - Admin Dashboard",
};

export default function StarterPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Starter"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Starter" },
        ]}
      />
      <div className="card">
        <div className="card-body py-16 text-center">
          <h5 className="m-0 text-[15px] font-medium text-[#495057]">
            Start with this page...
          </h5>
          <p className="mt-2 mb-0 text-[13px] text-[#878a99]">
            This is a clean starter page. Drop your content here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
