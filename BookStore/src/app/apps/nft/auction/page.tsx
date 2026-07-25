import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftAuction from "@/components/nft/NftAuction";

export const metadata = {
  title: "Live Auction | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Live Auction"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Live Auction" },
        ]}
      />
      <NftAuction />
    </DashboardLayout>
  );
}
