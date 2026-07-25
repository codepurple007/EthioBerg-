import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import TodoApp from "@/components/apps/todo/TodoApp";

export const metadata = {
  title: "To Do | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="To Do"
        breadcrumbs={[{ label: "Apps", href: "/apps/todo" }, { label: "To Do" }]}
      />
      <TodoApp />
    </DashboardLayout>
  );
}
