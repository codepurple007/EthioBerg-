import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import EcommerceDashboard from "@/components/dashboards/EcommerceDashboard";

export const metadata = {
  title: "Ecommerce | Velzon - Admin Dashboard",
};

export default function EcommercePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Ecommerce"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "Ecommerce" },
        ]}
      />
      <EcommerceDashboard />
    </DashboardLayout>
  );
}
