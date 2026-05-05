import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Star,
  Wrench,
  Calendar,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProvider } from "@/data/providers";

export const Route = createFileRoute("/providers/$providerId")({
  loader: ({ params }) => {
    const provider = getProvider(params.providerId);
    if (!provider) throw notFound();
    return { provider };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.provider.company} — FixHub` },
          { name: "description", content: loaderData.provider.bio },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Provider not found</h1>
      <Button asChild className="mt-4">
        <Link to="/providers">Back to providers</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-4 py-20 text-center text-destructive">
      {error.message}
    </div>
  ),
  component: ProviderDetail,
});

function ProviderDetail() {
  const { provider: p } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
            <Link to="/providers">
              <ArrowLeft className="mr-1 h-4 w-4" /> All providers
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        {p.company}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Lead pro: {p.name}
                      </p>
                    </div>
                    {p.verified && (
                      <Badge variant="secondary" className="gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{p.rating}</span>
                      ({p.reviews} reviews)
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {p.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Responds {p.responseTime.toLowerCase()}
                    </span>
                  </div>
                  <Badge variant="outline" className="mt-4">
                    <Wrench className="mr-1 h-3 w-3" /> {p.specialty}
                  </Badge>
                  <p className="mt-6 leading-relaxed text-foreground">{p.bio}</p>
                </CardContent>
              </Card>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat label="Years experience" value={`${p.yearsExperience}`} />
                <Stat label="Jobs completed" value={p.completedJobs.toLocaleString()} />
                <Stat label="Hourly rate" value={`KSh ${p.hourlyRate.toLocaleString()}`} />
              </div>
            </div>

            <aside className="lg:col-span-1">
              <Card className="sticky top-20 border-border shadow-[var(--shadow-elegant)]">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-bold text-foreground">
                    KSh {p.hourlyRate.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground"> /hr</span>
                  </p>
                  <Button asChild size="lg" className="mt-5 w-full">
                    <Link
                      to="/request"
                      search={{ providerId: p.id, specialty: p.specialty } as never}
                    >
                      <Calendar className="mr-1 h-4 w-4" /> Request this pro
                    </Link>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    No charge until the pro accepts your request.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}