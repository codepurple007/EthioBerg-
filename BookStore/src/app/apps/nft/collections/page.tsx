import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftCollections from "@/components/nft/NftCollections";

export const metadata = {
  title: "Collections | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Collections"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Collections" },
        ]}
      />
      <NftCollections />
    </DashboardLayout>
  );
}
