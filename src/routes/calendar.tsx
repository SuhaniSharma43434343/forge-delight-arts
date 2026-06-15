import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMember } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Video, Plane, Flag, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { 
  startOfWeek, addDays, subDays, format, isSameDay, parseISO, 
  addMonths, subMonths, startOfMonth, endOfMonth 
} from "date-fns";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Atelier" },
      { name: "description", content: "Calendar view of upcoming task deadlines, meetings, and sprints." },
    ],
  }),
  component: CalendarPage,
});

type ViewMode = "month" | "week" | "day";

function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date(2026, 5, 12)); // Start at a specific mock date for best preview

  const { tasks, projects, sprints, meetings, leaves } = useStore();

  const handlePrev = () => {
    if (view === "month") setCursor(subMonths(cursor, 1));
    else if (view === "week") setCursor(subDays(cursor, 7));
    else setCursor(subDays(cursor, 1));
  };

  const handleNext = () => {
    if (view === "month") setCursor(addMonths(cursor, 1));
    else if (view === "week") setCursor(addDays(cursor, 7));
    else setCursor(addDays(cursor, 1));
  };

  const label = useMemo(() => {
    if (view === "month") return format(cursor, "MMMM yyyy");
    if (view === "week") {
      const start = startOfWeek(cursor, { weekStartsOn: 0 });
      const end = addDays(start, 6);
      if (start.getMonth() !== end.getMonth()) {
        return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      }
      return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
    }
    return format(cursor, "MMMM d, yyyy");
  }, [cursor, view]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        description="See deadlines, sprints, meetings, and team availability."
        actions={
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={(v: string) => setView(v as ViewMode)}>
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
              <div className="font-display text-lg w-48 text-center">{label}</div>
              <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        }
      />
      <div className="mt-6">
        {view === "month" && <MonthView cursor={cursor} tasks={tasks} projects={projects} sprints={sprints} meetings={meetings} leaves={leaves} />}
        {view === "week" && <WeekView cursor={cursor} tasks={tasks} projects={projects} sprints={sprints} meetings={meetings} leaves={leaves} />}
        {view === "day" && <DayView cursor={cursor} tasks={tasks} projects={projects} sprints={sprints} meetings={meetings} leaves={leaves} />}
      </div>
    </AppShell>
  );
}

// Helper props type
type ViewProps = {
  cursor: Date;
  tasks: any[];
  projects: any[];
  sprints: any[];
  meetings: any[];
  leaves: any[];
};

function isDateInRange(d: Date, startStr: string, endStr: string) {
  const target = format(d, "yyyy-MM-dd");
  return startStr <= target && target <= endStr;
}

