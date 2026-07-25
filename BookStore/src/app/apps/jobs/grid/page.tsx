import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobGrid from "@/components/jobs/JobGrid";

export const metadata = {
  title: "Job Grid Lists | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Grid Lists"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Grid" },
        ]}
      />
      <JobGrid />
    </DashboardLayout>
  );
}
