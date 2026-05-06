import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/request/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Request submitted — Casmara Systems" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="max-w-lg border-border shadow-[var(--shadow-elegant)]">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-foreground">
              Request submitted
            </h1>
            <p className="mt-2 text-muted-foreground">
              We've routed your request to the maintenance queue. A pro will reach
              out shortly.
            </p>
            {id && (
              <p className="mt-4 inline-block rounded-md bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">
                Reference: {id}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/providers">Browse providers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}