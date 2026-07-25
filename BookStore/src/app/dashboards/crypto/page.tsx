import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CryptoDashboard from "@/components/dashboards/CryptoDashboard";

export const metadata = {
  title: "Crypto | Velzon - Admin Dashboard",
};

export default function CryptoPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Crypto"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "Crypto" },
        ]}
      />
      <CryptoDashboard />
    </DashboardLayout>
  );
}
