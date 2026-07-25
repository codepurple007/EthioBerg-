import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CustomersList from "@/components/ecommerce/CustomersList";

export const metadata = {
  title: "Customers | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Customers" },
        ]}
      />
      <CustomersList />
    </DashboardLayout>
  );
}
