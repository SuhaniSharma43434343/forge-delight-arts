import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Atelier" },
      { name: "description", content: "Sign in to your Atelier workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden bg-ink text-paper p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-paper text-ink grid place-items-center font-display text-xl">A</div>
          <div className="font-display text-xl">Atelier</div>
        </Link>
        <div>
          <h1 className="font-display text-5xl leading-[1.05] max-w-md">
            A calm place for the studio to ship.
          </h1>
          <p className="mt-4 text-paper/70 max-w-md">
            Projects, tasks, and team — all in one editorial, focused workspace.
          </p>
        </div>
        <div className="text-paper/60 text-xs">© Atelier Studio OS</div>
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-terracotta/40 blur-3xl pointer-events-none" />
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg bg-ink text-paper grid place-items-center font-display text-xl">A</div>
            <div className="font-display text-xl">Atelier</div>
          </div>
          <h2 className="font-display text-3xl">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your workspace.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => navigate({ to: "/" }), 400);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="amelia@studio.co" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            New here? <Link to="/" className="text-terracotta">Take a tour</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
