import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Loader2, ShieldAlert, ShieldCheck, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/provider-badges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CompactFilterBar,
  SearchInput,
  FilterSelect,
  DateRangeFilter,
  ClearFiltersButton,
  inDateRange,
} from "@/components/admin/list-filters";
import { listAllProviders, type ProviderListItem } from "@/lib/providers.api";

export const Route = createFileRoute("/administrator/providers/")({
  head: () => ({ meta: [{ title: "Providers — Casmara Systems Admin" }] }),
  component: ProvidersPage,
});

const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function formatRating(rating: string) {
  const value = Number.parseFloat(rating);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : "-";
}

function ProvidersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: listAllProviders,
  });

  const providers = providersQuery.data ?? [];

  const providerTypes = useMemo(
    () => Array.from(new Set(providers.map((p) => p.provider_type))).sort(),
    [providers],
  );

  const hasAdvanced =
    approvalFilter !== "all" ||
    typeFilter !== "all" ||
    !!fromDate ||
    !!toDate ||
    !!query;

  const clearAll = () => {
    setQuery("");
    setApprovalFilter("all");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
  };

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesQuery =
        !query ||
        [p.id, p.business_name, p.city, p.district, p.provider_type]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesApproval =
        approvalFilter === "all" || p.approval_status === approvalFilter;
      const matchesType = typeFilter === "all" || p.provider_type === typeFilter;
      const matchesDate = inDateRange(p.created_at, fromDate, toDate);
      return matchesQuery && matchesApproval && matchesType && matchesDate;
    });
  }, [providers, query, approvalFilter, typeFilter, fromDate, toDate]);

  const columns = useMemo<ColumnDef<ProviderListItem>[]>(
    () => [
      {
        accessorKey: "business_name",
        header: "Provider",
        cell: ({ row }) => {
          const provider = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials(provider.business_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                  {provider.business_name}
                  {provider.verification_status === "verified" && (
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{provider.id.slice(0, 8)}...</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "provider_type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-sm capitalize">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: "city",
        header: "City",
        cell: ({ getValue }) => (
          <span className="text-sm">{String(getValue() || "-")}</span>
        ),
      },
      {
        accessorKey: "approval_status",
        header: "Approval",
        cell: ({ getValue }) => <StatusBadge value={String(getValue())} />,
      },
      {
        accessorKey: "verification_status",
        header: "Verification",
        cell: ({ getValue }) => <StatusBadge value={String(getValue())} />,
      },
      {
        accessorKey: "average_rating",
        header: "Rating",
        cell: ({ getValue }) => (
          <span className="inline-flex items-center justify-end gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {formatRating(String(getValue()))}
          </span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "jobs_completed",
        header: "Jobs",
        cell: ({ getValue }) => <span className="text-sm">{String(getValue())}</span>,
        meta: { align: "right" },
      },
    ],
    [],
  );

  const pending = providers.filter((p) => p.approval_status === "pending");

  return (
    <AdminShell
      title="Service providers"
      description="Approve onboarding applications and manage active providers. Open a provider to review and act."
    >
      {providersQuery.isPending ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading providers...
        </div>
      ) : providersQuery.isError ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {(providersQuery.error as { uiMessage?: string; message?: string }).uiMessage ??
            (providersQuery.error as Error).message ??
            "Failed to load providers."}
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <Card className="border-warning/40 bg-warning/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-warning-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {pending.length} provider{pending.length === 1 ? "" : "s"} awaiting review
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Open each application to verify credentials and approve.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {pending.map((p) => (
                    <PendingCard key={p.id} provider={p} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <CompactFilterBar summary={`${filtered.length} of ${providers.length}`}>
            <SearchInput
              compact
              value={query}
              onChange={setQuery}
              placeholder="Search providers..."
            />
            <FilterSelect
              compact
              value={approvalFilter}
              onChange={setApprovalFilter}
              allLabel="All approvals"
              options={APPROVAL_STATUSES.map((s) => ({ value: s, label: s }))}
            />
            <FilterSelect
              compact
              value={typeFilter}
              onChange={setTypeFilter}
              allLabel="All types"
              width="w-[140px]"
              options={providerTypes.map((t) => ({ value: t, label: t }))}
            />
            <DateRangeFilter
              compact
              from={fromDate}
              to={toDate}
              onFrom={setFromDate}
              onTo={setToDate}
            />
            <ClearFiltersButton compact active={hasAdvanced} onClear={clearAll} />
          </CompactFilterBar>

          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No providers match your filters."
            onRowClick={(provider) =>
              navigate({
                to: "/administrator/providers/$providerId",
                params: { providerId: provider.id },
              })
            }
          />
        </div>
      )}
    </AdminShell>
  );
}

function PendingCard({ provider }: { provider: ProviderListItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials(provider.business_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{provider.business_name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {provider.provider_type} • {provider.city || "No city"}
          </p>
        </div>
      </div>
      <Button asChild size="sm">
        <Link to="/administrator/providers/$providerId" params={{ providerId: provider.id }}>
          Review
        </Link>
      </Button>
    </div>
  );
}
