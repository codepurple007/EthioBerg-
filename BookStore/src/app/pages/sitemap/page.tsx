import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Sitemap | Velzon - Admin Dashboard",
};

const tree = [
  {
    title: "Dashboards",
    links: [
      { label: "Analytics", href: "/" },
      { label: "CRM", href: "/dashboards/crm" },
    ],
  },
  {
    title: "Apps",
    links: [
      { label: "Invoice List", href: "/apps/invoices/list" },
      { label: "Create Invoice", href: "/apps/invoices/create" },
      { label: "Tickets List", href: "/apps/tickets/list" },
      { label: "Ticket Details", href: "/apps/tickets/details" },
    ],
  },
  {
    title: "Authentication",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Sign Up", href: "/auth/signup" },
      { label: "Reset Password", href: "/auth/reset-password" },
      { label: "Lock Screen", href: "/auth/lock-screen" },
      { label: "Logout", href: "/auth/logout" },
      { label: "404", href: "/auth/404" },
      { label: "500", href: "/auth/500" },
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "Starter", href: "/pages/starter" },
      { label: "Profile", href: "/pages/profile" },
      { label: "Settings", href: "/pages/profile/settings" },
      { label: "Team", href: "/pages/team" },
      { label: "Timeline", href: "/pages/timeline" },
      { label: "FAQs", href: "/pages/faqs" },
      { label: "Pricing", href: "/pages/pricing" },
      { label: "Gallery", href: "/pages/gallery" },
      { label: "Maintenance", href: "/pages/maintenance" },
      { label: "Coming Soon", href: "/pages/coming-soon" },
      { label: "Search Results", href: "/pages/search-results" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms", href: "/pages/terms" },
    ],
  },
  {
    title: "Landing",
    links: [
      { label: "One Page", href: "/landing" },
      { label: "NFT Landing", href: "/landing/nft" },
      { label: "Job Landing", href: "/landing/job" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Sitemap"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Sitemap" },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tree.map((section) => (
          <div key={section.title} className="card">
            <div className="card-header">
              <h5 className="card-title">{section.title}</h5>
            </div>
            <div className="card-body">
              <ul className="m-0 list-none space-y-2 p-0">
                {section.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-[#405189] no-underline hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
