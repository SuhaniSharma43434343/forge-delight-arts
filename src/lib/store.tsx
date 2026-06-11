import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  projects as seedProjects,
  tasks as seedTasks,
  type Project,
  type Task,
  type TaskStatus,
} from "./mock-data";

interface StoreState {
  projects: Project[];
  tasks: Task[];
  addProject: (p: Omit<Project, "id" | "progress" | "taskCount" | "memberIds"> & { memberIds?: string[] }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

const Ctx = createContext<StoreState | null>(null);
const KEY = "atelier-store-v1";

function load(): { projects: Project[]; tasks: Task[] } | null {
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) {
      setProjects(saved.projects);
      setTasks(saved.tasks);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ projects, tasks }));
  }, [projects, tasks, hydrated]);

  const value = useMemo<StoreState>(() => ({
    projects,
    tasks,
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
  }), [projects, tasks]);

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