function MonthView({ cursor, tasks, projects, sprints, meetings, leaves }: ViewProps) {
  const cells = useMemo(() => {
    const first = startOfMonth(cursor);
    const startDay = first.getDay();
    const daysInMonth = endOfMonth(cursor).getDate();
    const arr: { date: Date | null }[] = [];
    for (let i = 0; i < startDay; i++) arr.push({ date: null });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
    while (arr.length % 7 !== 0) arr.push({ date: null });
    return arr;
  }, [cursor]);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="grid grid-cols-7 gap-px mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="text-xs uppercase tracking-wider text-muted-foreground text-center py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {cells.map((c, i) => {
          if (!c.date) return <div key={i} className="bg-card/50 min-h-[140px] p-2" />;
          
          const d = c.date;
          const isToday = isSameDay(d, new Date());
          const targetStr = format(d, "yyyy-MM-dd");
          
          const dayTasks = tasks.filter(t => t.dueDate.startsWith(targetStr));
          const dayMeetings = meetings.filter(m => m.date === targetStr);
          const daySprints = sprints.filter(s => isDateInRange(d, s.startDate, s.endDate));
          const dayLeaves = leaves.filter(l => isDateInRange(d, l.startDate, l.endDate));

          return (
            <div key={i} className="bg-card min-h-[140px] p-2 relative flex flex-col gap-1">
              <div className={`text-xs mb-1 ${isToday ? "text-terracotta font-bold" : "text-muted-foreground"}`}>{d.getDate()}</div>
              
              {daySprints.map(s => (
                <div key={s.id} className="text-[10px] bg-plum/20 text-plum px-1.5 py-0.5 rounded flex items-center gap-1 truncate font-medium">
                  <Flag className="h-2.5 w-2.5 shrink-0" /> {s.name}
                </div>
              ))}
              
              {dayLeaves.map(l => {
                const m = getMember(l.memberId);
                return (
                  <div key={l.id} className="text-[10px] bg-mustard/20 text-mustard px-1.5 py-0.5 rounded flex items-center gap-1 truncate">
                    <Plane className="h-2.5 w-2.5 shrink-0" /> {m.name.split(" ")[0]} ({l.type})
                  </div>
                );
              })}

              {dayMeetings.map(m => (
                <div key={m.id} className="text-[10px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded flex items-center gap-1 truncate">
                  <Video className="h-2.5 w-2.5 shrink-0" /> {m.startTime} {m.title}
                </div>
              ))}

              {dayTasks.map(t => {
                const p = projects.find(x => x.id === t.projectId);
                return (
                  <div key={t.id} className="text-[10px] bg-paper-2 px-1.5 py-0.5 rounded flex items-center gap-1.5 truncate border border-border/50">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: p?.color || "var(--ink)" }} />
                    <span className={`truncate ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeekView({ cursor, tasks, projects, sprints, meetings, leaves }: ViewProps) {
  const days = useMemo(() => {
    const start = startOfWeek(cursor, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [cursor]);
  
  const hours = Array.from({ length: 11 }).map((_, i) => i + 8);

  return (
    <Card className="flex flex-col bg-card border-border overflow-hidden h-[700px]">
      <div className="flex border-b border-border bg-paper-2 sticky top-0 z-10">
        <div className="w-16 shrink-0 border-r border-border" />
        {days.map(d => {
          const isToday = isSameDay(d, new Date());
          return (
            <div key={d.toISOString()} className="flex-1 text-center py-3 border-r border-border last:border-r-0">
              <div className="text-xs text-muted-foreground uppercase">{format(d, "EEE")}</div>
              <div className={`text-lg mt-0.5 ${isToday ? "text-terracotta font-bold" : "font-medium"}`}>{format(d, "d")}</div>
            </div>
          );
        })}
      </div>
      
      <div className="flex border-b border-border sticky top-[73px] z-10 bg-card">
        <div className="w-16 shrink-0 border-r border-border flex items-center justify-center text-[10px] text-muted-foreground py-2">
          All Day
        </div>
        {days.map(d => {
          const targetStr = format(d, "yyyy-MM-dd");
          const daySprints = sprints.filter(s => isDateInRange(d, s.startDate, s.endDate));
          const dayLeaves = leaves.filter(l => isDateInRange(d, l.startDate, l.endDate));
          const dayTasks = tasks.filter(t => t.dueDate.startsWith(targetStr));
          
          return (
            <div key={d.toISOString()} className="flex-1 border-r border-border last:border-r-0 p-1 space-y-1">
              {daySprints.map(s => (
                <div key={s.id} className="text-[10px] bg-plum/20 text-plum px-1.5 py-1 rounded truncate font-medium flex items-center gap-1">
                  <Flag className="h-3 w-3 shrink-0"/> {s.name}
                </div>
              ))}
              {dayLeaves.map(l => {
                const m = getMember(l.memberId);
                return (
                  <div key={l.id} className="text-[10px] bg-mustard/20 text-mustard px-1.5 py-1 rounded truncate flex items-center gap-1">
                    <Plane className="h-3 w-3 shrink-0"/> {m.name.split(" ")[0]}
                  </div>
                );
              })}
              {dayTasks.map(t => {
                return (
                  <div key={t.id} className={`text-[10px] bg-paper-2 border border-border px-1.5 py-1 rounded truncate flex items-center gap-1 ${t.status === "done" ? "opacity-50 line-through" : ""}`}>
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-muted-foreground"/> {t.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto relative bg-card">
        {hours.map(h => (
          <div key={h} className="flex border-b border-border h-16 group">
            <div className="w-16 shrink-0 border-r border-border text-[10px] text-muted-foreground text-right pr-2 pt-1">
              {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
            </div>
            {days.map(d => (
              <div key={d.toISOString()} className="flex-1 border-r border-border last:border-r-0 group-hover:bg-paper-2/30 transition-colors" />
            ))}
          </div>
        ))}
        
        {days.map((d, dayIndex) => {
          const targetStr = format(d, "yyyy-MM-dd");
          const dayMeetings = meetings.filter(m => m.date === targetStr);
          return dayMeetings.map(m => {
            const [h, min] = m.startTime.split(":").map(Number);
            const [eh, emin] = m.endTime.split(":").map(Number);
            const top = ((h - 8) * 64) + ((min / 60) * 64);
            const height = ((eh - h) * 64) + (((emin - min) / 60) * 64);
            if (h < 8 || h >= 19) return null;
            
            return (
              <div 
                key={m.id} 
                className="absolute bg-blue-500 text-white rounded-md p-1.5 overflow-hidden text-[11px] shadow-sm flex flex-col"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc(4rem + ${dayIndex} * ((100% - 4rem) / 7) + 4px)`,
                  width: `calc(((100% - 4rem) / 7) - 8px)`
                }}
              >
                <div className="font-medium flex items-center gap-1 truncate"><Video className="h-3 w-3 shrink-0" />{m.title}</div>
                <div className="text-blue-100 mt-0.5 truncate">{m.startTime} - {m.endTime}</div>
              </div>
            );
          });
        })}
      </div>
    </Card>
  );
}

