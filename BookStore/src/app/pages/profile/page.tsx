import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProfileContent from "@/components/pages/ProfileContent";

export const metadata = {
  title: "Profile | Velzon - Admin Dashboard",
};

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Profile" },
        ]}
      />
      <ProfileContent />
    </DashboardLayout>
  );
}
