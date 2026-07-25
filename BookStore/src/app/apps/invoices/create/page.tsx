import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateInvoiceForm from "@/components/invoice/CreateInvoiceForm";

export const metadata = {
  title: "Create Invoice | Velzon - Admin Dashboard",
};

export default function CreateInvoicePage() {
  return (
    <DashboardLayout>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="m-0 text-[16px] font-semibold tracking-wide text-[#405189] uppercase">
          Create Invoice
        </h4>
        <nav className="text-[13px] text-[#878a99]">
          <ol className="m-0 flex list-none items-center gap-1.5 p-0">
            <li>
              <a
                href="#"
                className="text-[#878a99] no-underline hover:text-[#405189]"
              >
                Invoices
              </a>
            </li>
            <li className="opacity-50">/</li>
            <li className="text-[#495057]">Create Invoice</li>
          </ol>
        </nav>
      </div>

      <CreateInvoiceForm />
    </DashboardLayout>
  );
}
