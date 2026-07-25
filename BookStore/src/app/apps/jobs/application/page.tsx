import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobApplication from "@/components/jobs/JobApplication";

export const metadata = {
  title: "Application | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Application"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Application" },
        ]}
      />
      <JobApplication />
    </DashboardLayout>
  );
}
