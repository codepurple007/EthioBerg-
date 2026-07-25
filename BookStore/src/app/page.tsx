import DashboardLayout from "@/components/layout/DashboardLayout";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import LiveUsersMap from "@/components/dashboard/LiveUsersMap";
import SessionsByCountries from "@/components/dashboard/SessionsByCountries";
import StatCards from "@/components/dashboard/StatCards";
import AudiencesMetrics from "@/components/dashboard/AudiencesMetrics";
import SessionsHeatmap from "@/components/dashboard/SessionsHeatmap";
import UsersByDevice from "@/components/dashboard/UsersByDevice";
import TopReferrals from "@/components/dashboard/TopReferrals";
import TopPages from "@/components/dashboard/TopPages";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      {/* Page title / breadcrumb */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="m-0 text-[16px] font-semibold tracking-wide text-[#405189] uppercase">
          Analytics
        </h4>
        <nav className="text-[13px] text-[#878a99]">
          <ol className="m-0 flex list-none items-center gap-1.5 p-0">
            <li>
              <a href="#" className="text-[#878a99] no-underline hover:text-[#405189]">
                Dashboards
              </a>
            </li>
            <li className="opacity-50">/</li>
            <li className="text-[#495057]">Analytics</li>
          </ol>
        </nav>
      </div>

      {/* Row 1: Upgrade + KPIs | Live Users | Sessions by Countries */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-4">
          <UpgradeCard />
          <StatCards compact />
        </div>
        <div className="xl:col-span-4">
          <LiveUsersMap />
        </div>
        <div className="xl:col-span-4">
          <SessionsByCountries />
        </div>
      </div>

      {/* Row 2: Audiences Metrics + Heatmap */}
      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AudiencesMetrics />
        </div>
        <div className="xl:col-span-5">
          <SessionsHeatmap />
        </div>
      </div>

      {/* Row 3: Device + Referrals + Top Pages */}
      <div className="mb-2 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <UsersByDevice />
        </div>
        <div className="xl:col-span-4">
          <TopReferrals />
        </div>
        <div className="xl:col-span-4">
          <TopPages />
        </div>
      </div>
    </DashboardLayout>
  );
}
