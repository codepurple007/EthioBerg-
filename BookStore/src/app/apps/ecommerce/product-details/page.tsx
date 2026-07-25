import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProductDetails from "@/components/ecommerce/ProductDetails";

export const metadata = {
  title: "Product Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Product Details"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Product Details" },
        ]}
      />
      <ProductDetails />
    </DashboardLayout>
  );
}
