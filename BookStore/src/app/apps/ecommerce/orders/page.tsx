import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import OrdersList from "@/components/ecommerce/OrdersList";

export const metadata = {
  title: "Orders | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Orders"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Orders" },
        ]}
      />
      <OrdersList />
    </DashboardLayout>
  );
}
