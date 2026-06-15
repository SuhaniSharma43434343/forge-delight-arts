import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { TeamMember, activity } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Mail, Briefcase, Clock, Activity, CheckCircle2, Circle } from "lucide-react";

export function MemberProfileDrawer({ 
  member, 
  open, 
  onOpenChange 
}: { 
  member: TeamMember | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { tasks } = useStore();

  if (!member) return null;

  const myTasks = tasks.filter(t => t.assigneeId === member.id);
  const doneTasks = myTasks.filter(t => t.status === "done");
  const completionRate = myTasks.length > 0 ? Math.round((doneTasks.length / myTasks.length) * 100) : 0;
  
  const myActivity = activity.filter(a => a.actorId === member.id).slice(0, 5);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto p-0 flex flex-col">
        <div className="p-6 pb-6 border-b border-border bg-paper-2/50 flex flex-col items-center text-center">
          <div 
            className="h-20 w-20 rounded-full flex items-center justify-center text-paper text-3xl font-medium mb-4 shadow-sm" 
            style={{ background: member.avatarColor }}
          >
            {member.initials}
          </div>
          <SheetTitle className="font-display text-2xl mb-1">{member.name}</SheetTitle>
          <div className="text-muted-foreground mb-4">{member.role}</div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5"><Mail className="h-3 w-3" /> {member.email}</Badge>
            <Badge variant="outline" className="gap-1.5"><Clock className="h-3 w-3" /> Local time: 9:41 AM</Badge>
          </div>
        </div>

        <div className="p-6 flex-1 space-y-8">
          {/* Performance Overview */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-xl text-center">
              <div className="text-3xl font-display text-foreground">{myTasks.length}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Total Tasks</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" style={{ width: `${completionRate}%` }} />
              <div className="relative">
                <div className="text-3xl font-display text-foreground">{completionRate}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Completion Rate</div>
              </div>
            </div>
          </section>

          {/* Assigned Tasks */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3"><Briefcase className="h-4 w-4 text-muted-foreground" /> Assigned Tasks</h3>
            <div className="space-y-2">
              {myTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">No tasks assigned.</div>
              ) : (
                myTasks.map(t => (
                  <div key={t.id} className="text-sm bg-card border border-border px-3 py-2.5 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5">
                      {t.status === "done" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-medium ${t.status === "done" ? 'line-through text-muted-foreground' : ''}`}>{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">{t.priority} priority · {t.status.replace("_", " ")}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4"><Activity className="h-4 w-4 text-muted-foreground" /> Recent Activity</h3>
            <div className="space-y-4">
              {myActivity.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">No recent activity.</div>
              ) : (
                myActivity.map(a => (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                    <div>
                      <div><span className="text-muted-foreground">{a.action}</span> <span className="font-medium text-foreground">{a.target}</span></div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
