import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { useStore } from "@/lib/store";
import { getMember } from "@/lib/mock-data";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Atelier" },
      { name: "description", content: "All tasks across every project, filterable and sortable." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, projects, updateTask, deleteTask } = useStore();
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<string>("all");
  const [projectId, setProjectId] = useState<string>("all");

  const filtered = useMemo(() => tasks.filter((t) =>
    (priority === "all" || t.priority === priority) &&
    (projectId === "all" || t.projectId === projectId) &&
    (q === "" || t.title.toLowerCase().includes(q.toLowerCase()))
  ), [tasks, q, priority, projectId]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="All work"
        title="Tasks"
        description="A single list of everything in flight, across every project."
        actions={
          <CreateTaskDialog trigger={<Button className="gap-2"><Plus className="h-4 w-4" /> New task</Button>} />
        }
      />

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className="pl-9 bg-card" />
        </div>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-[200px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper-2 text-left">
              <tr>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const m = getMember(t.assigneeId);
                const p = projects.find((x) => x.id === t.projectId);
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-paper-2/40">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={t.status === "done"}
                        onCheckedChange={(v) => updateTask(t.id, { status: v ? "done" : "todo" })}
                      />
                    </td>
                    <td className={`px-4 py-3 font-medium ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</td>
                    <td className="px-4 py-3">
                      {p ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                          {p.name}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="bg-paper-2">{t.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3 capitalize">{t.priority}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full grid place-items-center text-paper text-[10px] font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { deleteTask(t.id); toast.success("Task deleted"); }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No tasks match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
