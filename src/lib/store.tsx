import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  projects as seedProjects,
  tasks as seedTasks,
  sprints as seedSprints,
  meetings as seedMeetings,
  leaves as seedLeaves,
  team as seedTeam,
  type Project,
  type Task,
  type TaskStatus,
  type Sprint,
  type Meeting,
  type Leave,
  type TeamMember,
} from "./mock-data";

interface StoreState {
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  meetings: Meeting[];
  leaves: Leave[];
  team: TeamMember[];
  addProject: (p: Omit<Project, "id" | "progress" | "taskCount" | "memberIds"> & { memberIds?: string[] }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addMember: (m: Omit<TeamMember, "id">) => TeamMember;
  updateMemberRole: (id: string, role: string) => void;
  removeMember: (id: string) => void;
}

const Ctx = createContext<StoreState | null>(null);
const KEY = "atelier-store-v2";

function load(): { projects: Project[]; tasks: Task[]; sprints?: Sprint[]; meetings?: Meeting[]; leaves?: Leave[]; team?: TeamMember[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [sprints, setSprints] = useState<Sprint[]>(seedSprints);
  const [meetings, setMeetings] = useState<Meeting[]>(seedMeetings);
  const [leaves, setLeaves] = useState<Leave[]>(seedLeaves);
  const [team, setTeam] = useState<TeamMember[]>(seedTeam);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) {
      setProjects(saved.projects);
      setTasks(saved.tasks);
      if (saved.sprints) setSprints(saved.sprints);
      if (saved.meetings) setMeetings(saved.meetings);
      if (saved.leaves) setLeaves(saved.leaves);
      if (saved.team) setTeam(saved.team);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ projects, tasks, sprints, meetings, leaves, team }));
  }, [projects, tasks, sprints, meetings, leaves, team, hydrated]);

  const value = useMemo<StoreState>(() => ({
    projects,
    tasks,
    sprints,
    meetings,
    leaves,
    team,
    addProject: (p) => {
      const project: Project = {
        id: `p${Date.now()}`,
        progress: 0,
        taskCount: 0,
        memberIds: p.memberIds ?? [],
        name: p.name,
        description: p.description,
        status: p.status,
        dueDate: p.dueDate,
        color: p.color,
      };
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    updateProject: (id, patch) =>
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    archiveProject: (id) =>
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: "archived" } : p))),
    addTask: (t) => {
      const task: Task = { ...t, id: `t${Date.now()}`, createdAt: new Date().toISOString() };
      setTasks((prev) => [task, ...prev]);
      setProjects((prev) =>
        prev.map((p) => (p.id === t.projectId ? { ...p, taskCount: p.taskCount + 1 } : p))
      );
      return task;
    },
    updateTask: (id, patch) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    moveTask: (id, status) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))),
    deleteTask: (id) => {
      const task = tasks.find((t) => t.id === id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (task) {
        setProjects((prev) =>
          prev.map((p) => (p.id === task.projectId ? { ...p, taskCount: Math.max(0, p.taskCount - 1) } : p))
        );
      }
    },
    addMember: (m) => {
      const member = { ...m, id: `u${Date.now()}` };
      setTeam((prev) => [...prev, member]);
      return member;
    },
    updateMemberRole: (id, role) => {
      setTeam((prev) => prev.map(m => m.id === id ? { ...m, role } : m));
    },
    removeMember: (id) => {
      setTeam((prev) => prev.filter(m => m.id !== id));
    },
  }), [projects, tasks, sprints, meetings, leaves, team]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export function useProject(id: string) {
  const { projects } = useStore();
  return projects.find((p) => p.id === id);
}
