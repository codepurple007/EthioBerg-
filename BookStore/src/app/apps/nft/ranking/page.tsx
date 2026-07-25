import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftRanking from "@/components/nft/NftRanking";

export const metadata = {
  title: "Ranking | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Ranking"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Ranking" },
        ]}
      />
      <NftRanking />
    </DashboardLayout>
  );
}
