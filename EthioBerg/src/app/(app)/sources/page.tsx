import { RoleGuard } from "@/components/auth/RoleGuard";
import SourceLibraryPanel from "@/components/sources/SourceLibraryPanel";

export default function SourcesPage() {
  return (
    <RoleGuard permission="manage_sources">
      <SourceLibraryPanel />
    </RoleGuard>
  );
}
