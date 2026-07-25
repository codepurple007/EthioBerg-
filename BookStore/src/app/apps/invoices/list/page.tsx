import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import InvoiceList from "@/components/invoice/InvoiceList";

export const metadata = {
  title: "Invoice List | Velzon - Admin Dashboard",
};

export default function InvoiceListPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Invoice List"
        breadcrumbs={[
          { label: "Invoices", href: "/apps/invoices/list" },
          { label: "List View" },
        ]}
      />
      <InvoiceList />
    </DashboardLayout>
  );
}
