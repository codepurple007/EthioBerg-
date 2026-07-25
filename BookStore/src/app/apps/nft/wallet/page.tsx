import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NftWallet from "@/components/nft/NftWallet";

export const metadata = {
  title: "Wallet Connect | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Wallet Connect"
        breadcrumbs={[
          { label: "NFT Marketplace", href: "/apps/nft/marketplace" },
          { label: "Wallet Connect" },
        ]}
      />
      <NftWallet />
    </DashboardLayout>
  );
}
