import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CandidatesGrid from "@/components/jobs/CandidatesGrid";

export const metadata = {
  title: "Candidate Grid | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Candidate Grid"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Candidate Grid" },
        ]}
      />
      <CandidatesGrid />
    </DashboardLayout>
  );
}
