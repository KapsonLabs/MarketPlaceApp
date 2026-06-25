import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Timer,
  Trophy,
  UserCheck,
  Wrench,
} from "lucide-react";
import type { ProviderDetail } from "@/lib/providers.api";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProviderServiceDialog } from "@/components/admin/provider-service-dialog";
import { StatusBadge } from "@/components/admin/provider-badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProvider } from "@/lib/providers.api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/providers/$providerId")({
  head: () => ({ meta: [{ title: "Provider detail - Casmara Systems Admin" }] }),
  component: ProviderDetailPage,
  notFoundComponent: () => (
    <AdminShell title="Provider not found">
      <p className="text-sm text-muted-foreground">
        This provider does not exist.{" "}
        <Link to="/admin/providers" className="text-primary hover:underline">
          Back to providers
        </Link>
      </p>
    </AdminShell>
  ),
});

function ProviderDetailPage() {
  const { providerId } = Route.useParams();

  const providerQuery = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId),
  });

  if (providerQuery.isPending) {
    return (
      <AdminShell title="Provider">
        <LoadingState />
      </AdminShell>
    );
  }

  if (providerQuery.isError) {
    return (
      <AdminShell title="Provider">
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {(providerQuery.error as { uiMessage?: string; message?: string }).uiMessage ??
            (providerQuery.error as Error).message ??
            "Failed to load provider."}
        </div>
      </AdminShell>
    );
  }

  const provider = providerQuery.data;

  return (
    <AdminShell
      title="Provider profile"
      description="Review service capability, verification state, documents, and operational metrics."
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/providers">
            <ArrowLeft className="mr-2 h-4 w-4" /> All providers
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <ProviderHero provider={provider} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Trophy}
            label="Jobs completed"
            value={provider.statistics.jobs_completed.toLocaleString()}
            hint={`${provider.statistics.jobs_in_progress} in progress`}
          />
          <MetricCard
            icon={Star}
            label="Average rating"
            value={formatRating(provider.average_rating)}
            hint={`${provider.statistics.total_reviews} reviews`}
          />
          <MetricCard
            icon={UserCheck}
            label="Acceptance rate"
            value={formatPercent(provider.statistics.acceptance_rate)}
            hint="Accepted requests"
          />
          <MetricCard
            icon={Timer}
            label="Response time"
            value={formatMinutes(provider.statistics.avg_response_minutes)}
            hint="Average response"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <SkillsTimeline provider={provider} />
            <DocumentsCard provider={provider} />
          </div>

          <aside className="space-y-6">
            <StatusCard provider={provider} />
            <ContactCard provider={provider} />
            <RegistrationCard provider={provider} />
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}

