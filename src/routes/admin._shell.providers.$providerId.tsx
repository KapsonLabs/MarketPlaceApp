import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/provider-badges";
import { ProviderServiceDialog } from "@/components/admin/provider-service-dialog";
import { getProvider, type ProviderDetail } from "@/lib/providers.api";

export const Route = createFileRoute("/admin/_shell/providers/$providerId")({
  head: () => ({ meta: [{ title: "Provider — Casmara Admin" }] }),
  component: ProviderDetailPage,
});

function ProviderDetailPage() {
  const { providerId } = Route.useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/admin/providers">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to providers
        </Link>
      </Button>

      {isPending ? (
        <DetailSkeleton />
      ) : isError ? (
        <Card className="border-border">
          <CardContent className="flex items-center gap-2 p-8 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {(error as { uiMessage?: string; message?: string }).uiMessage ??
              (error as Error).message ??
              "Failed to load provider."}
          </CardContent>
        </Card>
      ) : (
        <ProviderView provider={data} />
      )}
    </div>
  );
}

function ProviderView({ provider }: { provider: ProviderDetail }) {
  const initials = provider.business_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const stats: Array<{ label: string; value: string | number }> = [
    { label: "Completed", value: provider.statistics.jobs_completed },
    { label: "In progress", value: provider.statistics.jobs_in_progress },
    { label: "Cancelled", value: provider.statistics.jobs_cancelled },
    { label: "Acceptance", value: `${provider.statistics.acceptance_rate}%` },
    {
      label: "Avg response",
      value: `${provider.statistics.avg_response_minutes}m`,
    },
    { label: "Reviews", value: provider.statistics.total_reviews },
  ];

  const contact = [
    provider.primary_phone && { icon: Phone, value: provider.primary_phone },
    provider.email && { icon: Mail, value: provider.email },
    provider.website && { icon: Globe, value: provider.website },
  ].filter(Boolean) as Array<{ icon: typeof Phone; value: string }>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-border">
        <div className="h-28 bg-gradient-to-r from-primary/80 to-accent/60" />
        <CardContent className="p-6">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow">
                {provider.profile_image ? (
                  <img
                    src={provider.profile_image}
                    alt={provider.business_name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {provider.business_name}
                </h1>
                <p className="text-sm capitalize text-muted-foreground">
                  {provider.provider_type}
                  {provider.years_of_experience
                    ? ` • ${provider.years_of_experience} yrs experience`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold text-foreground">
                {provider.average_rating}
              </span>
              <span className="text-muted-foreground">
                ({provider.rating_count} ratings)
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={provider.verification_status} />
            <StatusBadge value={provider.approval_status} />
            <StatusBadge value={provider.availability_status} />
          </div>

          {provider.description && (
            <p className="mt-4 text-sm text-foreground/90">
              {provider.description}
            </p>
          )}

          {contact.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {contact.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <c.icon className="h-3.5 w-3.5" />
                  {c.value}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Services */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Wrench className="h-4 w-4 text-primary" /> Services
              </h2>
              <ProviderServiceDialog providerId={provider.id} />
            </div>
            <div className="mt-4 space-y-3">
              {provider.services.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No services listed.
                </p>
              )}
              {provider.services.map((s) => (
                <div
                  key={s.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      {s.category_name}
                    </span>
                    {s.hourly_rate && (
                      <span className="text-sm text-muted-foreground">
                        UGX {s.hourly_rate}/hr
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge value={s.skill_level} />
                    <StatusBadge value={s.certification_status} />
                    {s.years_of_experience > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {s.years_of_experience} yrs
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" /> Documents
            </h2>
            <div className="mt-4 space-y-3">
              {provider.documents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No documents uploaded.
                </p>
              )}
              {provider.documents.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border p-3"
                >
                  <div>
                    <a
                      href={d.document_file}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {d.title}
                    </a>
                    <p className="text-xs capitalize text-muted-foreground">
                      {d.document_type.replace(/_/g, " ")}
                      {d.expiry_date ? ` • expires ${d.expiry_date}` : ""}
                    </p>
                  </div>
                  <StatusBadge value={d.verification_status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Location & coverage
          </h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="text-foreground">
                {[provider.formatted_address, provider.city, provider.country]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Service radius</p>
              <p className="text-foreground">
                {provider.service_radius_km} km
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Coordinates</p>
              {provider.latitude != null && provider.longitude != null ? (
                <a
                  href={`https://www.google.com/maps?q=${provider.latitude},${provider.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  {provider.latitude.toFixed(4)},{" "}
                  {provider.longitude.toFixed(4)}
                </a>
              ) : (
                <p className="text-foreground">—</p>
              )}
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Joined {new Date(provider.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border">
        <Skeleton className="h-28 w-full rounded-none" />
        <CardContent className="p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
