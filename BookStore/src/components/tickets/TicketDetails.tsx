"use client";

import {
  MoreHorizontal,
  Eye,
  Share2,
  Trash2,
  FileArchive,
  FileSpreadsheet,
  Send,
} from "lucide-react";
import { useState } from "react";

const ticketMeta = [
  { label: "Ticket No", value: "#VLZ135" },
  { label: "Client", value: "Themesbrand" },
  { label: "Requested By", value: "Tonya Johnson" },
  { label: "Assigned To", value: "Erica Kernan" },
  { label: "Create Date", value: "20 Dec, 2021" },
  { label: "Due Date", value: "29 Dec, 2021" },
  { label: "Status", value: "New", badge: "new" as const },
  { label: "Priority", value: "High", badge: "high" as const },
];

const labels = [
  { name: "Admin", color: "#405189" },
  { name: "UI/UX", color: "#0ab39c" },
  { name: "Dashboard", color: "#f7b84b" },
  { name: "Design", color: "#f06548" },
];

const comments = [
  {
    name: "Joseph Parker",
    time: "20 Dec 2021 - 05:47AM",
    avatar: "JP",
    avatarBg: "#405189",
    body: "I am getting message from customers that when they place order always get error message.",
  },
  {
    name: "Alexis Clarke",
    time: "22 Dec 2021 - 02:32PM",
    avatar: "AC",
    avatarBg: "#0ab39c",
    body: "Please be sure to check your Spam mailbox to see if your email filters have identified the email from Dell as spam.",
  },
  {
    name: "Donald Palmer",
    time: "24 Dec 2021 - 05:20PM",
    avatar: "DP",
    avatarBg: "#f7b84b",
    body: "If you have further questions, please feel free to contact us for any assistance.",
  },
  {
    name: "Alexis Clarke",
    time: "26 min ago",
    avatar: "AC",
    avatarBg: "#0ab39c",
    body: "Other shipping methods are available at checkout if you want your purchase delivered faster.",
  },
  {
    name: "Donald Palmer",
    time: "8 sec ago",
    avatar: "DP",
    avatarBg: "#f7b84b",
    body: "Looking forward to your update once the UI screens have been finalized.",
  },
];

const attachments = [
  { name: "Velzon-admin.zip", size: "3.4 MB", icon: FileArchive },
  { name: "Velzon-admin.ppt", size: "1.2 MB", icon: FileSpreadsheet },
];

