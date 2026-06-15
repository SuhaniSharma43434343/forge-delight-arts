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
import { TaskDetailsDrawer } from "@/components/task-details-drawer";
import { useStore } from "@/lib/store";
import { getMember, team, Task, TaskStatus } from "@/lib/mock-data";
import { Plus, Search, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { isSameDay, isThisWeek, isBefore, startOfDay, parseISO } from "date-fns";

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
  const [status, setStatus] = useState<string>("all");
  const [assigneeId, setAssigneeId] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerTask, setDrawerTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const today = startOfDay(new Date());
    return tasks.filter((t) => {
      if (priority !== "all" && t.priority !== priority) return false;
      if (projectId !== "all" && t.projectId !== projectId) return false;
      if (status !== "all" && t.status !== status) return false;
      if (assigneeId !== "all" && t.assigneeId !== assigneeId) return false;
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      
      if (dateFilter !== "all") {
        const dueDate = parseISO(t.dueDate);
        if (dateFilter === "overdue") return isBefore(dueDate, today) && t.status !== "done";
        if (dateFilter === "today") return isSameDay(dueDate, today);
        if (dateFilter === "week") return isThisWeek(dueDate);
      }
      return true;
    });
  }, [tasks, q, priority, projectId, status, assigneeId, dateFilter]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(filtered.map(t => t.id)));
    else setSelectedIds(new Set());
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTask(id));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} tasks deleted`);
  };

  const handleBulkStatus = (newStatus: TaskStatus) => {
    selectedIds.forEach(id => updateTask(id, { status: newStatus }));
    setSelectedIds(new Set());
    toast.success(`Status updated for ${selectedIds.size} tasks`);
  };

  const handleBulkAssign = (newAssigneeId: string) => {
    selectedIds.forEach(id => updateTask(id, { assigneeId: newAssigneeId }));
    setSelectedIds(new Set());
    toast.success(`Assignee updated for ${selectedIds.size} tasks`);
  };

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

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

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className="pl-9 bg-card" />
        </div>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Assignee" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Everyone</SelectItem>
            {team.map((m) => <SelectItem key={m.id} value={m.id}>{m.name.split(" ")[0]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Date" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Due Today</SelectItem>
            <SelectItem value="week">Due This Week</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedIds.size > 0 && (
        <Card className="mb-4 bg-terracotta/10 border-terracotta/20 p-2 px-4 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="text-sm font-medium text-terracotta">{selectedIds.size} selected</div>
          <div className="flex items-center gap-2">
            <Select onValueChange={(v) => handleBulkStatus(v as TaskStatus)}>
              <SelectTrigger className="h-8 text-xs w-[130px] bg-card border-terracotta/20"><SelectValue placeholder="Set status..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleBulkAssign}>
              <SelectTrigger className="h-8 text-xs w-[130px] bg-card border-terracotta/20"><SelectValue placeholder="Assign to..." /></SelectTrigger>
              <SelectContent>
                {team.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" className="h-8 gap-1.5" onClick={handleBulkDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </Card>
      )}

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper-2 text-left border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                </th>
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
                const isSelected = selectedIds.has(t.id);
                const isDone = t.status === "done";
                
                return (
                  <tr 
                    key={t.id} 
                    className={`group border-b border-border hover:bg-paper-2/40 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                    onClick={() => setDrawerTask(t)}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(v) => toggleSelect(t.id, !!v)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button 
                          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTask(t.id, { status: isDone ? "todo" : "done" });
                          }}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4" />}
                        </button>
                        <span className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
                          <span className="truncate max-w-[120px]">{p.name}</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="bg-paper-2">{t.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3 capitalize">{t.priority}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full grid place-items-center text-paper text-[10px] font-medium shrink-0" style={{ background: m.avatarColor }}>{m.initials}</div>
                        <span className="truncate max-w-[100px]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => { deleteTask(t.id); toast.success("Task deleted"); }}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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

      <TaskDetailsDrawer 
        task={drawerTask} 
        open={!!drawerTask} 
        onOpenChange={(open) => {
          if (!open) setDrawerTask(null);
        }} 
      />
    </AppShell>
  );
}
