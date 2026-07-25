import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import EmailBasic from "@/components/email/EmailBasic";

export const metadata = {
  title: "Basic Action | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Basic Action"
        breadcrumbs={[
          { label: "Email", href: "/apps/email/basic" },
          { label: "Basic Action" },
        ]}
      />
      <EmailBasic />
    </DashboardLayout>
  );
}
