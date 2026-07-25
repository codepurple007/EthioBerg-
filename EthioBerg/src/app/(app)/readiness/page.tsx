import { RoleGuard } from "@/components/auth/RoleGuard";
import ReadinessWorkflow from "@/components/readiness/ReadinessWorkflow";

export default function ReadinessPage() {
  return (
    <RoleGuard permission="run_readiness">
      <ReadinessWorkflow />
    </RoleGuard>
  );
}
