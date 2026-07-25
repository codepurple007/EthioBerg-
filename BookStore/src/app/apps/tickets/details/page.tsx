import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import TicketDetails from "@/components/tickets/TicketDetails";

export const metadata = {
  title: "Ticket Details | Velzon - Admin Dashboard",
};

export default function TicketDetailsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Ticket Details"
        breadcrumbs={[
          { label: "Support Tickets", href: "/apps/tickets/list" },
          { label: "Ticket Details" },
        ]}
      />
      <TicketDetails />
    </DashboardLayout>
  );
}
