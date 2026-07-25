"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  KeyRound,
  MoreHorizontal,
} from "lucide-react";

type ApiKey = {
  id: number;
  name: string;
  key: string;
  created: string;
  expiry: string;
  status: "Active" | "Expired" | "Disabled";
};

const initialKeys: ApiKey[] = [
  {
    id: 1,
    name: "Blog Post API",
    key: "b728c40f-4914-4f19-9871-62c6c4e1f2a1",
    created: "24 Sep, 2022",
    expiry: "24 Jan, 2023",
    status: "Active",
  },
  {
    id: 2,
    name: "Payment Gateway",
    key: "a1f2e3d4-5678-90ab-cdef-1234567890ab",
    created: "12 Aug, 2022",
    expiry: "12 Dec, 2022",
    status: "Expired",
  },
  {
    id: 3,
    name: "Mobile App SDK",
    key: "f9e8d7c6-b5a4-3210-9876-543210fedcba",
    created: "01 Oct, 2022",
    expiry: "01 Apr, 2023",
    status: "Active",
  },
  {
    id: 4,
    name: "Analytics Tracker",
    key: "11223344-5566-7788-99aa-bbccddeeff00",
    created: "18 Jul, 2022",
    expiry: "18 Jan, 2023",
    status: "Disabled",
  },
  {
    id: 5,
    name: "Webhook Listener",
    key: "deadbeef-cafe-babe-0000-111122223333",
    created: "05 Nov, 2022",
    expiry: "05 May, 2023",
    status: "Active",
  },
];

const statusStyle = {
  Active: "bg-[#daf4f0] text-[#0ab39c]",
  Expired: "bg-[#fde8e4] text-[#f06548]",
  Disabled: "bg-[#f3f3f9] text-[#878a99]",
};

function maskKey(key: string, visible: boolean) {
  if (visible) return key;
  return key.slice(0, 8) + "-****-****-****-" + key.slice(-4);
}

export default function ApiKeyApp() {
  const [keys, setKeys] = useState(initialKeys);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [name, setName] = useState("");

  const filtered = useMemo(
    () =>
      keys.filter((k) => k.name.toLowerCase().includes(query.toLowerCase())),
    [keys, query],
  );

  const createKey = () => {
    if (!name.trim()) return;
    const uuid = crypto.randomUUID();
    setKeys((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        key: uuid,
        created: new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        expiry: "—",
        status: "Active",
      },
      ...prev,
    ]);
    setName("");
  };

  const copyKey = async (id: number, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const remove = (id: number) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Total API Keys", value: keys.length, color: "#405189" },
          {
            label: "Active",
            value: keys.filter((k) => k.status === "Active").length,
            color: "#0ab39c",
          },
          {
            label: "Expired",
            value: keys.filter((k) => k.status === "Expired").length,
            color: "#f06548",
          },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="card-body flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                <KeyRound size={18} />
              </span>
              <div>
                <p className="m-0 text-[12px] text-[#878a99]">{s.label}</p>
                <p className="m-0 text-[20px] font-semibold text-[#495057]">
                  {s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header flex-wrap gap-2">
          <h5 className="card-title">API Keys</h5>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New key name"
              className="rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-1.5 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
            <button
              type="button"
              onClick={createKey}
              className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              <Plus size={14} /> Create Key
            </button>
          </div>
        </div>
        <div className="card-body overflow-x-auto p-0">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e9ebec] bg-[#f3f3f9] text-[#878a99]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">API Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Expiry</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-[#e9ebec] hover:bg-[#fafafa]"
                >
                  <td className="px-4 py-3 font-medium text-[#495057]">
                    {k.name}
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-[#f3f3f9] px-2 py-1 text-[12px] text-[#495057]">
                      {maskKey(k.key, !!visible[k.id])}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-[#878a99]">{k.created}</td>
                  <td className="px-4 py-3 text-[#878a99]">{k.expiry}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${statusStyle[k.status]}`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setVisible((v) => ({ ...v, [k.id]: !v[k.id] }))
                        }
                        className="rounded p-1.5 text-[#878a99] hover:bg-[#f3f3f9]"
                        title={visible[k.id] ? "Hide" : "Show"}
                      >
                        {visible[k.id] ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyKey(k.id, k.key)}
                        className="rounded p-1.5 text-[#878a99] hover:bg-[#e1f0fa] hover:text-[#299cdb]"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(k.id)}
                        className="rounded p-1.5 text-[#878a99] hover:bg-[#fde8e4] hover:text-[#f06548]"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1.5 text-[#878a99] hover:bg-[#f3f3f9]"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {copied === k.id && (
                        <span className="text-[11px] text-[#0ab39c]">
                          Copied!
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
