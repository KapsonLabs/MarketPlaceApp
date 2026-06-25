import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Plus,
  ReceiptText,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketplace/site-header";
import { useCurrentUser } from "@/lib/marketplace/current-user";
import {
  listAllMyServiceRequests,
  type ServiceRequestListItem,
} from "@/lib/service-requests.api";
import { StatusBadge } from "@/components/admin/provider-badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace/requests")({
  head: () => ({
    meta: [
      { title: "My requests — Casmara Systems" },
      {
        name: "description",
        content: "Track your facility service requests, provider assignment and billing progress.",
      },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const user = useCurrentUser();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["marketplace", "my-service-requests"],
    queryFn: listAllMyServiceRequests,
    enabled: !!user,
  });

  const activeCount = requests.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled" && r.status !== "rejected",
  ).length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const outstandingBalance = requests.reduce((sum, r) => sum + requestBalance(r), 0);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  My requests
                </h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Track jobs from submission through completion.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link to="/marketplace/billing">
                  <ReceiptText className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Billing</span>
                </Link>
              </Button>
            </div>

            {user && !isLoading && requests.length > 0 && (
              <dl className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-border bg-background">
                <StatCell label="Active" value={activeCount.toString()} />
                <StatCell label="Done" value={completedCount.toString()} bordered />
                <StatCell label="Due" value={formatMoney(outstandingBalance, true)} bordered />
              </dl>
            )}
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
          {!user ? (
            <GuestState />
          ) : isLoading ? (
            <LoadingState />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-border">
              {requests.map((request) => (
                <li key={request.id}>
                  <RequestRow request={request} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCell({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: string;
  bordered?: boolean;
}) {
  return (
    <div className={cn("px-3 py-3 text-center sm:px-4", bordered && "border-l border-border")}>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-base font-semibold tabular-nums text-foreground sm:text-lg">
        {value}
      </dd>
    </div>
  );
}

function RequestRow({ request }: { request: ServiceRequestListItem }) {
  const balance = requestBalance(request);
  const total = requestTotal(request);
  const paid = parseAmount(request.amount_paid);
  const location = [request.city, request.district].filter(Boolean).join(", ");
  const isTerminal = request.status === "rejected" || request.status === "cancelled";

  return (
    <article className="py-5 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
            {request.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge value={request.status} />
            {request.payment_status !== "unpaid" && (
              <StatusBadge value={request.payment_status} />
            )}
          </div>
        </div>
        {!isTerminal && balance > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Due</p>
            <p className="text-sm font-semibold tabular-nums text-foreground sm:text-base">
              {formatMoney(balance)}
            </p>
          </div>
        )}
        {request.payment_status === "paid" && (
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-success">Paid</p>
          </div>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{request.description}</p>

      <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 shrink-0" />
          <span>{formatRelativeDate(request.updated_at)}</span>
        </div>
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {total > 0 && (
          <div className="sm:col-span-2">
            <span className="text-muted-foreground">Estimate </span>
            <span className="font-medium text-foreground">{formatMoney(total)}</span>
            {paid > 0 && (
              <>
                <span className="text-muted-foreground"> · paid </span>
                <span className="font-medium text-success">{formatMoney(paid)}</span>
              </>
            )}
          </div>
        )}
      </dl>

      {isTerminal ? (
        <p className="mt-4 text-sm text-muted-foreground">
          This request was {request.status.replace(/_/g, " ")} and is closed.
        </p>
      ) : (
        <RequestProgress status={request.status} />
      )}
    </article>
  );
}

const PROGRESS_STEPS = [
  { key: "submitted", label: "Submitted", short: "Sent" },
  { key: "awaiting_assignment", label: "Awaiting", short: "Queue" },
  { key: "assigned", label: "Assigned", short: "Match" },
  { key: "in_progress", label: "In progress", short: "Work" },
  { key: "completed", label: "Completed", short: "Done" },
] as const;

const STATUS_ORDER: Record<string, number> = {
  submitted: 0,
  awaiting_assignment: 1,
  assigned: 2,
  in_progress: 3,
  completed: 4,
  on_hold: 2,
};

function RequestProgress({ status }: { status: string }) {
  const currentIndex = STATUS_ORDER[status] ?? 0;
  const currentStep = PROGRESS_STEPS[currentIndex] ?? PROGRESS_STEPS[0];
  const progressPct = (currentIndex / (PROGRESS_STEPS.length - 1)) * 100;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-foreground">{currentStep.label}</span>
        <span className="text-muted-foreground">
          Step {currentIndex + 1} of {PROGRESS_STEPS.length}
        </span>
      </div>

      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(progressPct, 8)}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between gap-1">
        {PROGRESS_STEPS.map((step, index) => {
          const done = currentIndex > index;
          const current = currentIndex === index;
          return (
            <div
              key={step.key}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center"
            >
              <span
                className={cn(
                  "flex h-2 w-2 rounded-full",
                  done && "bg-primary",
                  current && "bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                  !done && !current && "bg-muted-foreground/30",
                )}
              />
              <span
                className={cn(
                  "hidden text-[10px] leading-tight sm:block",
                  current ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Updated today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

function parseAmount(value: string | null | undefined): number {
  if (!value) return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function requestTotal(request: ServiceRequestListItem): number {
  return parseAmount(request.estimated_cost);
}

function requestBalance(request: ServiceRequestListItem): number {
  const total = requestTotal(request);
  const paid = parseAmount(request.amount_paid);
  if (request.payment_status === "paid") return 0;
  return Math.max(total - paid, 0);
}

function formatMoney(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `USh ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && amount >= 100_000) {
    return `USh ${Math.round(amount / 1000)}K`;
  }
  return `USh ${Math.round(amount).toLocaleString()}`;
}

function GuestState() {
  return (
    <div className="flex flex-col items-center px-2 py-12 text-center sm:py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Sign in to track your requests</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your service history, progress and billing live here once you&apos;re signed in.
      </p>
      <Button asChild className="mt-6">
        <Link to="/marketplace/sign-in" search={{ redirect: "/marketplace/requests" } as never}>
          Sign in <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading your requests...
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-2 py-12 text-center sm:py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">No requests yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Submit a facility service request and it will appear here with live status updates.
      </p>
      <Button asChild className="mt-6">
        <Link to="/marketplace/request">
          <Plus className="mr-1 h-4 w-4" />
          Request service
        </Link>
      </Button>
    </div>
  );
}
