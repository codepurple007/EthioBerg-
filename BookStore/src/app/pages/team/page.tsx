import { Mail, MoreHorizontal } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Team | Velzon - Admin Dashboard",
};

const members = [
  { name: "Nancy Martino", role: "Team Leader", color: "#405189", projects: 18 },
  { name: "Henry Baird", role: "Full Stack Developer", color: "#0ab39c", projects: 24 },
  { name: "Frank Hook", role: "Project Manager", color: "#f7b84b", projects: 12 },
  { name: "Jennifer Carter", role: "UI/UX Designer", color: "#f06548", projects: 31 },
  { name: "Megan Melanie", role: "Marketing Designer", color: "#299cdb", projects: 9 },
  { name: "Alexis Clarke", role: "Product Manager", color: "#3577f1", projects: 15 },
  { name: "Joseph Parker", role: "Team Leader", color: "#405189", projects: 22 },
  { name: "Erica Kernan", role: "Web Designer", color: "#0ab39c", projects: 17 },
];

export default function TeamPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Team"
        breadcrumbs={[
          { label: "Pages", href: "/pages/starter" },
          { label: "Team" },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {members.map((m) => (
          <div key={m.name} className="card text-center">
            <div className="card-body relative pt-6">
              <button
                type="button"
                className="absolute top-3 right-3 border-0 bg-transparent text-[#878a99]"
                aria-label="More"
              >
                <MoreHorizontal size={16} />
              </button>
              <div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
                style={{ background: m.color }}
              >
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
                {m.name}
              </h5>
              <p className="mt-1 mb-3 text-[12px] text-[#878a99]">{m.role}</p>
              <div className="mb-4 flex justify-center gap-4 text-[12px] text-[#878a99]">
                <span>
                  <strong className="text-[#495057]">{m.projects}</strong> Projects
                </span>
                <span>
                  <strong className="text-[#495057]">
                    {Math.floor(m.projects * 1.4)}
                  </strong>{" "}
                  Tasks
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-1.5 text-[12px] font-medium text-[#405189] hover:bg-[#f3f3f9]"
              >
                <Mail size={12} /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
