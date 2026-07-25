import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoBuySell from "@/components/crypto/CryptoBuySell";

export const metadata = {
  title: "Buy & Sell | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Buy & Sell"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "Buy & Sell" },
        ]}
      />
      <CryptoBuySell />
    </DashboardLayout>
  );
}
