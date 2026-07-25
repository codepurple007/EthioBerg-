import { RoleGuard } from "@/components/auth/RoleGuard";
import RagQualityPanel from "@/components/admin/RagQualityPanel";

export default function AdminQualityPage() {
  return (
    <RoleGuard permission="view_rag_quality">
      <RagQualityPanel />
    </RoleGuard>
  );
}
