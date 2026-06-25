import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  Receipt,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/provider-badges";
import {
  getAdminServiceRequest,
  type ServiceRequestDetail,
} from "@/lib/service-requests.api";

export const Route = createFileRoute("/admin/_shell/requests/$requestId")({
  head: () => ({ meta: [{ title: "Request — Casmara Admin" }] }),
  component: RequestDetailPage,
});

function formatUGX(value: string | number | null): string {
  if (value == null) return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "—";
  return `UGX ${n.toLocaleString()}`;
}

function RequestDetailPage() {
  const { requestId } = Route.useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["service-request", requestId],
    queryFn: () => getAdminServiceRequest(requestId),
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/admin/dashboard">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to requests
        </Link>
      </Button>

      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : isError ? (
        <Card className="border-border">
          <CardContent className="flex items-center gap-2 p-8 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {(error as { uiMessage?: string; message?: string }).uiMessage ??
              (error as Error).message ??
              "Failed to load request."}
          </CardContent>
        </Card>
      ) : (
        <RequestView request={data} />
      )}
    </div>
  );
}

function RequestView({ request: r }: { request: ServiceRequestDetail }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {r.title}
              </h1>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                {r.id} • {new Date(r.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={r.status} />
              <StatusBadge value={r.payment_status} />
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
                {r.priority}
              </span>
            </div>
          </div>
          {r.description && (
            <p className="mt-4 text-sm text-foreground/90">{r.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Info grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard icon={MapPin} title="Location">
          <Field label="Address">
            {[r.formatted_address, r.city, r.district, r.country]
              .filter(Boolean)
              .join(", ") || "—"}
          </Field>
          <Field label="Coordinates">
            {r.latitude != null && r.longitude != null ? (
              <a
                href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {r.latitude}, {r.longitude}
              </a>
            ) : (
              "—"
            )}
          </Field>
        </InfoCard>

        <InfoCard icon={CalendarClock} title="Schedule & contact">
          <Field label="Preferred date">{r.preferred_date ?? "—"}</Field>
          <Field label="Preferred time">{r.preferred_time ?? "—"}</Field>
          <Field label="Contact">
            {r.contact_person || r.contact_phone || r.contact_email || "—"}
          </Field>
        </InfoCard>

        <InfoCard icon={CreditCard} title="Financials">
          <Field label="Estimated cost">{formatUGX(r.estimated_cost)}</Field>
          <Field label="Deposit required">{formatUGX(r.deposit_required)}</Field>
          <Field label="Amount paid">{formatUGX(r.amount_paid)}</Field>
          <Field label="Cost variance">{formatUGX(r.cost_variance)}</Field>
        </InfoCard>

        <InfoCard icon={UserCheck} title="Assignment">
          <Field label="Type">
            <span className="capitalize">
              {r.assignment_type.replace(/_/g, " ")}
            </span>
          </Field>
          <Field label="Assigned provider">
            {r.assigned_provider ? (
              <Link
                to="/admin/providers/$providerId"
                params={{ providerId: r.assigned_provider }}
                className="font-mono text-xs text-primary hover:underline"
              >
                {r.assigned_provider.slice(0, 8)}…
              </Link>
            ) : (
              "—"
            )}
          </Field>
          <Field label="Requester">
            <span className="font-mono text-xs">
              {r.requester_name.trim() || r.requester.slice(0, 8) + "…"}
            </span>
          </Field>
        </InfoCard>
      </div>

      {/* Payments */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Receipt className="h-4 w-4 text-primary" /> Payments
          </h2>
          <div className="mt-4 space-y-2">
            {r.payments.length === 0 && (
              <p className="text-sm text-muted-foreground">No payments recorded.</p>
            )}
            {r.payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm"
              >
                <div>
                  <span className="font-medium capitalize text-foreground">
                    {p.payment_type}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.reference}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {formatUGX(p.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignments */}
      {r.assignments.length > 0 && (
        <Card className="border-border">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UserCheck className="h-4 w-4 text-primary" /> Assignment history
            </h2>
            <div className="mt-4 space-y-2">
              {r.assignments.map((a) => (
                <div
                  key={a.id}
                  className="rounded-md border border-border p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground">
                      {a.provider.slice(0, 8)}…
                    </span>
                    <StatusBadge value={a.acceptance_status} />
                  </div>
                  {a.assignment_reason && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.assignment_reason}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.assignment_date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </h2>
        <dl className="mt-3 space-y-2">{children}</dl>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{children}</dd>
    </div>
  );
}
