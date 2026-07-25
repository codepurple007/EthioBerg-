import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import TasksList from "@/components/apps/tasks/TasksList";

export const metadata = {
  title: "Tasks List | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Tasks List"
        breadcrumbs={[{ label: "Tasks", href: "/apps/tasks/list" }, { label: "List View" }]}
      />
      <TasksList />
    </DashboardLayout>
  );
}
