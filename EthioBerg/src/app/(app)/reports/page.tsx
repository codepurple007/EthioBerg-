import ReportWorkspace from "@/components/reports/ReportWorkspace";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function ReportsPage() {
  return (
    <RoleGuard permission="export_reports">
      <ReportWorkspace />
    </RoleGuard>
  );
}
