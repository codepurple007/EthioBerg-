import { RoleGuard } from "@/components/auth/RoleGuard";
import RetrievalOperationsPanel from "@/components/admin/RetrievalOperationsPanel";

export default function AdminRetrievalPage() {
  return (
    <RoleGuard permission="manage_retrieval_config">
      <RetrievalOperationsPanel />
    </RoleGuard>
  );
}
