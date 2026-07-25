import RegulatoryQaPanel from "@/components/regulatory/RegulatoryQaPanel";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function RegulatoryQaPage() {
  return (
    <RoleGuard permission="ask_regulatory">
      <RegulatoryQaPanel />
    </RoleGuard>
  );
}
