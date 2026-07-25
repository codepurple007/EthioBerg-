import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobList from "@/components/jobs/JobList";

export const metadata = {
  title: "Job Lists | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Lists"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "List" },
        ]}
      />
      <JobList />
    </DashboardLayout>
  );
}
