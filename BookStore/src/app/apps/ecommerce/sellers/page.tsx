import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import SellersList from "@/components/ecommerce/SellersList";

export const metadata = {
  title: "Sellers | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Sellers"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Sellers" },
        ]}
      />
      <SellersList />
    </DashboardLayout>
  );
}
