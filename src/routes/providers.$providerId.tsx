import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Star,
  Wrench,
  Calendar,
  BriefcaseBusiness,
  MessageSquareText,
  ShieldCheck,
  Store,
  CheckCircle2,
  Languages,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProvider, providerCover, providerGallery } from "@/data/providers";

export const Route = createFileRoute("/providers/$providerId")({
  loader: ({ params }) => {
    const provider = getProvider(params.providerId);
    if (!provider) throw notFound();
    return { provider };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.provider.company} — Casmara Systems` },
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
    <div className="container mx-auto px-4 py-20 text-center text-destructive">{error.message}</div>
  ),
  component: ProviderDetail,
});

function ProviderDetail() {
  const { provider: p } = Route.useLoaderData();
  const cover = providerCover(p);
  const gallery = providerGallery(p);
  const services = p.services ?? ["On-site assessment", "Material sourcing", "Photo job updates"];
  const certifications = p.certifications ?? [
    "Identity verified",
    "Workmanship guarantee",
    "Marketplace quality checks",
  ];
  const serviceAreas = p.serviceAreas ?? [p.city];
  const languages = p.languages ?? ["English"];
  const reviews = p.profileReviews ?? [
    {
      id: "review-default-1",
      author: "Verified customer",
      role: "Customer",
      rating: Math.round(p.rating),
      date: "Recent",
      service: p.specialty,
      comment:
        "Professional service, clear communication and tidy handover after the job was completed.",
    },
  ];

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

          <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-elegant)]">
            <div className="relative h-56 w-full sm:h-72">
              <img
                src={cover}
                alt={`${p.company} — ${p.specialty} services`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    <Wrench className="mr-1 h-3 w-3" />
                    {p.specialty}
                  </Badge>
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{p.company}</h1>
                </div>
                {p.verified && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </Badge>
                )}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-1 bg-border">
                {gallery.slice(0, 3).map((src: string, i: number) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${p.company} work sample ${i + 1}`}
                    className="h-24 w-full object-cover sm:h-32"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
                        {p.name
                          .split(" ")
                          .map((part: string) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lead pro: {p.name}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline">
                            <Wrench className="mr-1 h-3 w-3" /> {p.specialty}
                          </Badge>
                          <Badge variant="outline">
                            <ShieldCheck className="mr-1 h-3 w-3" /> Workmanship guarantee
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{p.rating}</span>({p.reviews}{" "}
                      reviews)
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {p.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Responds {p.responseTime.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-6 leading-relaxed text-foreground">{p.bio}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {services.slice(0, 6).map((service: string) => (
                      <div
                        key={service}
                        className="rounded-lg border border-border bg-muted/30 p-3 text-sm font-medium text-foreground"
                      >
                        <BriefcaseBusiness className="mb-2 h-4 w-4 text-primary" />
                        {service}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat label="Years experience" value={`${p.yearsExperience}`} />
                <Stat label="Jobs completed" value={p.completedJobs.toLocaleString()} />
                <Stat label="Hourly rate" value={`USh ${p.hourlyRate.toLocaleString()}`} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailPanel title="Credentials" icon={ShieldCheck}>
                  {certifications.map((item: string) => (
                    <DetailRow key={item}>{item}</DetailRow>
                  ))}
                </DetailPanel>
                <DetailPanel title="Coverage" icon={MapPin}>
                  {serviceAreas.map((area: string) => (
                    <DetailRow key={area}>{area}</DetailRow>
                  ))}
                </DetailPanel>
                <DetailPanel title="Languages" icon={Languages}>
                  {languages.map((language: string) => (
                    <DetailRow key={language}>{language}</DetailRow>
                  ))}
                </DetailPanel>
                <DetailPanel title="Availability" icon={Clock}>
                  <DetailRow>{p.availability ?? p.responseTime}</DetailRow>
                </DetailPanel>
              </div>

              <Card className="mt-6 border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquareText className="h-4 w-4 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{p.rating}</span>
                      average from {p.reviews} reviews
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {reviews.map((review: typeof reviews[number]) => (
                      <Review key={review.id} review={review} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="lg:col-span-1">
              <Card className="sticky top-20 border-border shadow-[var(--shadow-elegant)]">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-bold text-foreground">
                    USh {p.hourlyRate.toLocaleString()}
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
                  <Button asChild size="lg" variant="outline" className="mt-3 w-full">
                    <Link to="/materials">
                      <Store className="mr-1 h-4 w-4" /> Shop materials
                    </Link>
                  </Button>
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

function DetailPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <div className="mt-4 space-y-2">{children}</div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </div>
  );
}

function Review({
  review,
}: {
  review: {
    author: string;
    role: string;
    rating: number;
    date: string;
    service: string;
    comment: string;
  };
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{review.author}</p>
          <p className="text-xs text-muted-foreground">
            {review.role} • {review.date}
          </p>
        </div>
        <Badge variant="outline">{review.service}</Badge>
      </div>
      <div className="mt-3 flex items-center gap-1 text-warning">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className={"h-3.5 w-3.5 " + (idx < review.rating ? "fill-current" : "text-muted")}
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{review.comment}</p>
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
