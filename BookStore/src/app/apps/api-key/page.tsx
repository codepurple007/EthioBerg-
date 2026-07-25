import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ApiKeyApp from "@/components/apps/api-key/ApiKeyApp";

export const metadata = {
  title: "API Key | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="API Key"
        breadcrumbs={[{ label: "Apps", href: "/apps/api-key" }, { label: "API Key" }]}
      />
      <ApiKeyApp />
    </DashboardLayout>
  );
}
