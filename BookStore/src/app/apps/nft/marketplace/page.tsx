import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftMarketplace from "@/components/nft/NftMarketplace";

export const metadata = {
  title: "Marketplace | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Marketplace"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Marketplace" },
        ]}
      />
      <NftMarketplace />
    </DashboardLayout>
  );
}
