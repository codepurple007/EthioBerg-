import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import ChatApp from "@/components/apps/chat/ChatApp";

export const metadata = {
  title: "Chat | Velzon - Admin Dashboard",
};

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Chat"
        breadcrumbs={[{ label: "Apps", href: "/apps/chat" }, { label: "Chat" }]}
      />
      <ChatApp />
    </DashboardLayout>
  );
}
