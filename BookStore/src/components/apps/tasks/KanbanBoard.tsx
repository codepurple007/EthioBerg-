"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Eye,
} from "lucide-react";

type TaskCard = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  progress?: number;
  comments: number;
  files: number;
  avatars: string[];
};

type Column = {
  id: string;
  title: string;
  color: string;
  tasks: TaskCard[];
};

const initialColumns: Column[] = [
  {
    id: "unassigned",
    title: "Unassigned",
    color: "#878a99",
    tasks: [
      {
        id: "#VL2436",
        title: "Profile Page Structure",
        description:
          "Profile Page means a web page accessible to the public or to guests.",
        tags: ["Admin"],
        date: "03 Jan, 2022",
        progress: 15,
        comments: 2,
        files: 1,
        avatars: ["EK", "JV"],
      },
      {
        id: "#VL2437",
        title: "Velzon - Admin Layout Design",
        description: "The dashboard is the front page of the Administration UI.",
        tags: ["Layout", "Admin", "Dashboard"],
        date: "07 Jan, 2022",
        comments: 5,
        files: 2,
        avatars: ["AS"],
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "#299cdb",
    tasks: [
      {
        id: "#VL2438",
        title: "Admin Layout Design",
        description:
          "Landing page template with clean, minimal and modern design.",
        tags: ["Design", "Website"],
        date: "07 Jan, 2022",
        comments: 1,
        files: 0,
        avatars: ["JR", "TJ"],
      },
      {
        id: "#VL2439",
        title: "Marketing & Sales",
        description:
          "Sales and marketing are two business functions within an organization.",
        tags: ["Marketing", "Business"],
        date: "27 Dec, 2021",
        comments: 3,
        files: 1,
        avatars: ["JF"],
      },
    ],
  },
  {
    id: "inprogress",
    title: "Inprogress",
    color: "#f7b84b",
    tasks: [
      {
        id: "#VL2440",
        title: "Brand Logo Design",
        description:
          "BrandCrowd's brand logo maker allows you to generate stand-out logos.",
        tags: ["Logo", "Design", "UI/UX"],
        date: "22 Dec, 2021",
        comments: 4,
        files: 3,
        avatars: ["CW", "AF"],
      },
      {
        id: "#VL2441",
        title: "Change Old App Icon",
        description: "Change app icons on Android: How do you change the look.",
        tags: ["Design", "Website"],
        date: "24 Oct, 2021",
        comments: 0,
        files: 1,
        avatars: ["TH"],
      },
    ],
  },
  {
    id: "reviews",
    title: "In Reviews",
    color: "#405189",
    tasks: [
      {
        id: "#VL2442",
        title: "Create Product Animations",
        description: "Create product animations for ecommerce pages.",
        tags: ["Ecommerce"],
        date: "16 Nov, 2021",
        comments: 2,
        files: 4,
        avatars: ["KR"],
      },
      {
        id: "#VL2443",
        title: "Product Features Analysis",
        description: "An essential part of strategic planning is feature analysis.",
        tags: ["Product", "Analysis"],
        date: "05 Jan, 2022",
        comments: 1,
        files: 0,
        avatars: ["JM", "CV"],
      },
      {
        id: "#VL2444",
        title: "Create a Graph of Sketch",
        description: "To make a pie chart with equal slices create a perfect circle.",
        tags: ["Sketch", "Marketing", "Design"],
        date: "05 Nov, 2021",
        comments: 6,
        files: 2,
        avatars: ["XB"],
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    color: "#0ab39c",
    tasks: [
      {
        id: "#VL2451",
        title: "Create a Blog Template UI",
        description:
          "Landing page template with clean, minimal and modern design.",
        tags: ["Design", "Website"],
        date: "3 Day",
        progress: 35,
        comments: 8,
        files: 1,
        avatars: ["EK", "AS", "TJ"],
      },
    ],
  },
];

const tagColors = [
  "bg-[#e2e5ed] text-[#405189]",
  "bg-[#daf4f0] text-[#0ab39c]",
  "bg-[#e1f0fa] text-[#299cdb]",
  "bg-[#fef4e4] text-[#f7b84b]",
  "bg-[#fde8e4] text-[#f06548]",
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);

  const addTask = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: `#VL${Math.floor(Math.random() * 9000 + 1000)}`,
                  title: "New Task",
                  description: "Click to edit this task description.",
                  tags: ["New"],
                  date: "Today",
                  comments: 0,
                  files: 0,
                  avatars: ["ME"],
                },
              ],
            }
          : col,
      ),
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h5 className="m-0 text-[15px] font-semibold text-[#495057]">
          Kanban Board
        </h5>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border-0 bg-[#405189] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#364574]"
        >
          <Plus size={14} /> Create Board
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <div
            key={col.id}
            className="w-[300px] shrink-0 rounded border border-[#e9ebec] bg-[#f3f3f9]"
          >
            <div className="flex items-center justify-between border-b border-[#e9ebec] px-3 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: col.color }}
                />
                <span className="text-[14px] font-semibold text-[#495057]">
                  {col.title}
                </span>
                <span className="rounded bg-white px-1.5 text-[11px] font-semibold text-[#878a99]">
                  {col.tasks.length}
                </span>
              </div>
              <button
                type="button"
                className="rounded p-1 text-[#878a99] hover:bg-white"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>

            <div className="space-y-3 p-3">
              {col.tasks.map((task) => (
                <div key={task.id} className="card shadow-sm">
                  <div className="card-body p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="text-[11px] font-medium text-[#878a99]">
                        {task.id}
                      </span>
                      <button
                        type="button"
                        className="rounded p-0.5 text-[#878a99] hover:bg-[#f3f3f9]"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                    <h6 className="m-0 mb-1 text-[13px] font-semibold text-[#495057]">
                      {task.title}
                    </h6>
                    <p className="m-0 mb-2 line-clamp-2 text-[12px] text-[#878a99]">
                      {task.description}
                    </p>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {task.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${tagColors[i % tagColors.length]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {task.progress != null && (
                      <div className="mb-2">
                        <div className="mb-1 flex justify-between text-[10px] text-[#878a99]">
                          <span>{task.progress}% of 100%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded bg-[#e9ebec]">
                          <div
                            className="h-full rounded bg-[#0ab39c]"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {task.avatars.map((a, i) => (
                          <span
                            key={a}
                            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold text-white"
                            style={{
                              background: [
                                "#405189",
                                "#0ab39c",
                                "#299cdb",
                                "#f7b84b",
                              ][i % 4],
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#878a99]">
                        <span className="inline-flex items-center gap-0.5">
                          <MessageSquare size={11} /> {task.comments}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <Paperclip size={11} /> {task.files}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <Eye size={11} />
                        </span>
                      </div>
                    </div>
                    <p className="m-0 mt-2 text-[11px] text-[#878a99]">
                      {task.date}
                    </p>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addTask(col.id)}
                className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-[#e9ebec] bg-white py-2 text-[12px] font-medium text-[#878a99] hover:border-[#405189] hover:text-[#405189]"
              >
                <Plus size={13} /> Add More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
