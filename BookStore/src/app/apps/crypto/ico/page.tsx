import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoIco from "@/components/crypto/CryptoIco";

export const metadata = {
  title: "ICO List | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="ICO List"
        breadcrumbs={[
          { label: "Crypto", href: "/apps/crypto/transactions" },
          { label: "ICO List" },
        ]}
      />
      <CryptoIco />
    </DashboardLayout>
  );
}
