import { RoleGuard } from "@/components/auth/RoleGuard";
import DocumentReviewPanel from "@/components/documents/DocumentReviewPanel";

export default function DocumentReviewPage() {
  return (
    <RoleGuard permission="review_documents">
      <DocumentReviewPanel />
    </RoleGuard>
  );
}
