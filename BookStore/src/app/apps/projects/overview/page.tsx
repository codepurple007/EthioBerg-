import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsOverview from "@/components/apps/projects/ProjectsOverview";

export const metadata = {
  title: "Project Overview | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Project Overview"
        breadcrumbs={[{ label: "Projects", href: "/apps/projects/list" }, { label: "Overview" }]}
      />
      <ProjectsOverview />
    </DashboardLayout>
  );
}
