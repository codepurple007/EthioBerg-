import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoOrders from "@/components/crypto/CryptoOrders";

export const metadata = {
  title: "Orders | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Orders"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "Orders" },
        ]}
      />
      <CryptoOrders />
    </DashboardLayout>
  );
}
