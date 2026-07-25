import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoTransactions from "@/components/crypto/CryptoTransactions";

export const metadata = {
  title: "Transactions | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Transactions"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "Transactions" },
        ]}
      />
      <CryptoTransactions />
    </DashboardLayout>
  );
}
