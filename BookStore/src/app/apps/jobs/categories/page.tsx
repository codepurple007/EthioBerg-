import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobCategories from "@/components/jobs/JobCategories";

export const metadata = {
  title: "Job Categories | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Job Categories"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Categories" },
        ]}
      />
      <JobCategories />
    </DashboardLayout>
  );
}
