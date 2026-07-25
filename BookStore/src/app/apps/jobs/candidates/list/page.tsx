import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import CandidatesList from "@/components/jobs/CandidatesList";

export const metadata = {
  title: "Candidate Lists | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Candidate Lists"
        breadcrumbs={[
          { label: "Jobs", href: "/apps/jobs/list" },
          { label: "Candidate Lists" },
        ]}
      />
      <CandidatesList />
    </DashboardLayout>
  );
}
