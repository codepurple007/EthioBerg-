import { RoleGuard } from "@/components/auth/RoleGuard";
import AdminSettingsPanel from "@/components/admin/AdminSettingsPanel";

export default function AdminSettingsPage() {
  return (
    <RoleGuard permission="admin_settings">
      <AdminSettingsPanel />
    </RoleGuard>
  );
}
