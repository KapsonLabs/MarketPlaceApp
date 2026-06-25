import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/admin/_shell/users")({
  head: () => ({ meta: [{ title: "Users — Casmara Admin" }] }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
      <p className="mt-1 text-muted-foreground">
        Review tenant and public marketplace accounts.
      </p>
      <Card className="mt-8 border-border">
        <CardContent className="p-10 text-center text-muted-foreground">
          User management is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
