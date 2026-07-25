import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import BlogDashboard from "@/components/dashboards/BlogDashboard";

export const metadata = {
  title: "Blog | Velzon - Admin Dashboard",
};

export default function BlogPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Blog"
        breadcrumbs={[
          { label: "Dashboards", href: "/" },
          { label: "Blog" },
        ]}
      />
      <BlogDashboard />
    </DashboardLayout>
  );
}
