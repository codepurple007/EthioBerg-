"use client";

import { useMemo, useState } from "react";
import {
  Inbox,
  Send,
  FileEdit,
  AlertOctagon,
  Trash2,
  Star,
  AlertCircle,
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Reply,
  Archive,
  Tag,
  Paperclip,
} from "lucide-react";

type Folder = "inbox" | "sent" | "draft" | "spam" | "trash" | "starred" | "important";

type Mail = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  folder: Folder;
  label?: string;
  body: string;
};

const folders: { key: Folder; label: string; icon: React.ReactNode; count?: number }[] = [
  { key: "inbox", label: "Inbox", icon: <Inbox size={14} />, count: 5 },
  { key: "sent", label: "Sent", icon: <Send size={14} /> },
  { key: "draft", label: "Draft", icon: <FileEdit size={14} /> },
  { key: "spam", label: "Spam", icon: <AlertOctagon size={14} /> },
  { key: "trash", label: "Trash", icon: <Trash2 size={14} /> },
  { key: "starred", label: "Starred", icon: <Star size={14} /> },
  { key: "important", label: "Important", icon: <AlertCircle size={14} /> },
];

const labels = [
  { name: "Support", color: "#405189", count: 3 },
  { name: "Freelance", color: "#0ab39c" },
  { name: "Social", color: "#299cdb" },
  { name: "Friends", color: "#f7b84b", count: 2 },
  { name: "Family", color: "#f06548" },
];

const mailsData: Mail[] = [
  {
    id: 1,
    from: "Peter, me",
    subject: "Hello",
    preview: "Trip home from Colombo has been arranged...",
    date: "03:01 PM",
    unread: true,
    starred: false,
    important: true,
    folder: "inbox",
    label: "Support",
    body: "Hi,\n\nPraesent dui ex, dapibus eget mauris ut, finibus vestibulum enim. Quisque arcu leo, facilisis in fringilla id, luctus in tortor.\n\nSed elementum turpis eu lorem interdum, sed porttitor eros commodo. Nam eu venenatis tortor, id lacinia diam.\n\nSincerely,\nPeter",
  },
  {
    id: 2,
    from: "me, Susanna",
    subject: "New updates for Skote Theme",
    preview: "Since you asked and I am expecting for your reply...",
    date: "09 Jan",
    unread: true,
    starred: true,
    important: false,
    folder: "inbox",
    label: "Freelance",
    body: "Hi,\n\nNew updates for Skote Theme are available. Please review the changelog and upgrade when ready.\n\nThanks,\nSusanna",
  },
  {
    id: 3,
    from: "Web Support Dennis",
    subject: "Re: New mail settings",
    preview: "Will you answer him asap?",
    date: "08 Jan",
    unread: false,
    starred: false,
    important: false,
    folder: "inbox",
    label: "Support",
    body: "Hi,\n\nWill you answer him asap regarding the new mail settings?\n\nRegards,\nDennis",
  },
  {
    id: 4,
    from: "Anna Adame",
    subject: "Your Order Confirmation",
    preview: "Your order has been confirmed and will ship soon...",
    date: "07 Jan",
    unread: false,
    starred: true,
    important: true,
    folder: "inbox",
    label: "Friends",
    body: "Hi,\n\nIf several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.\n\nThank you",
  },
  {
    id: 5,
    from: "Jack Davis",
    subject: "Weekly Project Sync",
    preview: "Please find the agenda for tomorrow's sync...",
    date: "06 Jan",
    unread: true,
    starred: false,
    important: false,
    folder: "inbox",
    label: "Social",
    body: "Hi,\n\nEveryone realizes why a new common language would be desirable: one could refuse to pay expensive translators.\n\nThank you",
  },
  {
    id: 6,
    from: "me",
    subject: "Proposal Draft",
    preview: "Attached is the latest draft for review...",
    date: "05 Jan",
    unread: false,
    starred: false,
    important: false,
    folder: "sent",
    body: "Please review the attached proposal and share feedback.",
  },
];

