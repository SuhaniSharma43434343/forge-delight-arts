import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MemberProfileDrawer } from "@/components/member-profile-drawer";
import { useStore } from "@/lib/store";
import { TeamMember } from "@/lib/mock-data";
import { UserPlus, Mail, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Atelier" },
      { name: "description", content: "Studio members, roles, and workload." },
    ],
  }),
  component: TeamPage,
});

function InviteMemberDialog() {
  const { addMember } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    
    // Generate random color from our palette
    const colors = ["var(--terracotta)", "var(--mustard)", "var(--sage)", "var(--plum)", "var(--ink)", "#3b82f6"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    addMember({ name, email, role, avatarColor, initials });
    toast.success(`${name} has been invited to the workspace.`);
    setOpen(false);
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><UserPlus className="h-4 w-4" /> Invite member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a new member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jane Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@studio.co" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Developer" required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TeamPage() {
  const { team, tasks, removeMember, updateMemberRole } = useStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleRemove = (m: TeamMember) => {
    removeMember(m.id);
    toast.success(`${m.name} removed from the workspace.`);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="People"
        title="The Studio"
        description={`${team.length} people, currently shipping active projects.`}
        actions={<InviteMemberDialog />}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(m => {
          const myTasks = tasks.filter(t => t.assigneeId === m.id);
          const done = myTasks.filter(t => t.status === "done").length;
          return (
            <Card 
              key={m.id} 
              className="p-6 bg-card border-border cursor-pointer hover:border-primary/30 transition-colors group relative"
              onClick={() => setSelectedMember(m)}
            >
              <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateMemberRole(m.id, "Admin")}><Shield className="mr-2 h-4 w-4" /> Make Admin</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateMemberRole(m.id, "Member")}><Shield className="mr-2 h-4 w-4 opacity-50" /> Make Member</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleRemove(m)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove from workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full grid place-items-center text-paper text-lg font-medium shrink-0" style={{ background: m.avatarColor }}>
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl truncate pr-6">{m.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{m.role}</div>
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

              <Button 
                variant="outline" 
                className="mt-5 w-full gap-2 text-muted-foreground" 
                onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${m.email}`; }}
              >
                <Mail className="h-4 w-4" /> {m.email}
              </Button>
            </Card>
          );
        })}
      </div>

      <MemberProfileDrawer 
        member={selectedMember} 
        open={!!selectedMember} 
        onOpenChange={(open) => { if (!open) setSelectedMember(null); }} 
      />
    </AppShell>
  );
}