export default function TicketDetails() {
  const [openMenu, setOpenMenu] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      {/* Main content */}
      <div className="space-y-4 xl:col-span-9">
        <div className="card">
          <div className="card-body">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h5 className="mb-2 text-[16px] font-semibold text-[#495057]">
                  #VLZ135 - Create an Excellent UI for a Dashboard
                </h5>
                <p className="m-0 flex flex-wrap items-center gap-2 text-[13px] text-[#878a99]">
                  <span className="font-medium text-[#495057]">Themesbrand</span>
                  <span className="opacity-40">•</span>
                  <span>Create Date : 20 Dec, 2021</span>
                  <span className="opacity-40">•</span>
                  <span>Due Date : 29 Dec, 2021</span>
                </p>
              </div>
              <div className="relative flex flex-wrap items-center gap-2">
                <span className="rounded bg-[#e2e5ed] px-2 py-1 text-[11px] font-semibold uppercase text-[#405189]">
                  New
                </span>
                <span className="rounded bg-[#fde8e4] px-2 py-1 text-[11px] font-semibold uppercase text-[#f06548]">
                  High
                </span>
                <button
                  type="button"
                  onClick={() => setOpenMenu((v) => !v)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#878a99] hover:bg-[#f3f6f9]"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenu && (
                  <div className="absolute top-10 right-0 z-20 min-w-[140px] rounded border border-[#e9ebec] bg-white py-1 shadow-md">
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#495057] hover:bg-[#f3f6f9]"
                    >
                      <Share2 size={14} />
                      Share with
                    </button>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-[13px] text-[#f06548] hover:bg-[#f3f6f9]"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h6 className="mb-3 text-[14px] font-semibold text-[#495057]">
              Ticket Description
            </h6>
            <p className="mb-3 text-[13px] leading-relaxed text-[#878a99]">
              Create an Excellent UI for a Dashboard. A good dashboard design
              should provide key information at a glance, highlight important
              metrics, and remain flexible as data needs evolve.
            </p>
            <ul className="mb-4 list-disc space-y-1.5 pl-5 text-[13px] text-[#878a99]">
              <li>Pick a Dashboard Type</li>
              <li>Categorize information when needed</li>
              <li>Provide Context</li>
              <li>On using colors</li>
              <li>On using the right graphs</li>
            </ul>

            <h6 className="mb-2 text-[14px] font-semibold text-[#495057]">
              Here is the code you&apos;ve requested
            </h6>
            <pre className="m-0 overflow-x-auto rounded border border-[#e9ebec] bg-[#f3f6f9] p-4 text-[12px] leading-relaxed text-[#495057]">
{`var app = document.getElementById("app");
var run = (model) => get(model, "users", () =>
    get(model, "posts",
    () => {
        model.users.forEach(user => model.userIdx[user.id] = user);
        app.innerText = '';
        model.posts.forEach(post =>
        app.appendChild(renderPost(post, model.userIdx[post.userId])));
    }));
app.appendChild(Wrapper.generate("button", "Load").click(() => run({
    userIdx: {}
})).element);`}
            </pre>
          </div>
        </div>

        {/* Comments */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Comments</h5>
          </div>
          <div className="card-body space-y-4">
            {comments.map((c) => (
              <div key={`${c.name}-${c.time}`} className="flex gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ background: c.avatarBg }}
                >
                  {c.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h6 className="m-0 text-[13px] font-semibold text-[#495057]">
                      {c.name}
                    </h6>
                    <span className="text-[12px] text-[#878a99]">{c.time}</span>
                  </div>
                  <p className="m-0 text-[13px] leading-relaxed text-[#878a99]">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t border-[#e9ebec] pt-4">
              <label className="mb-2 block text-[13px] font-medium text-[#495057]">
                Leave a Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Enter comments"
                className="mb-3 w-full rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] text-[#495057] outline-none placeholder:text-[#878a99] focus:border-[#405189] focus:bg-white"
              />
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border-0 bg-[#0ab39c] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#099885]"
              >
                <Send size={14} />
                Post Comments
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 xl:col-span-3">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Ticket Details</h5>
          </div>
          <div className="card-body !p-0">
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                {ticketMeta.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[#e9ebec] last:border-0"
                  >
                    <td className="w-[40%] px-4 py-3 font-medium text-[#878a99]">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-[#495057]">
                      {row.badge === "new" ? (
                        <span className="rounded bg-[#e2e5ed] px-2 py-1 text-[11px] font-semibold uppercase text-[#405189]">
                          {row.value}
                        </span>
                      ) : row.badge === "high" ? (
                        <span className="rounded bg-[#fde8e4] px-2 py-1 text-[11px] font-semibold uppercase text-[#f06548]">
                          {row.value}
                        </span>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Labels</h5>
          </div>
          <div className="card-body flex flex-wrap gap-2">
            {labels.map((label) => (
              <span
                key={label.name}
                className="rounded px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ background: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Files Attachment</h5>
          </div>
          <div className="card-body space-y-3">
            {attachments.map((file) => {
              const Icon = file.icon;
              return (
                <div
                  key={file.name}
                  className="flex items-center gap-3 rounded border border-[#e9ebec] px-3 py-2.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f3f6f9] text-[#405189]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[13px] font-medium text-[#495057]">
                      {file.name}
                    </p>
                    <p className="m-0 text-[12px] text-[#878a99]">{file.size}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
