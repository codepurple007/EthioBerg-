import { RoleGuard } from "@/components/auth/RoleGuard";
import IngestionControlPanel from "@/components/admin/IngestionControlPanel";

export default function AdminIngestionPage() {
  return (
    <RoleGuard permission="manage_ingestion_config">
      <IngestionControlPanel />
    </RoleGuard>
  );
}
