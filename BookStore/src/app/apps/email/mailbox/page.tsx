import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import MailboxApp from "@/components/apps/email/MailboxApp";

export const metadata = {
  title: "Mailbox | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Mailbox"
        breadcrumbs={[{ label: "Email", href: "/apps/email/mailbox" }, { label: "Mailbox" }]}
      />
      <MailboxApp />
    </DashboardLayout>
  );
}
