import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftCreate from "@/components/nft/NftCreate";

export const metadata = {
  title: "Create NFT | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Create NFT"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Create NFT" },
        ]}
      />
      <NftCreate />
    </DashboardLayout>
  );
}
