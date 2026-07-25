import CompanyExplorerPanel from "@/components/companies/CompanyExplorerPanel";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CompaniesPage() {
  return (
    <RoleGuard permission="explore_companies">
      <CompanyExplorerPanel />
    </RoleGuard>
  );
}
