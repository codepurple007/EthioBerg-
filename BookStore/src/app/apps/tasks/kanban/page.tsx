import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import KanbanBoard from "@/components/apps/tasks/KanbanBoard";

export const metadata = {
  title: "Kanban Board | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Kanban Board"
        breadcrumbs={[{ label: "Tasks", href: "/apps/tasks/kanban" }, { label: "Kanban Board" }]}
      />
      <KanbanBoard />
    </DashboardLayout>
  );
}
