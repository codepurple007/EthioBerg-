import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CartView from "@/components/ecommerce/CartView";

export const metadata = {
  title: "Shopping Cart | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Shopping Cart"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Shopping Cart" },
        ]}
      />
      <CartView />
    </DashboardLayout>
  );
}
