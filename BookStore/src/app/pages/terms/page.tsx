import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Terms & Conditions | Velzon - Admin Dashboard",
};

export default function TermsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Terms & Conditions"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Terms & Conditions" },
        ]}
      />
      <div className="card">
        <div className="card-body space-y-4 text-[13px] leading-relaxed text-[#878a99]">
          <p className="m-0 text-[#495057]">Last updated: July 15, 2026</p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Acceptance of Terms
          </h5>
          <p className="m-0">
            By downloading, purchasing, or using Velzon, you agree to these Terms
            &amp; Conditions. If you do not agree, you may not use the product.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            License
          </h5>
          <p className="m-0">
            Each purchase grants a license according to the Themesbrand licensing
            terms selected at checkout. Licenses may not be redistributed,
            resold, or sublicensed without written permission.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Intellectual Property
          </h5>
          <p className="m-0">
            All Velzon source code, design assets, and documentation remain the
            intellectual property of Themesbrand unless otherwise stated under
            open-source licenses for third-party packages.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Limitation of Liability
          </h5>
          <p className="m-0">
            Themesbrand shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of Velzon within your
            applications or business workflows.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Changes
          </h5>
          <p className="m-0">
            We may update these terms from time to time. Continued use of Velzon
            after changes constitutes acceptance of the revised terms.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
