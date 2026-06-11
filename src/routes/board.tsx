import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { useStore } from "@/lib/store";
import { getMember, type TaskStatus } from "@/lib/mock-data";
import { Plus, Search, GripVertical, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Board — Atelier" },
      { name: "description", content: "Kanban board with drag-and-drop task management." },
    ],
  }),
  component: BoardPage,
});

const columns: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "testing", label: "Testing" },
  { id: "done", label: "Done" },
];

const priorityColor: Record<string, string> = {
  low: "var(--sage)",
  medium: "var(--mustard)",
  high: "var(--terracotta)",
  urgent: "var(--destructive)",
};

function BoardPage() {
  const { tasks, moveTask } = useStore();
  const [q, setQ] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const filtered = useMemo(
    () => tasks.filter((t) => q === "" || t.title.toLowerCase().includes(q.toLowerCase())),
    [tasks, q]
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Sprint 14"
        title="Board"
        description="Move work across the pipeline. Drag and drop between columns."
        actions={
          <CreateTaskDialog trigger={<Button className="gap-2"><Plus className="h-4 w-4" /> Add task</Button>} />
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className="pl-9 bg-card" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.id);
          const isOver = overCol === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
              onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
              onDrop={() => { if (dragId) moveTask(dragId, col.id); setDragId(null); setOverCol(null); }}
              className={`rounded-xl p-3 min-h-[60vh] border transition-colors ${isOver ? "bg-paper-2 border-terracotta" : "bg-paper-2/50 border-border"}`}
            >
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{col.label}</span>
                  <Badge variant="secondary" className="bg-card text-xs">{colTasks.length}</Badge>
                </div>
                <CreateTaskDialog
                  defaultStatus={col.id}
                  trigger={
                    <button className="text-muted-foreground hover:text-foreground" aria-label="Add task">
                      <Plus className="h-4 w-4" />
                    </button>
                  }
                />
              </div>

              <div className="space-y-2">
                {colTasks.map((t) => {
                  const m = getMember(t.assigneeId);
                  return (
                    <Card
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      className="p-3 bg-card border-border cursor-grab active:cursor-grabbing hover:border-ink/40 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium leading-snug">{t.title}</div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: priorityColor[t.priority] }} />
                              <span className="text-[11px] text-muted-foreground capitalize">{t.priority}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                              <div className="h-6 w-6 rounded-full grid place-items-center text-[10px] text-paper font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