function ProviderHero({ provider }: { provider: ProviderDetail }) {
  const joinedAt = new Date(provider.created_at).toLocaleDateString();
  const address = display(provider.formatted_address || provider.city || provider.country);

  return (
    <Card className="overflow-hidden border-border">
      <div className="relative min-h-[260px] bg-gradient-to-br from-sidebar via-sidebar to-primary/40">
        {provider.cover_image && (
          <img
            src={provider.cover_image}
            alt={`${provider.business_name} cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="relative flex min-h-[260px] flex-col justify-end p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={provider.profile_image ?? undefined} alt={provider.business_name} />
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {initials(provider.business_name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge value={provider.approval_status} />
                  <StatusBadge value={provider.verification_status} />
                  <StatusBadge value={provider.availability_status} />
                </div>
                <h2 className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {provider.business_name}
                  {provider.verification_status === "verified" && (
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  )}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 capitalize">
                    <BriefcaseBusiness className="h-4 w-4" />
                    {provider.provider_type}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {address}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Joined {joinedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Service radius
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {provider.service_radius_km} km
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCoordinates(provider.latitude, provider.longitude)}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground">
            {provider.description ||
              "No provider description has been added yet. Use the service and document sections below to assess capability and readiness."}
          </p>
        </div>
      </div>
    </Card>
  );
}

function SkillsTimeline({ provider }: { provider: ProviderDetail }) {
  const services = [...provider.services].sort((a, b) => {
    const rateA = Number.parseFloat(a.hourly_rate ?? "0");
    const rateB = Number.parseFloat(b.hourly_rate ?? "0");
    if (rateB !== rateA) return rateB - rateA;
    return b.years_of_experience - a.years_of_experience;
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Skills offered</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Service categories this provider can deliver, with proficiency and pricing.
          </p>
        </div>
        <ProviderServiceDialog providerId={provider.id} />
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
          <Wrench className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">No skills listed yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a service category to make this provider eligible for matching.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => {
            const isPrimary = index === 0;
            const hasRate = !!service.hourly_rate;

            return (
              <div
                key={service.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  isPrimary
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card/50",
                )}
              >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {service.category_name}
                        </p>
                        {isPrimary && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            <Award className="h-3 w-3" />
                            Primary skill
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {service.years_of_experience}{" "}
                        {service.years_of_experience === 1 ? "year" : "years"} experience
                        {hasRate ? ` · ${formatCurrency(service.hourly_rate)}` : " · No hourly rate set"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={service.skill_level} />
                      <StatusBadge value={service.certification_status} />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <SkillStat
                      label="Skill level"
                      value={prettify(service.skill_level)}
                      accent={isPrimary}
                    />
                    <SkillStat
                      label="Certification"
                      value={prettify(service.certification_status)}
                    />
                    <SkillStat
                      label="Hourly rate"
                      value={hasRate ? formatCurrency(service.hourly_rate) : "Not set"}
                      accent={hasRate}
                    />
                  </div>

                  {service.certification_status === "verified" && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Certification verified for this category
                    </p>
                  )}
                  {service.certification_status === "claimed" && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Provider has claimed certification — pending verification.
                    </p>
                  )}
                </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SkillStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2",
        accent ? "border-primary/20 bg-primary/5" : "border-border/60 bg-muted/20",
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function prettify(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function DocumentsCard({ provider }: { provider: ProviderDetail }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Documents</CardTitle>
        <p className="text-xs text-muted-foreground">
          Uploaded compliance and verification documents.
        </p>
      </CardHeader>
      <CardContent>
        {provider.documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents uploaded"
            body="Documents will appear here once submitted by the provider."
          />
        ) : (
          <div className="space-y-3">
            {provider.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{doc.title}</p>
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                      {doc.document_type.replace(/_/g, " ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Issued {formatDate(doc.issue_date)} · Expires {formatDate(doc.expiry_date)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusBadge value={doc.verification_status} />
                  {doc.document_file && (
                    <Button asChild size="sm" variant="outline">
                      <a href={doc.document_file} target="_blank" rel="noreferrer">
                        View <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusCard({ provider }: { provider: ProviderDetail }) {
  const stats = provider.statistics;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Provider status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusRow label="Approval" value={provider.approval_status} />
        <StatusRow label="Verification" value={provider.verification_status} />
        <StatusRow label="Availability" value={provider.availability_status} />
        <StatusRow label="Active account" value={provider.is_active ? "active" : "inactive"} />
        <div className="rounded-xl bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Acceptance rate</span>
            <span className="font-semibold text-foreground">
              {formatPercent(stats.acceptance_rate)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${clampPercent(stats.acceptance_rate)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactCard({ provider }: { provider: ProviderDetail }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Contact & location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DetailItem icon={Mail} label="Email" value={display(provider.email)} />
        <DetailItem icon={Phone} label="Primary phone" value={display(provider.primary_phone)} />
        <DetailItem
          icon={Phone}
          label="Secondary phone"
          value={display(provider.secondary_phone)}
        />
        <DetailItem
          icon={MapPin}
          label="Address"
          value={display(provider.formatted_address || provider.city)}
        />
        <DetailItem icon={Navigation} label="District" value={display(provider.district)} />
        <DetailItem icon={Globe} label="Country" value={display(provider.country)} />
      </CardContent>
    </Card>
  );
}

function RegistrationCard({ provider }: { provider: ProviderDetail }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Registration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DetailItem
          icon={BriefcaseBusiness}
          label="Registration number"
          value={display(provider.registration_number)}
        />
        <DetailItem
          icon={FileText}
          label="Tax identification"
          value={display(provider.tax_identification_number)}
        />
        <DetailItem icon={Globe} label="Website" value={display(provider.website)} />
        <DetailItem
          icon={CalendarDays}
          label="Updated"
          value={new Date(provider.updated_at).toLocaleDateString()}
        />
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <StatusBadge value={value} />
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-20 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading provider...
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRating(rating: string) {
  const value = Number.parseFloat(rating);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : "Unrated";
}

function formatCurrency(amount: string | null) {
  if (!amount) return "No rate";
  const value = Number.parseFloat(amount);
  if (!Number.isFinite(value)) return amount;
  return `USh ${value.toLocaleString()}/hr`;
}

function formatPercent(value: string) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return "0%";
  return `${parsed.toFixed(0)}%`;
}

function clampPercent(value: string) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, parsed));
}

function formatMinutes(value: number) {
  if (value <= 0) return "No data";
  if (value < 60) return `${value} min`;
  const hours = value / 60;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)} hr`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function formatCoordinates(latitude: number | null, longitude: number | null) {
  if (latitude == null || longitude == null) return "No coordinates";
  return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
}

function display(value: string | number | null | undefined) {
  if (value == null || value === "") return "-";
  return String(value);
}
