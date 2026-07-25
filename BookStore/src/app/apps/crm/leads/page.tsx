import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CrmLeads from "@/components/apps/crm/CrmLeads";

export const metadata = {
  title: "Leads | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Leads"
        breadcrumbs={[{ label: "CRM", href: "/apps/crm/leads" }, { label: "Leads" }]}
      />
      <CrmLeads />
    </DashboardLayout>
  );
}
