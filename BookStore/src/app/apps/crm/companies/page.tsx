import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CrmCompanies from "@/components/apps/crm/CrmCompanies";

export const metadata = {
  title: "Companies | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Companies"
        breadcrumbs={[{ label: "CRM", href: "/apps/crm/companies" }, { label: "Companies" }]}
      />
      <CrmCompanies />
    </DashboardLayout>
  );
}
