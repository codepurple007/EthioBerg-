import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CalendarApp from "@/components/apps/calendar/CalendarApp";

export const metadata = {
  title: "Calendar | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Calendar"
        breadcrumbs={[{ label: "Apps", href: "/apps/calendar" }, { label: "Calendar" }]}
      />
      <CalendarApp />
    </DashboardLayout>
  );
}
