import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import AddProductForm from "@/components/ecommerce/AddProductForm";

export const metadata = {
  title: "Create Product | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Create Product"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/products" },
          { label: "Create Product" },
        ]}
      />
      <AddProductForm />
    </DashboardLayout>
  );
}
