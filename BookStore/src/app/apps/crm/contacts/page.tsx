import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CrmContacts from "@/components/apps/crm/CrmContacts";

export const metadata = {
  title: "Contacts | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Contacts"
        breadcrumbs={[{ label: "CRM", href: "/apps/crm/contacts" }, { label: "Contacts" }]}
      />
      <CrmContacts />
    </DashboardLayout>
  );
}
