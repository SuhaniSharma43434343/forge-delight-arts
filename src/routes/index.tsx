import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { AvatarStack } from "@/components/avatar-stack";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { activity, getMember, projects, tasks, weeklyCompleted, workload } from "@/lib/mock-data";
import { Plus, FolderPlus, UserPlus, ArrowUpRight, CalendarClock } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Atelier" },
      { name: "description", content: "Today's work, statistics, and recent activity across all projects." },
    ],
  }),
  component: Dashboard,
});

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
});

const stats = [
  { label: "Total Projects", value: projects.length, hint: "across the studio" },
  { label: "Active Tasks", value: tasks.filter(t => t.status !== "done").length, hint: "in flight" },
  { label: "Completed", value: tasks.filter(t => t.status === "done").length, hint: "this cycle" },
  { label: "Overdue", value: 3, hint: "needs attention", warn: true },
  { label: "Team", value: 6, hint: "members" },
];

function Dashboard() {
  const upcoming = [...tasks]
    .filter(t => t.status !== "done")
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        eyebrow={today}
        title="Good morning, Amelia."
        description="Here is what's moving across your projects today. Three milestones are within arm's reach."
        actions={
          <>
            <Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" /> Invite</Button>
            <Button variant="outline" className="gap-2"><FolderPlus className="h-4 w-4" /> New project</Button>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New task</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 bg-card border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`font-display text-4xl mt-2 ${s.warn ? "text-terracotta" : ""}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.hint}</div>
          </Card>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 lg:col-span-2 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Tasks completed</div>
              <div className="font-display text-2xl">This week</div>
            </div>
            <Badge variant="secondary" className="bg-paper-2">+18% vs last week</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyCompleted}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--terracotta)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--terracotta)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="count" stroke="var(--terracotta)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Team workload</div>
          <div className="font-display text-2xl mb-4">By assignee</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="tasks" fill="var(--ink)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid lg:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 lg:col-span-2 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-2xl">Project progress</div>
            <Link to="/projects" className="text-sm text-terracotta inline-flex items-center gap-1">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-5">
            {projects.slice(0, 4).map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                    <Link to="/projects/$id" params={{ id: p.id }} className="font-medium hover:underline">{p.name}</Link>
                  </div>
                  <div className="text-xs text-muted-foreground">{p.progress}%</div>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="font-display text-2xl mb-4">Upcoming deadlines</div>
          <ul className="space-y-3">
            {upcoming.map(t => (
              <li key={t.id} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-paper-2 grid place-items-center shrink-0">
                  <CalendarClock className="h-4 w-4 text-terracotta" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {getMember(t.assigneeId).name.split(" ")[0]}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <Card className="p-6 bg-card border-border">
          <div className="font-display text-2xl mb-4">Recent activity</div>
          <ul className="divide-y divide-border">
            {activity.map(a => {
              const m = getMember(a.actorId);
              return (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <div className="h-8 w-8 rounded-full grid place-items-center text-[11px] text-paper font-medium" style={{ background: m.avatarColor }}>{m.initials}</div>
                  <div className="text-sm flex-1">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground"> {a.action} </span>
                    <span className="font-medium">{a.target}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.timestamp}</div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <AvatarStack ids={["u1","u2","u3","u4","u5","u6"]} />
            <div className="text-xs text-muted-foreground">6 people active today</div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
