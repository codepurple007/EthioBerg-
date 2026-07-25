import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftDashboard from "@/components/dashboards/NftDashboard";

export const metadata = {
  title: "NFT | Velzon - Admin Dashboard",
};

export default function NftPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="NFT Dashboard"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "NFT" },
        ]}
      />
      <NftDashboard />
    </DashboardLayout>
  );
}
