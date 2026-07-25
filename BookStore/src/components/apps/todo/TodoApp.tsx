"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  CalendarDays,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";

type TodoStatus = "New" | "Inprogress" | "Completed";

type Todo = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: TodoStatus;
  due: string;
  done: boolean;
};

const categories = [
  { name: "All", color: "#405189" },
  { name: "My Day", color: "#299cdb" },
  { name: "Important", color: "#f06548" },
  { name: "Planned", color: "#f7b84b" },
  { name: "Assigned to me", color: "#0ab39c" },
];

const projects = [
  { name: "Velzon Project", color: "#405189", count: 4 },
  { name: "New Theme", color: "#0ab39c", count: 2 },
  { name: "Admin Design", color: "#f7b84b", count: 3 },
];

const initialTodos: Todo[] = [
  {
    id: 1,
    title: "Added Email Templates",
    description: "Create transactional email templates for onboarding.",
    category: "My Day",
    status: "Inprogress",
    due: "15 Jan, 2022",
    done: false,
  },
  {
    id: 2,
    title: "Additional Calendar",
    description: "Add month-grid and week views to calendar app.",
    category: "Important",
    status: "New",
    due: "20 Jan, 2022",
    done: false,
  },
  {
    id: 3,
    title: "Edit customer testimonial",
    description: "Update testimonials on marketing site.",
    category: "Planned",
    status: "Completed",
    due: "12 Jan, 2022",
    done: true,
  },
  {
    id: 4,
    title: "Brand Logo Design",
    description: "Finalize SVG brand mark for Velzon.",
    category: "Assigned to me",
    status: "Inprogress",
    due: "22 Jan, 2022",
    done: false,
  },
  {
    id: 5,
    title: "User Profile Layout",
    description: "Ship tabs and settings for profile page.",
    category: "My Day",
    status: "New",
    due: "25 Jan, 2022",
    done: false,
  },
  {
    id: 6,
    title: "Banner design for FB & Twitter",
    description: "Create social campaign creative set.",
    category: "Important",
    status: "Completed",
    due: "10 Jan, 2022",
    done: true,
  },
];

const statusStyle: Record<TodoStatus, string> = {
  New: "bg-[#e1f0fa] text-[#299cdb]",
  Inprogress: "bg-[#fef4e4] text-[#f7b84b]",
  Completed: "bg-[#daf4f0] text-[#0ab39c]",
};

export default function TodoApp() {
  const [activeCat, setActiveCat] = useState("All");
  const [todos, setTodos] = useState(initialTodos);
  const [query, setQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      const catOk = activeCat === "All" || t.category === activeCat;
      const q = query.toLowerCase();
      return (
        catOk &&
        (t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q))
      );
    });
  }, [todos, activeCat, query]);

  const toggleDone = (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              status: !t.done ? "Completed" : "Inprogress",
            }
          : t,
      ),
    );
  };

  const remove = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const addTodo = () => {
    if (!newTitle.trim()) return;
    setTodos((prev) => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        description: "Newly added task",
        category: activeCat === "All" ? "My Day" : activeCat,
        status: "New",
        due: "Today",
        done: false,
      },
      ...prev,
    ]);
    setNewTitle("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-3">
        <div className="card">
          <div className="card-body">
            <button
              type="button"
              onClick={addTodo}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded border-0 bg-[#405189] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#364574]"
            >
              <Plus size={15} /> Add Task
            </button>
            <ul className="m-0 mb-4 list-none space-y-0.5 p-0">
              {categories.map((c) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => setActiveCat(c.name)}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-[13px] ${
                      activeCat === c.name
                        ? "bg-[#e2e5ed] font-medium text-[#405189]"
                        : "text-[#495057] hover:bg-[#f3f3f9]"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#878a99] uppercase">
              Projects
            </p>
            <ul className="m-0 list-none space-y-1 p-0">
              {projects.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-2 rounded px-3 py-2 text-[13px] text-[#495057]"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="flex-1">{p.name}</span>
                  <span className="text-[11px] text-[#878a99]">{p.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="xl:col-span-9">
        <div className="card">
          <div className="card-header flex-wrap gap-2">
            <h5 className="card-title">
              {activeCat === "All" ? "All Tasks" : activeCat}
            </h5>
            <div className="relative">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#878a99]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="rounded border border-[#e9ebec] bg-[#f3f6f9] py-1.5 pr-3 pl-9 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
            </div>
          </div>
          <div className="card-body border-b border-[#e9ebec]">
            <div className="flex gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Enter task title..."
                className="flex-1 rounded border border-[#e9ebec] bg-[#f3f6f9] px-3 py-2 text-[13px] outline-none focus:border-[#405189] focus:bg-white"
              />
              <button
                type="button"
                onClick={addTodo}
                className="rounded border-0 bg-[#0ab39c] px-4 text-[13px] font-medium text-white hover:bg-[#099885]"
              >
                Add
              </button>
            </div>
          </div>
          <div className="divide-y divide-[#e9ebec]">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[#f3f3f9]/60"
              >
                <button
                  type="button"
                  onClick={() => toggleDone(t.id)}
                  className="mt-0.5 shrink-0 border-0 bg-transparent p-0 text-[#405189]"
                >
                  {t.done ? (
                    <CheckCircle2 size={18} className="text-[#0ab39c]" />
                  ) : (
                    <Circle size={18} className="text-[#878a99]" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[14px] font-medium ${
                        t.done
                          ? "text-[#878a99] line-through"
                          : "text-[#495057]"
                      }`}
                    >
                      {t.title}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="m-0 mb-1 text-[12px] text-[#878a99]">
                    {t.description}
                  </p>
                  <p className="m-0 flex items-center gap-1 text-[11px] text-[#878a99]">
                    <CalendarDays size={11} /> {t.due} · {t.category}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    className="rounded p-1.5 text-[#878a99] hover:bg-[#fde8e4] hover:text-[#f06548]"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1.5 text-[#878a99] hover:bg-[#f3f3f9]"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
