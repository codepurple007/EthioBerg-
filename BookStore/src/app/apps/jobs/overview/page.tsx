import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobOverview from "@/components/jobs/JobOverview";

export const metadata = {
  title: "Job Overview | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Overview"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Job Overview" },
        ]}
      />
      <JobOverview />
    </DashboardLayout>
  );
}
