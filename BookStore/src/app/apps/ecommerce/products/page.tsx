import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProductsList from "@/components/ecommerce/ProductsList";

export const metadata = {
  title: "Products | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Products" },
        ]}
      />
      <ProductsList />
    </DashboardLayout>
  );
}
