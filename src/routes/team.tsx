import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { team, tasks } from "@/lib/mock-data";
import { UserPlus, Mail } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Atelier" },
      { name: "description", content: "Studio members, roles, and workload." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="People"
        title="The Studio"
        description="Six people, currently shipping six projects."
        actions={<Button className="gap-2"><UserPlus className="h-4 w-4" /> Invite member</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(m => {
          const myTasks = tasks.filter(t => t.assigneeId === m.id);
          const done = myTasks.filter(t => t.status === "done").length;
          return (
            <Card key={m.id} className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full grid place-items-center text-paper text-lg font-medium" style={{ background: m.avatarColor }}>
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl truncate">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.role}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-display text-2xl">{myTasks.length}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Assigned</div>
                </div>
                <div>
                  <div className="font-display text-2xl">{done}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Done</div>
                </div>
                <div>
                  <div className="font-display text-2xl">{myTasks.length - done}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Active</div>
                </div>
              </div>

              <Button variant="outline" className="mt-5 w-full gap-2"><Mail className="h-4 w-4" /> {m.email}</Button>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
