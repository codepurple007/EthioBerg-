import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import TaskDetails from "@/components/tasks/TaskDetails";

export const metadata = {
  title: "Task Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Task Details"
        breadcrumbs={[
          { label: "Tasks", href: "/apps/tasks/details" },
          { label: "Task Details" },
        ]}
      />
      <TaskDetails />
    </DashboardLayout>
  );
}
