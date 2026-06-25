import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Search, Send, Wrench } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/marketplace/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Casmara Systems" },
      {
        name: "description",
        content:
          "How Casmara Systems routes maintenance requests from the public to the right service provider and into your property's maintenance queue.",
      },
    ],
  }),
  component: HowItWorks,
});

const flow = [
  {
    icon: Search,
    title: "1. Submit on marketplace",
    body: "Public form on /request collects contact, address, optional property/unit code, category, priority, description and up to 5 photos.",
  },
  {
    icon: Send,
    title: "2. Validated & forwarded",
    body: "submitRequest server function validates with Zod, maps Specialty → RequestCategory, then POSTs a MaintenanceRequest into Unit & Tenant Views.",
  },
  {
    icon: ClipboardList,
    title: "3. Triaged in admin",
    body: "Marketplace admins see the request at /admin/dashboard and a property manager sees it at /maintenance in Unit & Tenant Views.",
  },
  {
    icon: Wrench,
    title: "4. Assigned & completed",
    body: "A vetted provider is assigned, executes the job, and status updates flow back to the requester via email.",
  },
];

const requiredFields: { name: string; type: string; notes: string }[] = [
  { name: "audience", type: "'tenant' | 'public'", notes: "Drives whether property/unit are required." },
  { name: "name", type: "string (2–120)", notes: "Requester full name." },
  { name: "email", type: "email (≤200)", notes: "Used as tenantId when audience = tenant." },
  { name: "phone", type: "string (6–40)", notes: "Contact number." },
  { name: "address", type: "string (3–300)", notes: "Service address." },
  { name: "propertyCode", type: "string (≤60), optional", notes: "Required for tenants → propertyId." },
  { name: "unitNumber", type: "string (≤40), optional", notes: "Required for tenants → unitId." },
  { name: "specialty", type: "Specialty enum", notes: "Mapped to RequestCategory." },
  { name: "title", type: "string (3–120)", notes: "Short summary." },
  { name: "description", type: "string (10–2000)", notes: "What's wrong." },
  { name: "priority", type: "Low | Medium | High | Emergency", notes: "Drives SLA." },
  { name: "photos", type: "image/jpeg|png|webp, ≤5MB, max 5", notes: "Validated client + server side." },
  { name: "preferredProviderId", type: "string, optional", notes: "Set when arriving from a provider page." },
];

const statuses: { name: string; tone: string; meaning: string }[] = [
  { name: "Open", tone: "bg-warning/15 text-warning-foreground border-warning/40", meaning: "Just submitted, awaiting triage." },
  { name: "Triaged", tone: "bg-primary/10 text-primary border-primary/30", meaning: "Reviewed and categorised by admin." },
  { name: "Assigned", tone: "bg-primary/15 text-primary border-primary/40", meaning: "Routed to a specific service provider." },
  { name: "InProgress", tone: "bg-accent/15 text-accent-foreground border-accent/40", meaning: "Provider is on-site or actively working." },
  { name: "Completed", tone: "bg-success/15 text-success border-success/40", meaning: "Job finished and signed off." },
  { name: "Cancelled", tone: "bg-muted text-muted-foreground border-border", meaning: "Withdrawn or duplicate." },
];

function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            How Casmara Systems works
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

          <h2 className="mt-16 text-2xl font-bold tracking-tight text-foreground">
            Required fields
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Validated by the <code className="rounded bg-muted px-1">submitRequest</code> server function (Zod) before reaching the Maintenance module.
          </p>
          <Card className="mt-4 border-border">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Type / rule</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {requiredFields.map((f) => (
                    <tr key={f.name} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{f.name}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{f.type}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{f.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h2 className="mt-16 text-2xl font-bold tracking-tight text-foreground">
            Status lifecycle
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Open → Triaged → Assigned → InProgress → Completed (or Cancelled at any step).
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {statuses.map((s) => (
              <Card key={s.name} className="border-border">
                <CardContent className="flex items-center gap-3 p-4">
                  <Badge variant="outline" className={s.tone}>
                    {s.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{s.meaning}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/marketplace/request">Submit a request</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/administrator/dashboard">Open admin dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}