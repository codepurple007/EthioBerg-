import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoWallet from "@/components/crypto/CryptoWallet";

export const metadata = {
  title: "My Wallet | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="My Wallet"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "My Wallet" },
        ]}
      />
      <CryptoWallet />
    </DashboardLayout>
  );
}
