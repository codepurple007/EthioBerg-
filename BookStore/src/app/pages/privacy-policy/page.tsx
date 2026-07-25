import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Privacy Policy | Velzon - Admin Dashboard",
};

export default function PrivacyPolicyPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Privacy Policy" },
        ]}
      />
      <div className="card">
        <div className="card-body prose-content max-w-none space-y-4 text-[13px] leading-relaxed text-[#878a99]">
          <p className="m-0 text-[#495057]">
            Last updated: July 15, 2026
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Introduction
          </h5>
          <p className="m-0">
            Themesbrand (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This
            Privacy Policy explains how we collect, use, and protect information
            when you use the Velzon admin template and related services.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Information We Collect
          </h5>
          <p className="m-0">
            We may collect personal information you provide such as name, email
            address, and billing details when you purchase or register. We also
            collect usage data such as pages visited and device information to
            improve our products.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            How We Use Information
          </h5>
          <p className="m-0">
            We use collected information to deliver products, process payments,
            provide customer support, send product updates, and improve Velzon
            features and documentation.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Data Security
          </h5>
          <p className="m-0">
            We implement reasonable technical and organizational measures to
            protect your personal data. However, no method of transmission over
            the Internet is 100% secure.
          </p>
          <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
            Contact Us
          </h5>
          <p className="m-0">
            If you have questions about this Privacy Policy, contact us at
            support@themesbrand.com.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
