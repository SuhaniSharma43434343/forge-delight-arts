import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { AvatarStack } from "@/components/avatar-stack";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { activity, getMember, getProject, tasks } from "@/lib/mock-data";
import { ArrowLeft, FileText, Image as ImageIcon, Download } from "lucide-react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = getProject(params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project?.name ?? "Project"} — Atelier` },
      { name: "description", content: loaderData?.project?.description ?? "Project details" },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-20">
        <h2 className="font-display text-3xl">Project not found</h2>
        <Link to="/projects" className="text-terracotta mt-4 inline-block">Back to projects</Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="text-center py-20">
        <h2 className="font-display text-3xl">Something went wrong</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <Button onClick={reset} className="mt-4">Try again</Button>
      </div>
    </AppShell>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const burnup = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    done: Math.round((i + 1) * (project.progress / 8)),
    scope: project.taskCount,
  }));

  return (
    <AppShell>
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>

      <PageHeader
        eyebrow={project.status.replace("_", " ")}
        title={project.name}
        description={project.description}
        actions={
          <>
            <AvatarStack ids={project.memberIds} />
            <Button>Edit project</Button>
          </>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 bg-card border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Progress</div>
          <div className="font-display text-3xl mt-2">{project.progress}%</div>
          <Progress value={project.progress} className="h-1.5 mt-3" />
        </Card>
        <Card className="p-5 bg-card border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tasks</div>
          <div className="font-display text-3xl mt-2">{project.taskCount}</div>
          <div className="text-xs text-muted-foreground mt-1">{projectTasks.filter(t=>t.status==="done").length} done</div>
        </Card>
        <Card className="p-5 bg-card border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Members</div>
          <div className="font-display text-3xl mt-2">{project.memberIds.length}</div>
        </Card>
        <Card className="p-5 bg-card border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Due</div>
          <div className="font-display text-3xl mt-2">
            {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-paper-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 bg-card border-border">
            <div className="font-display text-xl mb-4">Burn-up</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnup}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="done" stroke="var(--terracotta)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="scope" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="font-display text-xl mb-4">Team</div>
            <ul className="space-y-3">
              {project.memberIds.map((id: string) => {
                const m = getMember(id);
                return (
                  <li key={id} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full grid place-items-center text-paper text-xs font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-6 lg:col-span-3 bg-card border-border">
            <div className="font-display text-xl mb-4">Recent activity</div>
            <ul className="divide-y divide-border">
              {activity.map(a => {
                const m = getMember(a.actorId);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                    <div className="h-7 w-7 rounded-full grid place-items-center text-paper text-[11px] font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                    <span><span className="font-medium">{m.name}</span> <span className="text-muted-foreground">{a.action}</span> <span className="font-medium">{a.target}</span></span>
                    <span className="ml-auto text-xs text-muted-foreground">{a.timestamp}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card className="bg-card border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-2 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Assignee</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map(t => {
                  const m = getMember(t.assigneeId);
                  return (
                    <tr key={t.id} className="border-t border-border hover:bg-paper-2/50">
                      <td className="px-5 py-3 font-medium">{t.title}</td>
                      <td className="px-5 py-3"><Badge variant="secondary" className="bg-paper-2">{t.status.replace("_"," ")}</Badge></td>
                      <td className="px-5 py-3"><PriorityChip priority={t.priority} /></td>
                      <td className="px-5 py-3 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full grid place-items-center text-paper text-[10px] font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                        {m.name}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Brand-System.pdf", kind: "doc", size: "2.4 MB" },
              { name: "Hero-explorations.fig", kind: "doc", size: "18 MB" },
              { name: "research-notes.md", kind: "doc", size: "12 KB" },
              { name: "screenshot-01.png", kind: "img", size: "640 KB" },
              { name: "screenshot-02.png", kind: "img", size: "712 KB" },
              { name: "moodboard.jpg", kind: "img", size: "1.1 MB" },
            ].map(f => (
              <Card key={f.name} className="p-4 bg-card border-border">
                <div className="h-24 rounded-md bg-paper-2 grid place-items-center mb-3">
                  {f.kind === "img" ? <ImageIcon className="h-8 w-8 text-muted-foreground" /> : <FileText className="h-8 w-8 text-muted-foreground" />}
                </div>
                <div className="text-sm font-medium truncate">{f.name}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{f.size}</span>
                  <Download className="h-3.5 w-3.5" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <div className="font-display text-xl mb-4">Project analytics</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnup}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="done" stroke="var(--terracotta)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function PriorityChip({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    low: "bg-sage/20 text-sage",
    medium: "bg-mustard/20 text-mustard",
    high: "bg-terracotta/20 text-terracotta",
    urgent: "bg-destructive/20 text-destructive",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[priority] ?? ""}`}>{priority}</span>;
}
