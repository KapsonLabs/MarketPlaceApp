import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/marketplace/for-providers")({
  head: () => ({
    meta: [
      { title: "Become a Casmara Systems provider" },
      {
        name: "description",
        content:
          "Join Casmara Systems to receive vetted maintenance jobs from tenants and homeowners.",
      },
    ],
  }),
  component: ForProviders,
});

const perks = [
  "Steady stream of qualified jobs from managed properties.",
  "Get paid through the platform — no chasing invoices.",
  "Build a verified reputation with ratings & reviews.",
  "Set your own service area, hours, and rates.",
];

function ForProviders() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Grow your business with Casmara Systems
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            We connect verified pros with property managers and homeowners who
            need reliable work — fast.
          </p>

          <Card className="mt-10 border-border">
            <CardContent className="space-y-3 p-6">
              {perks.map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <p className="text-foreground">{p}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" disabled>
              Apply to join (coming soon)
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/marketplace/providers">See current providers</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}