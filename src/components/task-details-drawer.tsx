import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getMember, activity, Task } from "@/lib/mock-data";
import { useStore, useProject } from "@/lib/store";
import { CalendarDays, Paperclip, History, AlignLeft, CheckSquare } from "lucide-react";

export function TaskDetailsDrawer({ 
  task, 
  open, 
  onOpenChange 
}: { 
  task: Task | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const project = useProject(task?.projectId || "");
  const assignee = task ? getMember(task.assigneeId) : null;

  // Mock states for this specific drawer session
  const [newComment, setNewComment] = useState("");
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: "Draft initial copy", done: true },
    { id: 2, text: "Review with stakeholders", done: false },
    { id: 3, text: "Finalize and publish", done: false },
  ]);

  if (!task) return null;

  const taskActivity = activity.filter(a => a.target === task.title || a.actorId === task.assigneeId).slice(0, 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg xl:max-w-xl overflow-y-auto p-0 flex flex-col">
        <div className="p-6 pb-4 border-b border-border bg-background sticky top-0 z-10">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: project?.color || "var(--ink)" }} />
              <span className="text-xs text-muted-foreground">{project?.name}</span>
              <span className="text-muted-foreground">·</span>
              <Badge variant="secondary" className="bg-card capitalize">{task.status.replace("_", " ")}</Badge>
              <Badge variant="outline" className="capitalize">{task.priority}</Badge>
            </div>
            <SheetTitle className="font-display text-2xl">{task.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Assignee</div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full grid place-items-center text-paper text-[10px] font-medium shrink-0" style={{ background: assignee?.avatarColor }}>{assignee?.initials}</div>
                <span className="font-medium">{assignee?.name}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Due Date</div>
              <div className="flex items-center gap-1.5 font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3"><AlignLeft className="h-4 w-4" /> Description</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
              <br/><br/>
              This is an expanded mock description. We need to ensure that all edge cases are handled before shipping this task. Make sure to consult the attached design documents.
            </div>
          </section>

          {/* Subtasks */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3"><CheckSquare className="h-4 w-4" /> Subtasks</h3>
            <div className="space-y-2">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-start gap-2">
                  <Checkbox 
                    checked={st.done} 
                    onCheckedChange={(c) => setSubtasks(prev => prev.map(p => p.id === st.id ? { ...p, done: !!c } : p))} 
                    className="mt-0.5" 
                  />
                  <span className={`text-sm ${st.done ? 'line-through text-muted-foreground' : ''}`}>{st.text}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground h-8 px-2 -ml-2">Add subtask</Button>
          </section>

          {/* Attachments */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3"><Paperclip className="h-4 w-4" /> Attachments</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border rounded-lg p-3 bg-paper-2/50 flex items-center gap-3">
                <div className="h-10 w-10 bg-card rounded flex items-center justify-center shrink-0 border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground">FIG</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">Design_Specs.fig</div>
                  <div className="text-xs text-muted-foreground">1.2 MB</div>
                </div>
              </div>
              <div className="border border-border rounded-lg p-3 bg-paper-2/50 flex items-center gap-3">
                <div className="h-10 w-10 bg-card rounded flex items-center justify-center shrink-0 border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground">PDF</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">Requirements.pdf</div>
                  <div className="text-xs text-muted-foreground">450 KB</div>
                </div>
              </div>
            </div>
          </section>

          {/* Activity & Comments */}
          <section>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-4"><History className="h-4 w-4" /> Activity</h3>
            <div className="space-y-4">
              {taskActivity.map(a => {
                const m = getMember(a.actorId);
                return (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <div className="h-7 w-7 rounded-full grid place-items-center text-paper text-[10px] font-medium shrink-0 mt-0.5" style={{ background: m.avatarColor }}>{m.initials}</div>
                    <div>
                      <div><span className="font-medium">{m.name}</span> <span className="text-muted-foreground">{a.action}</span> <span className="font-medium text-foreground">{a.target}</span></div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.timestamp}</div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add Comment */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                <div className="h-7 w-7 rounded-full bg-ink text-paper grid place-items-center text-[10px] font-medium shrink-0">AH</div>
                <div className="flex-1 space-y-2">
                  <Textarea 
                    placeholder="Ask a question or post an update..." 
                    className="min-h-[80px] bg-card text-sm"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => setNewComment("")}>Comment</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