export default function MailboxApp() {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [mails, setMails] = useState(mailsData);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return mails.filter((m) => {
      const inFolder =
        folder === "starred"
          ? m.starred
          : folder === "important"
            ? m.important
            : m.folder === folder;
      const q = query.toLowerCase();
      return (
        inFolder &&
        (m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q))
      );
    });
  }, [mails, folder, query]);

  const selected = mails.find((m) => m.id === selectedId) ?? null;

  const toggleStar = (id: number) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  };

  const markRead = (id: number) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-12">
        {/* Folders */}
        <div className="border-b border-[#e9ebec] p-4 lg:col-span-3 lg:border-r lg:border-b-0">
          <button
            type="button"
            className="mb-4 flex w-full items-center justify-center gap-2 rounded border-0 bg-[#0ab39c] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#099885]"
          >
            <Plus size={15} /> Compose
          </button>
          <ul className="m-0 mb-4 list-none space-y-0.5 p-0">
            {folders.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  onClick={() => {
                    setFolder(f.key);
                    setSelectedId(null);
                  }}
                  className={`flex w-full items-center gap-2 rounded px-3 py-2 text-[13px] ${
                    folder === f.key
                      ? "bg-[#e2e5ed] font-medium text-[#405189]"
                      : "text-[#495057] hover:bg-[#f3f3f9]"
                  }`}
                >
                  <span className="opacity-70">{f.icon}</span>
                  <span className="flex-1 text-left">{f.label}</span>
                  {f.count ? (
                    <span className="rounded bg-[#405189] px-1.5 text-[10px] font-semibold text-white">
                      {f.count}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#878a99] uppercase">
            Labels
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {labels.map((l) => (
              <li
                key={l.name}
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#495057]"
              >
                <Tag size={12} style={{ color: l.color }} />
                <span className="flex-1">{l.name}</span>
                {l.count ? (
                  <span className="text-[11px] text-[#878a99]">{l.count}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded border border-[#e9ebec] bg-[#f3f3f9] p-3">
            <p className="m-0 mb-2 text-[12px] text-[#878a99]">
              1.75 GB of 10 GB used
            </p>
            <div className="h-1.5 overflow-hidden rounded bg-[#e9ebec]">
              <div className="h-full w-[17.5%] rounded bg-[#405189]" />
            </div>
          </div>
        </div>

        {/* Message list */}
        <div
          className={`border-b border-[#e9ebec] lg:border-r lg:border-b-0 ${
            selected ? "lg:col-span-4" : "lg:col-span-9"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-[#e9ebec] p-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
            </div>
            <button
              type="button"
              className="rounded border border-[#e9ebec] p-2 text-[#878a99] hover:bg-[#f3f3f9]"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-[13px] text-[#878a99]">
                No conversations found
              </p>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(m.id);
                    markRead(m.id);
                  }}
                  className={`flex w-full items-start gap-2 border-b border-[#e9ebec] px-3 py-3 text-left hover:bg-[#f3f3f9] ${
                    selectedId === m.id ? "bg-[#e2e5ed]/60" : ""
                  } ${m.unread ? "bg-[#f8f9fa]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(m.id);
                    }}
                    className="mt-0.5 shrink-0 border-0 bg-transparent p-0"
                  >
                    <Star
                      size={14}
                      className={
                        m.starred
                          ? "fill-[#f7b84b] text-[#f7b84b]"
                          : "text-[#878a99]"
                      }
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-[13px] ${
                          m.unread
                            ? "font-semibold text-[#212529]"
                            : "text-[#495057]"
                        }`}
                      >
                        {m.from}
                      </span>
                      <span className="shrink-0 text-[11px] text-[#878a99]">
                        {m.date}
                      </span>
                    </div>
                    <p
                      className={`m-0 truncate text-[13px] ${
                        m.unread ? "font-medium text-[#405189]" : "text-[#495057]"
                      }`}
                    >
                      {m.subject}
                    </p>
                    <p className="m-0 truncate text-[12px] text-[#878a99]">
                      {m.preview}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="border-t border-[#e9ebec] px-3 py-2 text-[12px] text-[#878a99]">
            1-{filtered.length} of 154
          </div>
        </div>

        {/* Reader */}
        {selected && (
          <div className="flex flex-col lg:col-span-5">
            <div className="flex items-center gap-1 border-b border-[#e9ebec] px-3 py-2">
              {[
                { icon: <Archive size={14} />, label: "Archive" },
                { icon: <Trash2 size={14} />, label: "Delete" },
                { icon: <Reply size={14} />, label: "Reply" },
                { icon: <MoreHorizontal size={14} />, label: "More" },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  title={a.label}
                  className="rounded p-2 text-[#878a99] hover:bg-[#f3f3f9]"
                >
                  {a.icon}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h5 className="m-0 mb-3 text-[16px] font-semibold text-[#495057]">
                {selected.subject}
              </h5>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#405189] text-[12px] font-semibold text-white">
                  {selected.from
                    .split(",")[0]
                    .trim()
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div>
                  <p className="m-0 text-[13px] font-semibold text-[#495057]">
                    {selected.from}
                  </p>
                  <p className="m-0 text-[12px] text-[#878a99]">
                    to: me · {selected.date}
                  </p>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#495057]">
                {selected.body}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded border border-[#e9ebec] bg-[#f3f3f9] px-3 py-2 text-[12px] text-[#878a99]">
                <Paperclip size={14} />
                attachment.pdf · 245 KB
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
