"use client";
import { useMemo, useState } from "react";
import { Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";

const avatarColors = ["#405189", "#0ab39c", "#f7b84b", "#f06548", "#299cdb", "#6559cc"];
const inputCls =
  "h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white";
const selectCls = inputCls + " cursor-pointer";
const btnPrimary =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]";
const btnSoft =
  "inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#e9ebec] bg-white px-3 py-2 text-[13px] font-medium text-[#495057] hover:bg-[#f3f6f9]";

type Customer = { id: string; name: string; email: string; phone: string; date: string; status: "Active" | "Block" };

const customers: Customer[] = [
  { id: "#VZ001", name: "Bob Martinez", email: "karlene@themesbrand.com", phone: "+(253) 12345 67890", date: "28 Mar, 2021", status: "Active" },
  { id: "#VZ002", name: "Tom Hughes", email: "james@themesbrand.com", phone: "+(125) 45154 84505", date: "21 Apr, 2021", status: "Active" },
  { id: "#VZ003", name: "Xavier Beaumont", email: "xavier@themesbrand.com", phone: "+(944) 84120 17854", date: "06 May, 2021", status: "Block" },
  { id: "#VZ004", name: "Curtis Weaver", email: "curtis@themesbrand.com", phone: "+(541) 75245 14021", date: "19 Jun, 2021", status: "Active" },
  { id: "#VZ005", name: "Amiee Fralick", email: "amiee@themesbrand.com", phone: "+(312) 84455 27890", date: "02 Jul, 2021", status: "Active" },
  { id: "#VZ006", name: "Theresa Holcomb", email: "theresa@themesbrand.com", phone: "+(298) 63254 33510", date: "11 Aug, 2021", status: "Block" },
];

export default function CustomersList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => customers.filter((c) => {
    const ms = status === "All" || c.status === status;
    const q = query.toLowerCase();
    return ms && (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }), [query, status]);

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-3">
        <h5 className="card-title">Customers</h5>
        <button type="button" className={btnPrimary}><Plus size={15} /> Add Customer</button>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-[#e9ebec] px-4 py-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..." className="h-9 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white" />
        </div>
        <select className={selectCls + " w-auto"} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option><option>Active</option><option>Block</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-[13px]">
          <thead><tr className="border-b border-[#e9ebec] bg-[#f3f6f9] text-[#878a99]">{["Customer","Email","Phone","Joining Date","Status","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} className="border-b border-[#e9ebec] hover:bg-[#f8f9fa]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: avatarColors[i % avatarColors.length] }}>{c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    <div>
                      <p className="m-0 font-medium text-[#495057]">{c.name}</p>
                      <p className="m-0 text-[12px] text-[#878a99]">{c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-[#878a99]"><Mail size={13} /> {c.email}</span></td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-[#878a99]"><Phone size={13} /> {c.phone}</span></td>
                <td className="px-4 py-3 text-[#878a99]">{c.date}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${c.status === "Active" ? "bg-[#daf4f0] text-[#0ab39c]" : "bg-[#fde8e4] text-[#f06548]"}`}>{c.status}</span></td>
                <td className="px-4 py-3"><button type="button" className="cursor-pointer rounded border-0 bg-transparent p-1 text-[#878a99] hover:bg-[#f3f6f9]"><MoreHorizontal size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
