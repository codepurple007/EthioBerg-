import RegulatoryQaPanel from "@/components/regulatory/RegulatoryQaPanel";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function RegulatoryQaPage() {
  return (
    <RoleGuard permission="ask_basic_regulatory">
      <RegulatoryQaPanel />
    </RoleGuard>
  );
}
