import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CheckoutForm from "@/components/ecommerce/CheckoutForm";

export const metadata = {
  title: "Checkout | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Checkout"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/cart" },
          { label: "Checkout" },
        ]}
      />
      <CheckoutForm />
    </DashboardLayout>
  );
}
