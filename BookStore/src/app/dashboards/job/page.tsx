import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobDashboard from "@/components/dashboards/JobDashboard";

export const metadata = {
  title: "Job | Velzon - Admin Dashboard",
};

export default function JobPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Dashboard"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "Job" },
        ]}
      />
      <JobDashboard />
    </DashboardLayout>
  );
}
