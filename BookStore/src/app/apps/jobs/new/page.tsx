import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import NewJobForm from "@/components/jobs/NewJobForm";

export const metadata = {
  title: "New Job | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="New Job"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "New Job" },
        ]}
      />
      <NewJobForm />
    </DashboardLayout>
  );
}
