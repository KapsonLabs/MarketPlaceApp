import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Shield,
  Sparkles,
  Star,
  Store,
  Zap,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { providers, specialties } from "@/data/providers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casmara Systems — Trusted home & property service providers" },
      {
        name: "description",
        content:
          "Request a vetted plumber, electrician, HVAC technician or handyman. Tenants and homeowners get matched in minutes.",
      },
    ],
  }),
  component: Landing,
});

const stats = [
  { value: "1,200+", label: "Verified pros" },
  { value: "18 min", label: "Avg. response" },
  { value: "4.8★", label: "Avg. rating" },
  { value: "24/7", label: "Emergency desk" },
];

const steps = [
  {
    icon: Search,
    title: "Tell us what's broken",
    body: "Describe the issue in 30 seconds. Add photos if it helps.",
  },
  {
    icon: Sparkles,
    title: "We match a pro",
    body: "Your request is routed to the right specialist nearby.",
  },
  {
    icon: CheckCircle2,
    title: "Job tracked end-to-end",
    body: "Tenant requests sync into your property's maintenance queue automatically.",
  },
];

function Landing() {
  const featured = providers.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{ background: "var(--gradient-soft)" }}
          />
          <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-5 w-fit gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Synced with your property manager
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Find a trusted pro.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  Fix it today.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Request a plumber, electrician, HVAC tech or handyman. Tenants get their request
                routed straight into the building's maintenance queue — homeowners get a vetted pro
                on-site, fast.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-[var(--shadow-elegant)]">
                  <Link to="/request">
                    Request a service <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/providers">Browse providers</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/materials">Materials market</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="border-border shadow-[var(--shadow-elegant)]">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Popular services</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {specialties.slice(0, 8).map((s) => (
                      <Link
                        key={s}
                        to="/providers"
                        search={{ specialty: s } as never}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 space-y-3">
                    {featured.map((p) => (
                      <Link
                        key={p.id}
                        to="/providers/$providerId"
                        params={{ providerId: p.id }}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-all hover:border-primary"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{p.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.specialty} • {p.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {p.rating}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From "it's broken" to "it's fixed"
            </h2>
            <p className="mt-3 text-muted-foreground">
              The same workflow whether you rent, own, or manage a building.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="border-border">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Vetted & insured",
                body: "Background checks, license verification, customer reviews.",
              },
              {
                icon: Clock,
                title: "Real response times",
                body: "Most jobs accepted within 30 minutes during business hours.",
              },
              {
                icon: Store,
                title: "Materials market",
                body: "Source approved repair materials and ask a provider to install them.",
              },
            ].map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <Card
            className="overflow-hidden border-0 text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <CardContent className="flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Got a leak, an outage, or a broken appliance?
                </h3>
                <p className="mt-2 text-primary-foreground/85">
                  Submit a request and we'll route it to the right pro in minutes.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary" className="shrink-0">
                <Link to="/request">
                  Request a service <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
