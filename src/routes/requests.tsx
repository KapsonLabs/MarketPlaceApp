import { createFileRoute, Link } from "@tanstack/react-router";
import { startTransition, useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  ReceiptText,
  History,
  Star,
  MessageSquareText,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useCurrentUser } from "@/lib/current-user";
import { listUserRequests, submitReview } from "@/lib/requests.functions";
import {
  REQUEST_PROGRESS_STEPS,
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_HINT,
  deriveBillingRecord,
} from "@/lib/billing";
import type { ForwardedMaintenanceRequest, RequestStatus } from "@/lib/request-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/requests")({
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

const statusTone: Record<RequestStatus, string> = {
  Open: "bg-warning/15 text-warning-foreground border-warning/40",
  Triaged: "bg-primary/10 text-primary border-primary/30",
  Assigned: "bg-primary/15 text-primary border-primary/40",
  InProgress: "bg-accent/15 text-accent-foreground border-accent/40",
  Completed: "bg-success/15 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

function RequestsPage() {
  const user = useCurrentUser();
  const [requests, setRequests] = useState<ForwardedMaintenanceRequest[]>([]);
  const [paidAmounts, setPaidAmounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  function reload() {
    if (!user) return;
    setLoading(true);
    startTransition(() => {
      listUserRequests({ data: { userId: user.id } })
        .then((result) => {
          setRequests(result.requests);
          setPaidAmounts(result.paidAmounts);
        })
        .finally(() => setLoading(false));
    });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My requests</h1>
              <p className="mt-2 text-muted-foreground">
                Track the progress of every facility job from intake through completion.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/billing">
                Billing <ReceiptText className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!user ? (
            <GuestState />
          ) : loading ? (
            <LoadingState />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <SummaryCard
                  label="Open jobs"
                  value={requests
                    .filter((request) => request.status !== "Completed")
                    .length.toString()}
                />
                <SummaryCard
                  label="Completed jobs"
                  value={requests
                    .filter((request) => request.status === "Completed")
                    .length.toString()}
                />
                <SummaryCard
                  label="Outstanding balance"
                  value={`USh ${requests
                    .reduce(
                      (sum, request) =>
                        sum + deriveBillingRecord(request, paidAmounts[request.id] ?? 0).balance,
                      0,
                    )
                    .toLocaleString()}`}
                />
              </div>

              <div className="mt-8 space-y-4">
                {requests.map((request) => {
                  const invoice = deriveBillingRecord(request, paidAmounts[request.id] ?? 0);
                  return (
                    <Card key={request.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-semibold text-foreground">
                                {request.title}
                              </h2>
                              <Badge variant="outline" className={statusTone[request.status]}>
                                {REQUEST_STATUS_LABEL[request.status]}
                              </Badge>
                              <Badge variant="secondary">{request.priority}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {request.description}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {REQUEST_STATUS_HINT[request.status]}
                            </p>
                            {request.scheduledFor && (
                              <p className="mt-1 text-xs text-primary">
                                Assessment scheduled for{" "}
                                {new Date(request.scheduledFor).toLocaleString()}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                Updated {new Date(request.updatedAt).toLocaleString()}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {request.location.address ??
                                  `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ReceiptText className="h-3.5 w-3.5" />
                                {invoice.status} invoice
                              </span>
                            </div>
                          </div>
                          <Link
                            to="/billing"
                            className="rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-primary"
                          >
                            <p className="text-xs text-muted-foreground">Outstanding balance</p>
                            <p className="mt-1 text-2xl font-semibold text-foreground">
                              USh {invoice.balance.toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Total job fee: USh {invoice.total.toLocaleString()}
                            </p>
                            <p className="mt-2 text-xs font-medium text-primary">View invoice →</p>
                          </Link>
                        </div>

                        {request.status === "Cancelled" ? (
                          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-sm font-medium text-muted-foreground">
                              This request was cancelled and will not be progressed further.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-6 grid gap-2 sm:grid-cols-5">
                            {REQUEST_PROGRESS_STEPS.map((step, index) => {
                              const currentIndex = REQUEST_PROGRESS_STEPS.indexOf(request.status);
                              const active = currentIndex >= index;
                              return (
                                <div
                                  key={step}
                                  className={
                                    "rounded-lg border p-3 text-sm " +
                                    (active
                                      ? "border-primary bg-primary/5 text-foreground"
                                      : "border-border bg-background text-muted-foreground")
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={
                                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold " +
                                        (active
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground")
                                      }
                                    >
                                      {index + 1}
                                    </span>
                                    <span className="leading-tight">
                                      {REQUEST_STATUS_LABEL[step]}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {request.notes && (
                          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Latest update
                            </p>
                            <p className="mt-2 text-sm text-foreground">{request.notes}</p>
                          </div>
                        )}

                        <OrderHistory request={request} />

                        <ReviewSection
                          request={request}
                          author={user?.name ?? "Customer"}
                          onSubmitted={reload}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function GuestState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to track your requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your marketplace account keeps your service history, progress and billing in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/sign-in" search={{ redirect: "/requests" } as never}>
            Sign in <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex items-center gap-3 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your requests...
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">No requests yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Once you submit a facility service request, it will show up here with status updates.
          </p>
        </div>
        <Button asChild>
          <Link to="/request">Request service</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const statusDot: Record<RequestStatus, string> = {
  Open: "bg-warning",
  Triaged: "bg-primary/70",
  Assigned: "bg-primary",
  InProgress: "bg-accent",
  Completed: "bg-success",
  Cancelled: "bg-muted-foreground",
};

function OrderHistory({ request }: { request: ForwardedMaintenanceRequest }) {
  const history =
    request.statusHistory && request.statusHistory.length > 0
      ? request.statusHistory
      : [{ status: request.status, at: request.createdAt }];
  return (
    <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Order history</p>
      </div>
      <ol className="mt-3 space-y-2">
        {history.map((entry, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            <span
              className={
                "mt-1.5 h-2 w-2 shrink-0 rounded-full " + statusDot[entry.status]
              }
              aria-hidden
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{entry.status}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.at).toLocaleString()}
                </span>
              </div>
              {entry.notes && (
                <p className="mt-0.5 text-xs text-muted-foreground">{entry.notes}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReviewSection({
  request,
  author,
  onSubmitted,
}: {
  request: ForwardedMaintenanceRequest;
  author: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (request.status !== "Completed") return null;

  if (request.review) {
    const r = request.review;
    return (
      <div className="mt-4 rounded-lg border border-success/40 bg-success/5 p-4">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-success" />
          <p className="text-sm font-semibold text-foreground">Your review</p>
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(r.at).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-warning">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={"h-4 w-4 " + (i < r.rating ? "fill-current" : "text-muted")}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-foreground">{r.comment}</p>
      </div>
    );
  }

  async function submit() {
    if (comment.trim().length < 3) {
      setError("Please write a short comment.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await submitReview({
        data: { requestId: request.id, rating, comment: comment.trim(), author },
      });
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Leave a review</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Help other customers by rating this completed job.
      </p>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="rounded p-0.5 text-warning transition-transform hover:scale-110"
            aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
          >
            <Star className={"h-5 w-5 " + (n <= rating ? "fill-current" : "text-muted")} />
          </button>
        ))}
      </div>
      <Textarea
        rows={3}
        className="mt-3"
        placeholder="What went well? Anything to improve?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={submit} disabled={busy}>
          {busy && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
          Submit review
        </Button>
      </div>
    </div>
  );
}
