import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import MonthGrid from "@/components/calendar/MonthGrid";

export const metadata = {
  title: "Month Grid | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Month Grid"
        breadcrumbs={[
          { label: "Apps", href: "/apps/calendar/month-grid" },
          { label: "Month Grid" },
        ]}
      />
      <MonthGrid />
    </DashboardLayout>
  );
}
