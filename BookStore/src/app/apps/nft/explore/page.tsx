import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftExplore from "@/components/nft/NftExplore";

export const metadata = {
  title: "Explore Now | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Explore Now"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Explore Now" },
        ]}
      />
      <NftExplore />
    </DashboardLayout>
  );
}
