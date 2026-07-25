"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MoreHorizontal,
  Grid3x3,
  List,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type Contact = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  score: number;
  tags: string[];
  lastContacted: string;
  avatar: string;
};

const contactsData: Contact[] = [
  {
    id: 1,
    name: "Tonya Johnson",
    company: "Themesbrand",
    email: "tonya@themesbrand.com",
    phone: "+(256) 2451 8974",
    score: 154,
    tags: ["Lead", "Partner"],
    lastContacted: "15 Dec, 2021",
    avatar: "TJ",
  },
  {
    id: 2,
    name: "Thomas Taylor",
    company: "Nazox",
    email: "thomas@nazox.com",
    phone: "+(91) 2451 8974",
    score: 254,
    tags: ["Exiting"],
    lastContacted: "18 Dec, 2021",
    avatar: "TT",
  },
  {
    id: 3,
    name: "Nancy Martino",
    company: "Skote",
    email: "nancy@skote.com",
    phone: "+(32) 4500 8974",
    score: 128,
    tags: ["Lead", "Long-term"],
    lastContacted: "21 Dec, 2021",
    avatar: "NM",
  },
  {
    id: 4,
    name: "Alexis Clarke",
    company: "Velzon",
    email: "alexis@velzon.com",
    phone: "+(01) 2345 6789",
    score: 198,
    tags: ["Partner"],
    lastContacted: "24 Dec, 2021",
    avatar: "AC",
  },
  {
    id: 5,
    name: "James Morris",
    company: "Minible",
    email: "james@minible.com",
    phone: "+(44) 2045 8974",
    score: 176,
    tags: ["Lead"],
    lastContacted: "28 Dec, 2021",
    avatar: "JM",
  },
  {
    id: 6,
    name: "Michael Morris",
    company: "Doot",
    email: "michael@doot.com",
    phone: "+(49) 3045 8974",
    score: 210,
    tags: ["Exiting", "Partner"],
    lastContacted: "02 Jan, 2022",
    avatar: "MM",
  },
];

const avatars = ["#405189", "#0ab39c", "#299cdb", "#f7b84b", "#f06548"];

export default function CrmContacts() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(contactsData);

  const filtered = useMemo(
    () =>
      rows.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.company.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  return (
    <div className="card">
      <div className="card-header flex-wrap gap-2">
        <h5 className="card-title">Contacts</h5>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts..."
              className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`rounded border p-1.5 ${view === "table" ? "border-[#405189] bg-[#e2e5ed] text-[#405189]" : "border-[#e9ebec] text-[#878a99]"}`}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`rounded border p-1.5 ${view === "cards" ? "border-[#405189] bg-[#e2e5ed] text-[#405189]" : "border-[#e9ebec] text-[#878a99]"}`}
          >
            <Grid3x3 size={15} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-1.5 text-[13px] font-medium text-white"
          >
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="card-body grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className="rounded border border-[#e9ebec] p-4 hover:shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                  style={{ background: avatars[i % avatars.length] }}
                >
                  {c.avatar}
                </span>
                <button type="button" className="text-[#878a99]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <p className="m-0 text-[14px] font-semibold text-[#495057]">
                {c.name}
              </p>
              <p className="m-0 mb-2 text-[12px] text-[#878a99]">{c.company}</p>
              <p className="m-0 flex items-center gap-1 text-[12px] text-[#878a99]">
                <Mail size={12} /> {c.email}
              </p>
              <p className="m-0 mt-1 flex items-center gap-1 text-[12px] text-[#878a99]">
                <Phone size={12} /> {c.phone}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-[#e2e5ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#405189]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-body overflow-x-auto p-0">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f3f3f9] text-[#878a99]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Last Contacted</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-[#e9ebec] hover:bg-[#fafafa]"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-medium text-[#495057]">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ background: avatars[i % avatars.length] }}
                      >
                        {c.avatar}
                      </span>
                      {c.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#878a99]">{c.company}</td>
                  <td className="px-4 py-3 text-[#878a99]">{c.email}</td>
                  <td className="px-4 py-3 text-[#878a99]">{c.phone}</td>
                  <td className="px-4 py-3 font-semibold text-[#405189]">
                    {c.score}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-[#e2e5ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#405189]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#878a99]">{c.lastContacted}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 text-[#878a99]">
                      <button type="button" className="rounded p-1.5 hover:bg-[#e1f0fa] hover:text-[#299cdb]">
                        <Eye size={14} />
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-[#fef4e4] hover:text-[#f7b84b]">
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRows((prev) => prev.filter((r) => r.id !== c.id))
                        }
                        className="rounded p-1.5 hover:bg-[#fde8e4] hover:text-[#f06548]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
