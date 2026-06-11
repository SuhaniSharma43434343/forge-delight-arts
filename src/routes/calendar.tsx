import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tasks, getMember, getProject } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Atelier" },
      { name: "description", content: "Calendar view of upcoming task deadlines." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const arr: { date: Date | null }[] = [];
    for (let i = 0; i < startDay; i++) arr.push({ date: null });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
    while (arr.length % 7 !== 0) arr.push({ date: null });
    return arr;
  }, [cursor]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach(t => {
      const k = new Date(t.dueDate).toDateString();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    });
    return map;
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        description="See deadlines mapped to the month. Click a date to drill in."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="font-display text-xl w-44 text-center">{monthLabel}</div>
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        }
      />

      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-7 gap-px mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-xs uppercase tracking-wider text-muted-foreground text-center py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {cells.map((c, i) => {
            const t = c.date ? tasksByDay.get(c.date.toDateString()) ?? [] : [];
            const isToday = c.date && c.date.toDateString() === new Date().toDateString();
            return (
              <div key={i} className="bg-card min-h-[110px] p-2 relative">
                {c.date && (
                  <div className={`text-xs ${isToday ? "text-terracotta font-bold" : "text-muted-foreground"}`}>{c.date.getDate()}</div>
                )}
                <div className="mt-1 space-y-1">
                  {t.slice(0, 3).map(task => {
                    const p = getProject(task.projectId);
                    const m = getMember(task.assigneeId);
                    return (
                      <div key={task.id} className="text-[11px] bg-paper-2 px-1.5 py-1 rounded flex items-center gap-1.5 truncate" title={`${task.title} · ${m.name}`}>
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                  {t.length > 3 && <div className="text-[10px] text-muted-foreground">+{t.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}
