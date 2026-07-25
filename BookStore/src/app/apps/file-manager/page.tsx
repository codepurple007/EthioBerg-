import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import FileManagerApp from "@/components/apps/file-manager/FileManagerApp";

export const metadata = {
  title: "File Manager | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="File Manager"
        breadcrumbs={[{ label: "Apps", href: "/apps/file-manager" }, { label: "File Manager" }]}
      />
      <FileManagerApp />
    </DashboardLayout>
  );
}
