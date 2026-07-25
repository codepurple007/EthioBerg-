import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoKyc from "@/components/crypto/CryptoKyc";

export const metadata = {
  title: "KYC Application | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="KYC Application"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "KYC Application" },
        ]}
      />
      <CryptoKyc />
    </DashboardLayout>
  );
}
