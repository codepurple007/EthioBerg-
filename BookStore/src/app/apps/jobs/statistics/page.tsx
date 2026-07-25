import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobStatistics from "@/components/jobs/JobStatistics";

export const metadata = {
  title: "Job Statistics | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Statistics"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Statistics" },
        ]}
      />
      <JobStatistics />
    </DashboardLayout>
  );
}
