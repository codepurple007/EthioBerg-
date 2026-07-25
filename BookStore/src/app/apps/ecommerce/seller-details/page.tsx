import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import SellerDetails from "@/components/ecommerce/SellerDetails";

export const metadata = {
  title: "Seller Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Seller Details"
        breadcrumbs={[
          { label: "Ecommerce", href: "/apps/ecommerce/sellers" },
          { label: "Seller Details" },
        ]}
      />
      <SellerDetails />
    </DashboardLayout>
  );
}
