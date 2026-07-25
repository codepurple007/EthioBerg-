import ModulePlaceholder from "@/components/ui/ModulePlaceholder";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function ReportsPage() {
  return (
    <RoleGuard permission="export_reports">
      <ModulePlaceholder
        title="Reports"
        phase="Phase 7"
        description="Preview and export pre-review analysis reports to DOCX with citations, rule versions, caveats, and disclaimers."
        srsRefs={["FR-REP-001 to FR-REP-005", "UC-05"]}
      />
    </RoleGuard>
  );
}
