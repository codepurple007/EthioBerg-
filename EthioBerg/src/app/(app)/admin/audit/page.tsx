import { RoleGuard } from "@/components/auth/RoleGuard";
import AuditLogPanel from "@/components/admin/AuditLogPanel";

export default function AdminAuditPage() {
  return (
    <RoleGuard permission="view_audit">
      <AuditLogPanel />
    </RoleGuard>
  );
}
