import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import EmailEcommerce from "@/components/email/EmailEcommerce";

export const metadata = {
  title: "Ecommerce Action | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Ecommerce Action"
        breadcrumbs={[
          { label: "Email", href: "/apps/email/basic" },
          { label: "Ecommerce Action" },
        ]}
      />
      <EmailEcommerce />
    </DashboardLayout>
  );
}
