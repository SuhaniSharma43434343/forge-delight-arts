import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Building2, UserCircle, KanbanSquare } from "lucide-react";

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
      <PageHeader eyebrow="Preferences" title="Settings" description="Tune your workspace, profile, and projects." />

      <Tabs defaultValue="org" className="mt-6 flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto w-full md:w-64 bg-transparent p-0 gap-2 items-stretch justify-start overflow-x-auto">
          <TabsTrigger value="org" className="justify-start gap-2 data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-none"><Building2 className="h-4 w-4" /> Organization</TabsTrigger>
          <TabsTrigger value="user" className="justify-start gap-2 data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-none"><UserCircle className="h-4 w-4" /> User Profile</TabsTrigger>
          <TabsTrigger value="projects" className="justify-start gap-2 data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-none"><KanbanSquare className="h-4 w-4" /> Projects</TabsTrigger>
        </TabsList>

        <div className="flex-1 max-w-3xl">
          <TabsContent value="org" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-6">Organization Details</div>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                <div className="space-y-3">
                  <Label>Workspace Logo</Label>
                  <div className="h-24 w-24 bg-paper-2 border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-paper-2/80 transition-colors cursor-pointer group">
                    <Camera className="h-6 w-6 mb-1 group-hover:text-foreground transition-colors" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Delight Arts Studio" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-2 text-destructive">Danger Zone</div>
              <p className="text-sm text-muted-foreground mb-4">Deleting this organization will permanently remove all projects, tasks, and data.</p>
              <Button variant="destructive">Delete Organization</Button>
            </Card>
          </TabsContent>

          <TabsContent value="user" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-4">Personal Details</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Amelia Hart" /></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="amelia@studio.co" /></div>
                <div className="space-y-2"><Label>Role</Label><Input defaultValue="Product Designer" disabled className="bg-paper-2/50" /></div>
                <div className="space-y-2"><Label>Language</Label><Input defaultValue="English (US)" /></div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button>Update Profile</Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-4">Security</div>
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
                <Button variant="outline" className="mt-2">Change Password</Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-4">Notifications</div>
              <div className="space-y-4">
                {[
                  { label: "Email me when I'm @mentioned", on: true },
                  { label: "Weekly digest of activity", on: true },
                  { label: "Daily standup reminder", on: false },
                  { label: "Push notifications on mobile", on: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between">
                    <span className="text-sm">{n.label}</span>
                    <Switch defaultChecked={n.on} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-6 animate-in fade-in-50">
            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-2">Default Task Statuses</div>
              <p className="text-sm text-muted-foreground mb-6">These are the default stages tasks move through in new projects. They cannot currently be edited on the Studio plan.</p>
              
              <div className="flex gap-2 p-4 bg-paper-2/50 rounded-lg border border-border">
                <Badge variant="secondary" className="bg-card">To Do</Badge>
                <div className="text-muted-foreground px-2">→</div>
                <Badge variant="secondary" className="bg-card">In Progress</Badge>
                <div className="text-muted-foreground px-2">→</div>
                <Badge variant="secondary" className="bg-card">In Review</Badge>
                <div className="text-muted-foreground px-2">→</div>
                <Badge variant="secondary" className="bg-card">Done</Badge>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="font-display text-xl mb-4">Preferences</div>
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label>Default Sprint Duration</Label>
                  <Select defaultValue="2">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Week</SelectItem>
                      <SelectItem value="2">2 Weeks</SelectItem>
                      <SelectItem value="4">4 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm">Require review before marking tasks "Done"</span>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Automatically archive completed projects</span>
                  <Switch defaultChecked={false} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button>Save Preferences</Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}
