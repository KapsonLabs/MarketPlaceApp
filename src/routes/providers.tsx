import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, BadgeCheck, Clock, MapPin, Star, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { providers, specialties, type Specialty } from "@/data/providers";

const searchSchema = z.object({
  specialty: z.string().optional(),
  welcome: z.string().optional(),
});

export const Route = createFileRoute("/providers")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse providers — Casmara Systems" },
      {
        name: "description",
        content:
          "Find vetted plumbers, electricians, HVAC techs, cleaners and more. All providers are background-checked and reviewed by customers.",
      },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const search = Route.useSearch();
  const activeSpecialty = search.specialty as Specialty | undefined;

  const list = activeSpecialty
    ? providers.filter((p) => p.specialty === activeSpecialty)
    : providers;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {search.welcome === "1" && (
          <div className="border-b border-primary/20 bg-primary/5">
            <div className="container mx-auto px-4 py-3">
              <p className="text-sm font-medium text-primary">
                Welcome to Casmara Systems! Browse our vetted providers below and request a service
                when you're ready.
              </p>
            </div>
          </div>
        )}

        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Browse providers
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  All providers are background-checked, licensed, and reviewed by customers. Pick
                  one and request directly, or let us match you automatically.
                </p>
              </div>
              <Button asChild>
                <Link to="/request">
                  Request a service <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/providers"
                search={{}}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (!activeSpecialty
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary")
                }
              >
                All
              </Link>
              {specialties
                .filter((s) => s !== "Other")
                .map((s) => (
                  <Link
                    key={s}
                    to="/providers"
                    search={{ specialty: s }}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (activeSpecialty === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary hover:text-primary")
                    }
                  >
                    {s}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          {list.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No providers found for that specialty.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/providers" search={{}}>
                  Clear filter
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Card
                  key={p.id}
                  className="border-border transition-shadow hover:shadow-[var(--shadow-elegant)]"
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h2 className="truncate text-base font-semibold text-foreground">
                            {p.company}
                          </h2>
                          {p.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.name}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">{p.specialty}</Badge>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span className="font-medium text-foreground">{p.rating}</span>(
                        {p.reviews} reviews)
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" /> {p.city}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> {p.responseTime}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> {p.completedJobs.toLocaleString()} jobs
                        completed
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {p.bio}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-sm font-semibold text-foreground">
                          USh {p.hourlyRate.toLocaleString()}/hr
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/providers/$providerId" params={{ providerId: p.id }}>
                            Profile
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link
                            to="/request"
                            search={{ providerId: p.id, specialty: p.specialty } as never}
                          >
                            Request
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
