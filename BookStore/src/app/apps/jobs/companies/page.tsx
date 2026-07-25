import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import JobCompanies from "@/components/jobs/JobCompanies";

export const metadata = {
  title: "Companies | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Companies"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Companies" },
        ]}
      />
      <JobCompanies />
    </DashboardLayout>
  );
}
