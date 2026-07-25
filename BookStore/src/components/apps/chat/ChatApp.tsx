"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Users,
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastMessage: string;
  time: string;
  unread?: number;
  channel?: boolean;
  members?: number;
};

type Message = {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
};

const contacts: Contact[] = [
  {
    id: "1",
    name: "Lisa Parker",
    avatar: "LP",
    status: "online",
    lastMessage: "Hey, how are you?",
    time: "02:56",
    unread: 2,
  },
  {
    id: "2",
    name: "Frank Thomas",
    avatar: "FT",
    status: "online",
    lastMessage: "Please check the docs",
    time: "10:28",
  },
  {
    id: "3",
    name: "Clifford Taylor",
    avatar: "CT",
    status: "away",
    lastMessage: "I'll be back soon",
    time: "Yesterday",
  },
  {
    id: "4",
    name: "Janette Dalton",
    avatar: "JD",
    status: "offline",
    lastMessage: "Thanks for the update!",
    time: "12:34",
  },
  {
    id: "5",
    name: "Sarah Alina",
    avatar: "SA",
    status: "online",
    lastMessage: "Can we schedule a call?",
    time: "Yesterday",
  },
];

const channels: Contact[] = [
  {
    id: "c1",
    name: "Landing Design",
    avatar: "#",
    status: "online",
    lastMessage: "New mockups uploaded",
    time: "1 hr",
    channel: true,
    members: 12,
  },
  {
    id: "c2",
    name: "Lisa Parker",
    avatar: "LP",
    status: "online",
    lastMessage: "Team sync complete",
    time: "3 hr",
    channel: true,
    members: 24,
  },
];

const seedMessages: Message[] = [
  {
    id: 1,
    from: "them",
    text: "Good morning 😊",
    time: "09:07 am",
  },
  {
    id: 2,
    from: "me",
    text: "Good morning, How are you? What about our next meeting?",
    time: "09:08 am",
  },
  {
    id: 3,
    from: "them",
    text: "Yeah everything is fine. Our next meeting tomorrow at 10.00 AM",
    time: "09:10 am",
  },
  {
    id: 4,
    from: "me",
    text: "Wow that's great",
    time: "09:12 am",
  },
];

const statusDot: Record<Contact["status"], string> = {
  online: "bg-[#0ab39c]",
  away: "bg-[#f7b84b]",
  offline: "bg-[#878a99]",
};

const avatarColors = ["#405189", "#0ab39c", "#299cdb", "#f7b84b", "#f06548"];

export default function ChatApp() {
  const [tab, setTab] = useState<"chats" | "contacts">("chats");
  const [activeId, setActiveId] = useState("1");
  const [messages, setMessages] = useState(seedMessages);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const active =
    [...contacts, ...channels].find((c) => c.id === activeId) ?? contacts[0];

  const list = (tab === "chats" ? contacts : contacts)
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "me",
        text: draft.trim(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="card overflow-hidden">
      <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-12">
        {/* Left list */}
        <div className="border-b border-[#e9ebec] lg:col-span-4 lg:border-r lg:border-b-0">
          <div className="border-b border-[#e9ebec] p-4">
            <div className="mb-3 flex gap-2">
              {(["chats", "contacts"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded px-3 py-1.5 text-[13px] font-medium capitalize ${
                    tab === t
                      ? "bg-[#405189] text-white"
                      : "bg-[#f3f3f9] text-[#878a99]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here..."
                className="w-full rounded border border-[#e9ebec] bg-[#f3f6f9] py-2 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto p-3">
            <p className="mb-2 px-2 text-[11px] font-semibold tracking-wide text-[#878a99] uppercase">
              Direct Messages
            </p>
            {list.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded px-2 py-2 text-left ${
                  activeId === c.id ? "bg-[#e2e5ed]" : "hover:bg-[#f3f3f9]"
                }`}
              >
                <div className="relative">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                  >
                    {c.avatar}
                  </span>
                  <span
                    className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white ${statusDot[c.status]}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-[#495057]">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-[#878a99]">
                      {c.time}
                    </span>
                  </div>
                  <p className="m-0 truncate text-[12px] text-[#878a99]">
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread ? (
                  <span className="rounded bg-[#f06548] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {c.unread}
                  </span>
                ) : null}
              </button>
            ))}

            <p className="mt-4 mb-2 px-2 text-[11px] font-semibold tracking-wide text-[#878a99] uppercase">
              Channels
            </p>
            {channels.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded px-2 py-2 text-left ${
                  activeId === c.id ? "bg-[#e2e5ed]" : "hover:bg-[#f3f3f9]"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#299cdb]/15 text-[#299cdb]">
                  <Users size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#495057]">
                    {c.name}
                  </span>
                  <span className="text-[12px] text-[#878a99]">
                    {c.members} Members
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[#e9ebec] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#405189] text-[12px] font-semibold text-white">
                {active.avatar === "#" ? <Users size={16} /> : active.avatar}
              </span>
              <div>
                <p className="m-0 text-[14px] font-semibold text-[#495057]">
                  {active.name}
                </p>
                <p className="m-0 text-[12px] capitalize text-[#0ab39c]">
                  {active.channel ? `${active.members} Members` : active.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#878a99]">
              <button type="button" className="rounded p-2 hover:bg-[#f3f3f9]">
                <Phone size={16} />
              </button>
              <button type="button" className="rounded p-2 hover:bg-[#f3f3f9]">
                <Video size={16} />
              </button>
              <button type="button" className="rounded p-2 hover:bg-[#f3f3f9]">
                <Search size={16} />
              </button>
              <button type="button" className="rounded p-2 hover:bg-[#f3f3f9]">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f3f3f9]/50 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-[13px] shadow-sm ${
                    m.from === "me"
                      ? "rounded-br-none bg-[#405189] text-white"
                      : "rounded-bl-none bg-white text-[#495057]"
                  }`}
                >
                  <p className="m-0 whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      m.from === "me" ? "text-white/70" : "text-[#878a99]"
                    }`}
                  >
                    {m.time}
                    {m.from === "me" && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-[#e9ebec] p-3">
            <button
              type="button"
              className="rounded p-2 text-[#878a99] hover:bg-[#f3f3f9]"
            >
              <Smile size={18} />
            </button>
            <button
              type="button"
              className="rounded p-2 text-[#878a99] hover:bg-[#f3f3f9]"
            >
              <Paperclip size={18} />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Please Enter a Message"
              className="flex-1 rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
            />
            <button
              type="button"
              onClick={send}
              className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
