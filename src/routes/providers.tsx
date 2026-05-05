import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Search, Star, MapPin, BadgeCheck, Clock } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { providers, specialties, type Specialty } from "@/data/providers";

const searchSchema = z.object({
  specialty: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/providers")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse service providers — FixHub" },
      {
        name: "description",
        content:
          "Discover vetted plumbers, electricians, HVAC techs and handymen in your area. Compare ratings and response times.",
      },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/providers" });
  const [q, setQ] = useState(search.q ?? "");
  const active = (search.specialty ?? "All") as Specialty | "All";

  const list = useMemo(() => {
    return providers.filter((p) => {
      const okS = active === "All" || p.specialty === active;
      const okQ =
        !q ||
        p.company.toLowerCase().includes(q.toLowerCase()) ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.city.toLowerCase().includes(q.toLowerCase());
      return okS && okQ;
    });
  }, [active, q]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Service providers
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse vetted pros and request a quote.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, company or city"
                  className="pl-9"
                />
              </div>
              <Button asChild>
                <Link to="/request">Request service</Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(["All", ...specialties] as const).map((s) => {
                const isActive = active === s;
                return (
                  <button
                    key={s}
                    onClick={() =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          specialty: s === "All" ? undefined : s,
                        }),
                      })
                    }
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary hover:text-primary")
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          {list.length === 0 ? (
            <p className="text-muted-foreground">No providers match those filters.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Card key={p.id} className="border-border transition-shadow hover:shadow-[var(--shadow-elegant)]">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{p.company}</h3>
                        <p className="text-xs text-muted-foreground">{p.name}</p>
                      </div>
                      {p.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <BadgeCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span className="font-medium text-foreground">{p.rating}</span>
                        ({p.reviews})
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {p.city}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {p.responseTime}
                      </span>
                    </div>
                    <Badge variant="outline" className="mt-3 w-fit">
                      {p.specialty}
                    </Badge>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {p.bio}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">
                          KSh {p.hourlyRate.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground"> /hr</span>
                      </p>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          to="/providers/$providerId"
                          params={{ providerId: p.id }}
                        >
                          View profile
                        </Link>
                      </Button>
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