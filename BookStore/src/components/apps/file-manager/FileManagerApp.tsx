"use client";

import { useMemo, useState } from "react";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Search,
  Upload,
  Grid3x3,
  List,
  MoreVertical,
  HardDrive,
  Download,
  Star,
} from "lucide-react";

type FileItem = {
  id: number;
  name: string;
  type: "folder" | "image" | "doc" | "sheet" | "pdf";
  size: string;
  date: string;
  starred?: boolean;
};

const folders = [
  { name: "My Files", count: 245 },
  { name: "Documents", count: 98 },
  { name: "Media", count: 64 },
  { name: "Recent", count: 18 },
  { name: "Important", count: 12 },
  { name: "Deleted", count: 7 },
];

const filesData: FileItem[] = [
  { id: 1, name: "Projects", type: "folder", size: "—", date: "12 Dec, 2021" },
  { id: 2, name: "Documents", type: "folder", size: "—", date: "10 Dec, 2021" },
  { id: 3, name: "Media", type: "folder", size: "—", date: "08 Dec, 2021" },
  {
    id: 4,
    name: "Velzon-admin.ppt",
    type: "doc",
    size: "4.2 MB",
    date: "05 Dec, 2021",
    starred: true,
  },
  {
    id: 5,
    name: "bg-pattern.png",
    type: "image",
    size: "1.1 MB",
    date: "03 Dec, 2021",
  },
  {
    id: 6,
    name: "sales-report.xlsx",
    type: "sheet",
    size: "890 KB",
    date: "01 Dec, 2021",
  },
  {
    id: 7,
    name: "invoice-details.pdf",
    type: "pdf",
    size: "640 KB",
    date: "28 Nov, 2021",
    starred: true,
  },
  {
    id: 8,
    name: "product-mockup.png",
    type: "image",
    size: "2.4 MB",
    date: "25 Nov, 2021",
  },
  {
    id: 9,
    name: "meeting-notes.doc",
    type: "doc",
    size: "320 KB",
    date: "22 Nov, 2021",
  },
  {
    id: 10,
    name: "brand-assets",
    type: "folder",
    size: "—",
    date: "20 Nov, 2021",
  },
  {
    id: 11,
    name: "app-pages.zip",
    type: "doc",
    size: "2.2 MB",
    date: "18 Nov, 2021",
  },
  {
    id: 12,
    name: "users.csv",
    type: "sheet",
    size: "150 KB",
    date: "15 Nov, 2021",
  },
];

const typeIcon = {
  folder: <Folder size={28} className="text-[#f7b84b]" />,
  image: <ImageIcon size={28} className="text-[#0ab39c]" />,
  doc: <FileText size={28} className="text-[#299cdb]" />,
  sheet: <FileSpreadsheet size={28} className="text-[#0ab39c]" />,
  pdf: <FileText size={28} className="text-[#f06548]" />,
};

export default function FileManagerApp() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFolder, setActiveFolder] = useState("My Files");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filesData.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-3">
        <div className="card">
          <div className="card-body">
            <button
              type="button"
              className="mb-4 flex w-full items-center justify-center gap-2 rounded border-0 bg-[#405189] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              <Upload size={15} /> Upload File
            </button>
            <ul className="m-0 mb-4 list-none space-y-0.5 p-0">
              {folders.map((f) => (
                <li key={f.name}>
                  <button
                    type="button"
                    onClick={() => setActiveFolder(f.name)}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-[13px] ${
                      activeFolder === f.name
                        ? "bg-[#e2e5ed] font-medium text-[#405189]"
                        : "text-[#495057] hover:bg-[#f3f3f9]"
                    }`}
                  >
                    <Folder size={14} className="opacity-70" />
                    <span className="flex-1 text-left">{f.name}</span>
                    <span className="text-[11px] text-[#878a99]">{f.count}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="rounded border border-[#e9ebec] bg-[#f3f3f9] p-3">
              <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#495057]">
                <HardDrive size={14} className="text-[#405189]" /> Storage
              </div>
              <p className="m-0 mb-2 text-[12px] text-[#878a99]">
                27.21 GB of 50 GB used
              </p>
              <div className="h-1.5 overflow-hidden rounded bg-[#e9ebec]">
                <div className="h-full w-[54%] rounded bg-[#405189]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-9">
        <div className="card">
          <div className="card-header flex-wrap gap-2">
            <h5 className="card-title">{activeFolder}</h5>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search files..."
                  className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded border p-1.5 ${
                  view === "grid"
                    ? "border-[#405189] bg-[#e2e5ed] text-[#405189]"
                    : "border-[#e9ebec] text-[#878a99]"
                }`}
              >
                <Grid3x3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded border p-1.5 ${
                  view === "list"
                    ? "border-[#405189] bg-[#e2e5ed] text-[#405189]"
                    : "border-[#e9ebec] text-[#878a99]"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
          <div className="card-body">
            {view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelected(f.id)}
                    className={`rounded border p-3 text-left transition-colors ${
                      selected === f.id
                        ? "border-[#405189] bg-[#e2e5ed]/40"
                        : "border-[#e9ebec] bg-white hover:border-[#405189]/40"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      {typeIcon[f.type]}
                      <div className="flex gap-1 text-[#878a99]">
                        {f.starred && (
                          <Star
                            size={13}
                            className="fill-[#f7b84b] text-[#f7b84b]"
                          />
                        )}
                        <MoreVertical size={14} />
                      </div>
                    </div>
                    <p className="m-0 truncate text-[13px] font-medium text-[#495057]">
                      {f.name}
                    </p>
                    <p className="m-0 mt-1 text-[11px] text-[#878a99]">
                      {f.size} · {f.date}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e9ebec] text-[#878a99]">
                      <th className="px-2 py-2 font-medium">Name</th>
                      <th className="px-2 py-2 font-medium">Size</th>
                      <th className="px-2 py-2 font-medium">Date</th>
                      <th className="px-2 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr
                        key={f.id}
                        onClick={() => setSelected(f.id)}
                        className={`cursor-pointer border-b border-[#e9ebec] ${
                          selected === f.id ? "bg-[#f3f3f9]" : "hover:bg-[#fafafa]"
                        }`}
                      >
                        <td className="px-2 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <span className="scale-75">{typeIcon[f.type]}</span>
                            {f.name}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-[#878a99]">{f.size}</td>
                        <td className="px-2 py-2.5 text-[#878a99]">{f.date}</td>
                        <td className="px-2 py-2.5">
                          <button
                            type="button"
                            className="rounded p-1 text-[#878a99] hover:bg-[#e1f0fa] hover:text-[#299cdb]"
                          >
                            <Download size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
