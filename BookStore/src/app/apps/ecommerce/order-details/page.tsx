import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import OrderDetails from "@/components/ecommerce/OrderDetails";

export const metadata = {
  title: "Order Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Order Details"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/orders" },
          { label: "Order Details" },
        ]}
      />
      <OrderDetails />
    </DashboardLayout>
  );
}
