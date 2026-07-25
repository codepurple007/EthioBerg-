import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftCreators from "@/components/nft/NftCreators";

export const metadata = {
  title: "Creators | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Creators"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Creators" },
        ]}
      />
      <NftCreators />
    </DashboardLayout>
  );
}
