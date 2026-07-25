import { RoleGuard } from "@/components/auth/RoleGuard";
import ScraperControlPanel from "@/components/admin/ScraperControlPanel";

export default function AdminScraperPage() {
  return (
    <RoleGuard permission="manage_scraper">
      <ScraperControlPanel />
    </RoleGuard>
  );
}
