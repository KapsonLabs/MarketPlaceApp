import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Search, Send, Wrench } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — FixHub" },
      {
        name: "description",
        content:
          "How FixHub routes maintenance requests from the public to the right service provider and into your property's maintenance queue.",
      },
    ],
  }),
  component: HowItWorks,
});

const flow = [
  {
    icon: Search,
    title: "Submit a request",
    body: "Tenants and the public submit a request via the public marketplace.",
  },
  {
    icon: Send,
    title: "Routed to maintenance",
    body: "Tenant requests are auto-created as MaintenanceRequest records inside Unit & Tenant Views — same property/unit/category schema.",
  },
  {
    icon: ClipboardList,
    title: "Property manager triages",
    body: "The request appears in /maintenance with priority, category and contact details — ready to assign.",
  },
  {
    icon: Wrench,
    title: "Provider completes the job",
    body: "Assigned provider executes the task. Status syncs back to the requester.",
  },
];

function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            How FixHub works
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            One marketplace, two audiences: tenants of managed properties and the
            general public. Both streams flow into the maintenance module of Unit
            & Tenant Views.
          </p>

          <div className="mt-12 space-y-4">
            {flow.map((s, i) => (
              <Card key={s.title} className="border-border">
                <CardContent className="flex gap-5 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{s.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/request">Submit a request</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/providers">Browse providers</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}