import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CrmDashboard from "@/components/dashboards/CrmDashboard";

export const metadata = {
  title: "CRM | Velzon - Admin Dashboard",
};

export default function CrmPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="CRM"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "CRM" },
        ]}
      />
      <CrmDashboard />
    </DashboardLayout>
  );
}
