import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/admin/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — Casmara Admin" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Configure marketplace and console preferences.
      </p>
      <Card className="mt-8 border-border">
        <CardContent className="p-10 text-center text-muted-foreground">
          Settings are coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
