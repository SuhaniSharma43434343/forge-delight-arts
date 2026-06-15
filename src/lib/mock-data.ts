export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "backlog" | "todo" | "in_progress" | "testing" | "done";
export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarColor: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  memberIds: string[];
  taskCount: number;
  dueDate: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

export interface Leave {
  id: string;
  memberId: string;
  type: "vacation" | "sick" | "parental";
  startDate: string;
  endDate: string;
}

export const team: TeamMember[] = [
  { id: "u1", name: "Amelia Hart", role: "Product Designer", email: "amelia@studio.co", avatarColor: "var(--terracotta)", initials: "AH" },
  { id: "u2", name: "Theo Marsh", role: "Engineering Lead", email: "theo@studio.co", avatarColor: "var(--sage)", initials: "TM" },
  { id: "u3", name: "Nora Vance", role: "Frontend Engineer", email: "nora@studio.co", avatarColor: "var(--mustard)", initials: "NV" },
  { id: "u4", name: "Iris Okafor", role: "Project Manager", email: "iris@studio.co", avatarColor: "var(--plum)", initials: "IO" },
  { id: "u5", name: "Felix Bauer", role: "Backend Engineer", email: "felix@studio.co", avatarColor: "var(--terracotta)", initials: "FB" },
  { id: "u6", name: "June Park", role: "QA Engineer", email: "june@studio.co", avatarColor: "var(--sage)", initials: "JP" },
];

export const projects: Project[] = [
  { id: "p1", name: "Atlas Redesign", description: "Refresh the marketing site and CMS pipeline.", status: "active", progress: 72, memberIds: ["u1","u2","u3","u4"], taskCount: 45, dueDate: "2026-07-12", color: "var(--terracotta)" },
  { id: "p2", name: "Mobile Companion", description: "Native iOS companion to the web product.", status: "active", progress: 38, memberIds: ["u2","u3","u5"], taskCount: 62, dueDate: "2026-09-30", color: "var(--sage)" },
  { id: "p3", name: "Billing v2", description: "Usage-based pricing and invoice overhaul.", status: "on_hold", progress: 21, memberIds: ["u5","u4","u6"], taskCount: 28, dueDate: "2026-10-15", color: "var(--mustard)" },
  { id: "p4", name: "Design System", description: "Token-driven component library for all surfaces.", status: "active", progress: 88, memberIds: ["u1","u3"], taskCount: 34, dueDate: "2026-06-28", color: "var(--plum)" },
  { id: "p5", name: "Onboarding Studio", description: "Interactive onboarding for self-serve users.", status: "completed", progress: 100, memberIds: ["u1","u4","u6"], taskCount: 19, dueDate: "2026-05-10", color: "var(--sage)" },
  { id: "p6", name: "Internal Tooling", description: "CLI + dashboards for the platform team.", status: "active", progress: 54, memberIds: ["u2","u5"], taskCount: 22, dueDate: "2026-08-04", color: "var(--terracotta)" },
];

const titles = [
  "Audit homepage hero variants", "Wire up Stripe webhook for invoices", "Refactor auth middleware",
  "Design empty state illustrations", "Migrate icons to lucide v2", "QA checkout edge cases",
  "Spec admin permissions matrix", "Build dashboard charts", "Token-ize spacing scale",
  "Compress hero imagery", "Write onboarding copy", "Set up E2E happy path",
  "Fix Safari focus rings", "Add keyboard shortcuts", "Optimize first paint",
  "Draft launch announcement", "Pair on tricky reducer bug", "Review PR #482",
  "Set up cron for digest emails", "Add table virtualization",
];

const statuses: TaskStatus[] = ["backlog","todo","in_progress","testing","done"];
const priorities: Priority[] = ["low","medium","high","urgent"];

export const tasks: Task[] = titles.flatMap((title, i) => {
  const proj = projects[i % projects.length];
  return [{
    id: `t${i+1}`,
    title,
    description: "Lorem ipsum descriptor for context and acceptance criteria.",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assigneeId: team[i % team.length].id,
    projectId: proj.id,
    dueDate: new Date(2026, 5 + (i % 4), 5 + (i % 22)).toISOString(),
    createdAt: new Date(2026, 4, 1 + i).toISOString(),
  } satisfies Task];
});

export const activity: ActivityItem[] = [
  { id: "a1", actorId: "u1", action: "completed", target: "Compress hero imagery", timestamp: "2h ago" },
  { id: "a2", actorId: "u2", action: "commented on", target: "Refactor auth middleware", timestamp: "3h ago" },
  { id: "a3", actorId: "u4", action: "created project", target: "Internal Tooling", timestamp: "5h ago" },
  { id: "a4", actorId: "u3", action: "moved to In Progress", target: "Build dashboard charts", timestamp: "6h ago" },
  { id: "a5", actorId: "u6", action: "filed bug on", target: "QA checkout edge cases", timestamp: "1d ago" },
  { id: "a6", actorId: "u5", action: "merged PR for", target: "Wire up Stripe webhook for invoices", timestamp: "1d ago" },
];

export const sprints: Sprint[] = [
  { id: "s1", projectId: "p1", name: "Sprint 14", startDate: "2026-06-01", endDate: "2026-06-14" },
  { id: "s2", projectId: "p2", name: "Sprint 8", startDate: "2026-06-08", endDate: "2026-06-21" },
  { id: "s3", projectId: "p4", name: "Sprint 22", startDate: "2026-06-15", endDate: "2026-06-28" },
];

export const meetings: Meeting[] = [
  { id: "m1", title: "Design Sync", date: "2026-06-12", startTime: "10:00", endTime: "11:00", attendees: ["u1", "u3", "u4"] },
  { id: "m2", title: "All Hands", date: "2026-06-12", startTime: "14:00", endTime: "15:00", attendees: ["u1", "u2", "u3", "u4", "u5", "u6"] },
  { id: "m3", title: "Sprint Planning", date: "2026-06-15", startTime: "09:30", endTime: "11:00", attendees: ["u2", "u4", "u5"] },
  { id: "m4", title: "Client Demo", date: "2026-06-18", startTime: "13:00", endTime: "14:30", attendees: ["u1", "u4"] },
];

export const leaves: Leave[] = [
  { id: "l1", memberId: "u2", type: "vacation", startDate: "2026-06-05", endDate: "2026-06-10" },
  { id: "l2", memberId: "u5", type: "sick", startDate: "2026-06-12", endDate: "2026-06-12" },
  { id: "l3", memberId: "u3", type: "vacation", startDate: "2026-06-22", endDate: "2026-06-26" },
];

export const weeklyCompleted = [
  { day: "Mon", count: 4 }, { day: "Tue", count: 7 }, { day: "Wed", count: 5 },
  { day: "Thu", count: 9 }, { day: "Fri", count: 6 }, { day: "Sat", count: 2 }, { day: "Sun", count: 3 },
];

export const workload = team.slice(0, 5).map((m, i) => ({
  name: m.name.split(" ")[0],
  tasks: [9, 12, 7, 14, 6][i],
}));

export function getMember(id: string) { return team.find(t => t.id === id)!; }
export function getProject(id: string) { return projects.find(p => p.id === id)!; }
