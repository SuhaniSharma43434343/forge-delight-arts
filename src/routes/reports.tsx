import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects, weeklyCompleted, workload } from "@/lib/mock-data";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Atelier" },
      { name: "description", content: "Project, team, and velocity reporting." },
    ],
  }),
  component: Reports,
});

const statusBreakdown = [
  { name: "Done", value: 38, color: "var(--sage)" },
  { name: "In Progress", value: 24, color: "var(--terracotta)" },
  { name: "Todo", value: 18, color: "var(--mustard)" },
  { name: "Backlog", value: 12, color: "var(--ink)" },
];

function Reports() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Velocity, workload, and project health at a glance."
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 lg:col-span-2 bg-card border-border">
          <div className="font-display text-xl mb-4">Weekly velocity</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompleted}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="var(--terracotta)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="font-display text-xl mb-4">Status breakdown</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {statusBreakdown.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="font-display text-xl mb-4">Workload by member</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="tasks" fill="var(--ink)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="font-display text-xl mb-4">Project health</div>
          <ul className="space-y-3">
            {projects.map(p => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                <span className="font-medium flex-1">{p.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{p.status.replace("_"," ")}</span>
                <span className="font-display text-lg w-12 text-right">{p.progress}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
