import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { AvatarStack } from "@/components/avatar-stack";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { useStore } from "@/lib/store";
import { Plus, Search, Archive, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Atelier" },
      { name: "description", content: "Browse, search, and manage all studio projects." },
    ],
  }),
  component: ProjectsPage,
});

const statusLabel: Record<string, string> = {
  active: "Active", on_hold: "On hold", completed: "Completed", archived: "Archived",
};

function ProjectsPage() {
  const { projects, archiveProject } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return projects.filter((p) =>
      (status === "all" || p.status === status) &&
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [projects, q, status]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="A library of everything the studio is building. Search, filter, or open one to dive in."
        actions={
          <CreateProjectDialog trigger={<Button className="gap-2"><Plus className="h-4 w-4" /> New project</Button>} />
        }
      />

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="pl-9 bg-card" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px] bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 bg-card border-border text-center">
          <div className="font-display text-2xl">No projects yet</div>
          <p className="text-muted-foreground text-sm mt-1">Create your first project to get started.</p>
          <CreateProjectDialog trigger={<Button className="gap-2 mt-4 mx-auto"><Plus className="h-4 w-4" /> New project</Button>} />
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <Card key={p.id} className="p-6 bg-card border-border h-full hover:border-ink/40 transition-colors group flex flex-col">
            <Link to="/projects/$id" params={{ id: p.id }} className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                  <Badge variant="secondary" className="bg-paper-2 text-xs">{statusLabel[p.status]}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <h3 className="font-display text-2xl leading-tight group-hover:text-terracotta transition-colors">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <AvatarStack ids={p.memberIds} />
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{p.memberIds.length}</span> members ·{" "}
                  <span className="font-medium text-foreground">{p.taskCount}</span> tasks
                </div>
              </div>
            </Link>
            {p.status !== "archived" && (
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={(e) => { e.preventDefault(); archiveProject(p.id); toast.success(`Archived "${p.name}"`); }}
                >
                  <Archive className="h-3.5 w-3.5" /> Archive
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
