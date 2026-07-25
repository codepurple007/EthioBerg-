import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Gallery | Velzon - Admin Dashboard",
};

const colors = [
  "#405189",
  "#0ab39c",
  "#f7b84b",
  "#f06548",
  "#299cdb",
  "#3577f1",
  "#6559cc",
  "#212529",
  "#878a99",
  "#495057",
  "#0ab39c",
  "#405189",
];

export default function GalleryPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Gallery"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Gallery" },
        ]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {colors.map((c, i) => (
          <div
            key={`${c}-${i}`}
            className="card overflow-hidden transition-shadow hover:shadow-md"
          >
            <div
              className="aspect-video w-full"
              style={{
                background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
              }}
            />
            <div className="card-body py-2.5 px-3">
              <p className="m-0 text-[12px] font-medium text-[#495057]">
                Project Image {i + 1}
              </p>
              <p className="mt-0.5 mb-0 text-[11px] text-[#878a99]">
                Gallery item
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