function DayView({ cursor, tasks, projects, sprints, meetings, leaves }: ViewProps) {
  const d = cursor;
  const hours = Array.from({ length: 11 }).map((_, i) => i + 8);
  
  const targetStr = format(d, "yyyy-MM-dd");
  const daySprints = sprints.filter(s => isDateInRange(d, s.startDate, s.endDate));
  const dayLeaves = leaves.filter(l => isDateInRange(d, l.startDate, l.endDate));
  const dayTasks = tasks.filter(t => t.dueDate.startsWith(targetStr));
  const dayMeetings = meetings.filter(m => m.date === targetStr);

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-1 p-5 bg-card border-border flex flex-col gap-6 h-[700px] overflow-y-auto">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">All Day</div>
          <div className="space-y-2">
            {daySprints.map(s => (
              <div key={s.id} className="text-sm bg-plum/10 border border-plum/20 text-plum px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" /> {s.name}
              </div>
            ))}
            {dayLeaves.map(l => {
              const m = getMember(l.memberId);
              return (
                <div key={l.id} className="text-sm bg-mustard/10 border border-mustard/20 text-mustard px-3 py-2 rounded-lg flex items-center gap-2">
                  <Plane className="h-4 w-4" /> {m.name} ({l.type})
                </div>
              );
            })}
            {daySprints.length === 0 && dayLeaves.length === 0 && (
              <div className="text-sm text-muted-foreground">Nothing all day</div>
            )}
          </div>
        </div>
        
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Tasks Due</div>
          <div className="space-y-2">
            {dayTasks.map(t => {
              const p = projects.find(x => x.id === t.projectId);
              return (
                <div key={t.id} className="text-sm bg-paper-2 border border-border px-3 py-2 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p?.color || "var(--ink)" }} />
                    <span className={`font-medium ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">{p?.name}</div>
                </div>
              );
            })}
            {dayTasks.length === 0 && (
              <div className="text-sm text-muted-foreground">No tasks due</div>
            )}
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-3 bg-card border-border overflow-y-auto h-[700px] relative">
        {hours.map(h => (
          <div key={h} className="flex border-b border-border h-24 group">
            <div className="w-20 shrink-0 border-r border-border text-xs text-muted-foreground text-right pr-3 pt-2">
              {h === 12 ? "12:00 PM" : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
            </div>
            <div className="flex-1 group-hover:bg-paper-2/30 transition-colors" />
          </div>
        ))}

        {dayMeetings.map(m => {
          const [h, min] = m.startTime.split(":").map(Number);
          const [eh, emin] = m.endTime.split(":").map(Number);
          const top = ((h - 8) * 96) + ((min / 60) * 96);
          const height = ((eh - h) * 96) + (((emin - min) / 60) * 96);
          if (h < 8 || h >= 19) return null;
          
          return (
            <div 
              key={m.id} 
              className="absolute bg-blue-500 text-white rounded-lg p-3 overflow-hidden shadow-sm flex flex-col gap-1 border border-blue-600"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: `calc(5rem + 12px)`,
                right: `12px`
              }}
            >
              <div className="font-semibold text-sm flex items-center gap-2">
                <Video className="h-4 w-4 shrink-0" />
                {m.title}
              </div>
              <div className="text-blue-100 text-xs">{m.startTime} - {m.endTime}</div>
              <div className="mt-auto flex items-center gap-1.5 opacity-90">
                {m.attendees.map(id => {
                  const att = getMember(id);
                  return <div key={id} className="h-5 w-5 rounded-full grid place-items-center text-[8px] bg-white/20 font-medium" title={att.name}>{att.initials}</div>
                })}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
