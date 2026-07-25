import { RoleGuard } from "@/components/auth/RoleGuard";
import AdminSettingsPanel from "@/components/admin/AdminSettingsPanel";

export default function AdminSettingsPage() {
  return (
    <RoleGuard permission="manage_synthetic_demo">
      <AdminSettingsPanel />
    </RoleGuard>
  );
}
