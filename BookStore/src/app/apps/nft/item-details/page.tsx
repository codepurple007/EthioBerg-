import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftItemDetails from "@/components/nft/NftItemDetails";

export const metadata = {
  title: "Item Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Item Details"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Item Details" },
        ]}
      />
      <NftItemDetails />
    </DashboardLayout>
  );
}
