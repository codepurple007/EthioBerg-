import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProjectsDashboard from "@/components/dashboards/ProjectsDashboard";

export const metadata = {
  title: "Projects | Velzon - Admin Dashboard",
};

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Projects"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "Projects" },
        ]}
      />
      <ProjectsDashboard />
    </DashboardLayout>
  );
}
