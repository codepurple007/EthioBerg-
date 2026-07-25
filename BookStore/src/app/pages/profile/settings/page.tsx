import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProfileSettingsForm from "@/components/pages/ProfileSettingsForm";

export const metadata = {
  title: "Settings | Velzon - Admin Dashboard",
};

export default function ProfileSettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Profile", href: "/pages/profile" },
          { label: "Settings" },
        ]}
      />
      <ProfileSettingsForm />
    </DashboardLayout>
  );
}
