import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Atelier" },
      { name: "description", content: "Workspace, profile, and notification settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Preferences" title="Settings" description="Tune your workspace, profile, and notifications." />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border lg:col-span-2">
          <div className="font-display text-xl mb-4">Profile</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Amelia Hart" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="amelia@studio.co" /></div>
            <div className="space-y-2"><Label>Role</Label><Input defaultValue="Product Designer" /></div>
            <div className="space-y-2"><Label>Timezone</Label><Input defaultValue="Europe / Berlin" /></div>
          </div>
          <Separator className="my-6" />
          <div className="font-display text-xl mb-4">Notifications</div>
          <div className="space-y-4">
            {[
              { label: "Email me when I'm @mentioned", on: true },
              { label: "Weekly digest of activity", on: true },
              { label: "Daily standup reminder", on: false },
              { label: "Push notifications", on: false },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm">{n.label}</span>
                <Switch defaultChecked={n.on} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border h-fit">
          <div className="font-display text-xl mb-2">Workspace</div>
          <p className="text-sm text-muted-foreground mb-4">Atelier · Studio plan</p>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span className="text-muted-foreground">Members</span><span>6 of 10</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Projects</span><span>6</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Storage</span><span>2.4 / 50 GB</span></li>
          </ul>
          <Button variant="outline" className="w-full mt-5">Manage billing</Button>
        </Card>
      </div>
    </AppShell>
  );
}
