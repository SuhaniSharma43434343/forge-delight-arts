import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, FolderKanban, KanbanSquare, ListChecks,
  CalendarDays, BarChart3, Users, Settings, Bell, Search, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/board", label: "Board", icon: KanbanSquare },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/team", label: "Team", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-paper-2/40 px-4 py-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-ink text-paper grid place-items-center font-display text-xl">A</div>
          <div className="leading-tight">
            <div className="font-display text-lg">Atelier</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Studio OS</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "text-foreground/70 hover:bg-paper-2 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-border bg-card p-4">
          <div className="font-display text-base leading-tight">Ship it Friday</div>
          <p className="mt-1 text-xs text-muted-foreground">3 milestones due this week across 2 projects.</p>
          <Button size="sm" className="mt-3 w-full" variant="default">Review</Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-6 py-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects, tasks, people…" className="pl-9 bg-card border-border" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New task
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-terracotta text-paper grid place-items-center text-sm font-medium">AH</div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
