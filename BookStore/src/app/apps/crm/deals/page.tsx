import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CrmDeals from "@/components/apps/crm/CrmDeals";

export const metadata = {
  title: "Deals | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Deals"
        breadcrumbs={[{ label: "CRM", href: "/apps/crm/deals" }, { label: "Deals" }]}
      />
      <CrmDeals />
    </DashboardLayout>
  );
}
