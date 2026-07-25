import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import InvoiceDetails from "@/components/apps/invoice/InvoiceDetails";

export const metadata = {
  title: "Invoice Details | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Invoice Details"
        breadcrumbs={[{ label: "Invoices", href: "/apps/invoices/list" }, { label: "Details" }]}
      />
      <InvoiceDetails />
    </DashboardLayout>
  );
}
