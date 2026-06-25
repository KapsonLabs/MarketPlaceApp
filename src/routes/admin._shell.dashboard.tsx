import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AlertCircle, ArrowUpRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/provider-badges";
import {
  listAdminServiceRequests,
  pageFromNext,
  type ServiceRequestListItem,
} from "@/lib/service-requests.api";

export const Route = createFileRoute("/admin/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Requests — Casmara Admin" }] }),
  component: AdminDashboardPage,
});

function formatUGX(value: string | number | null): string | null {
  if (value == null) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return null;
  return `UGX ${n.toLocaleString()}`;
}

function AdminDashboardPage() {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["service-requests"],
    queryFn: ({ pageParam }) => listAdminServiceRequests(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => pageFromNext(last.next),
  });

  const requests = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );
  const total = data?.pages[0]?.count ?? 0;

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of requests) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [requests]);

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Service requests
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isPending ? "Loading requests…" : `${total} requests in the marketplace`}
        </p>
      </div>

      {/* Status summary chips */}
      {!isPending && !isError && statusCounts.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {statusCounts.map(([status, count]) => (
            <div
              key={status}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs"
            >
              <StatusBadge value={status} className="border-0 bg-transparent px-0" />
              <span className="font-semibold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      )}

      {isError ? (
        <Card className="mt-8 border-border">
          <CardContent className="flex items-center gap-2 p-8 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {(error as { uiMessage?: string; message?: string }).uiMessage ??
              (error as Error).message ??
              "Failed to load requests."}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="space-y-3 p-5">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : requests.map((r) => <RequestCard key={r.id} request={r} />)}
        </div>
      )}

      {!isPending && !isError && requests.length === 0 && (
        <Card className="mt-6 border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            No requests yet.
          </CardContent>
        </Card>
      )}

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function RequestCard({ request: r }: { request: ServiceRequestListItem }) {
  const amount = formatUGX(r.estimated_cost ?? r.amount_paid);

  return (
    <Link
      to="/admin/requests/$requestId"
      params={{ requestId: r.id }}
      className="group block"
    >
      <Card className="h-full border-border transition-colors group-hover:border-primary/50">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
              {r.title}
            </h3>
            <StatusBadge value={r.status} className="shrink-0" />
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {r.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-3">
              <span className="capitalize">{r.priority}</span>
              {r.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {r.city}
                </span>
              )}
              <span>{new Date(r.created_at).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center gap-2">
              <StatusBadge value={r.payment_status} className="text-[10px]" />
              {amount && <span className="font-medium text-foreground">{amount}</span>}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
