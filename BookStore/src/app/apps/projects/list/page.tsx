import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsList from "@/components/apps/projects/ProjectsList";

export const metadata = {
  title: "Projects | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Projects"
        breadcrumbs={[{ label: "Projects", href: "/apps/projects/list" }, { label: "List" }]}
      />
      <ProjectsList />
    </DashboardLayout>
  );
}
