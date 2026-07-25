import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CreateProjectForm from "@/components/apps/projects/CreateProjectForm";

export const metadata = {
  title: "Create Project | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Create Project"
        breadcrumbs={[{ label: "Projects", href: "/apps/projects/list" }, { label: "Create Project" }]}
      />
      <CreateProjectForm />
    </DashboardLayout>
  );
}
