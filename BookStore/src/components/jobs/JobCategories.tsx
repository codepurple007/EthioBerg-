"use client";
import { Briefcase, Code2, Palette, Megaphone, HeartPulse, GraduationCap, Building2, Wrench } from "lucide-react";

const cats = [
  { name: "Business & Consulting", jobs: 245, icon: Briefcase, color: "#405189" },
  { name: "Development", jobs: 412, icon: Code2, color: "#0ab39c" },
  { name: "Design & Creative", jobs: 189, icon: Palette, color: "#f7b84b" },
  { name: "Marketing", jobs: 156, icon: Megaphone, color: "#f06548" },
  { name: "Healthcare", jobs: 98, icon: HeartPulse, color: "#299cdb" },
  { name: "Education", jobs: 134, icon: GraduationCap, color: "#6559cc" },
  { name: "Real Estate", jobs: 67, icon: Building2, color: "#405189" },
  { name: "Engineering", jobs: 201, icon: Wrench, color: "#0ab39c" },
];

export default function JobCategories() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cats.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.name} className="card cursor-pointer transition hover:shadow-md">
            <div className="card-body flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: c.color + "22" }}>
                <Icon size={22} style={{ color: c.color }} />
              </div>
              <div>
                <p className="m-0 font-semibold text-[#495057]">{c.name}</p>
                <p className="m-0 text-[12px] text-[#878a99]">{c.jobs} Jobs Available</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
