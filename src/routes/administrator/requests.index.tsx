import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge, formatStatusLabel } from "@/components/admin/provider-badges";
import {
  CompactFilterBar,
  SearchInput,
  FilterSelect,
  DateRangeFilter,
  AmountRangeFilter,
  ClearFiltersButton,
  inDateRange,
  inAmountRange,
} from "@/components/admin/list-filters";
import { listServiceCategories } from "@/lib/service-categories.api";
import { listAllProviders } from "@/lib/providers.api";
import {
  listAllAdminServiceRequests,
  type ServiceRequestListItem,
} from "@/lib/service-requests.api";

export const Route = createFileRoute("/administrator/requests/")({
  head: () => ({ meta: [{ title: "Requests — Casmara Systems Admin" }] }),
  component: RequestsPage,
});

function formatMoney(value: string | null | undefined) {
  if (!value) return "-";
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return value;
  return `USh ${amount.toLocaleString()}`;
}

function displayName(name: string | null | undefined, fallback: string) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}

function RequestsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const requestsQuery = useQuery({
    queryKey: ["admin-service-requests"],
    queryFn: listAllAdminServiceRequests,
  });

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: listAllProviders,
  });

  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories,
  });

  const requests = requestsQuery.data ?? [];
  const providers = providersQuery.data ?? [];
  const categories = categoriesQuery.data?.results ?? [];

  const providerNames = useMemo(
    () => new Map(providers.map((p) => [p.id, p.business_name])),
    [providers],
  );

  const categoryNames = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(requests.map((r) => r.status)))
        .sort()
        .map((s) => ({ value: s, label: formatStatusLabel(s) })),
    [requests],
  );

  const hasAdvanced =
    statusFilter !== "all" ||
    providerFilter !== "all" ||
    !!fromDate ||
    !!toDate ||
    !!minAmount ||
    !!maxAmount ||
    !!query;

  const clearAll = () => {
    setQuery("");
    setStatusFilter("all");
    setProviderFilter("all");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const providerName = r.assigned_provider
        ? providerNames.get(r.assigned_provider)
        : "";
      const categoryName = categoryNames.get(r.service_category) ?? r.service_category;

      const matchesQuery =
        !query ||
        [
          r.id,
          r.title,
          r.requester_name,
          r.contact_email,
          r.city,
          categoryName,
          providerName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesProvider =
        providerFilter === "all" ||
        (providerFilter === "unassigned"
          ? !r.assigned_provider
          : r.assigned_provider === providerFilter);
      const matchesDate = inDateRange(r.created_at, fromDate, toDate);
      const cost = r.estimated_cost ? Number.parseFloat(r.estimated_cost) : undefined;
      const matchesAmount = inAmountRange(cost, minAmount, maxAmount);

      return (
        matchesQuery &&
        matchesStatus &&
        matchesProvider &&
        matchesDate &&
        matchesAmount
      );
    });
  }, [
    requests,
    query,
    statusFilter,
    providerFilter,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    providerNames,
    categoryNames,
  ]);

  const columns = useMemo<ColumnDef<ServiceRequestListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Request",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.id.slice(0, 8)}...</p>
          </div>
        ),
      },
      {
        id: "requester",
        header: "Requester",
        cell: ({ row }) => (
          <div>
            <p className="text-sm">
              {displayName(row.original.requester_name, "Unknown requester")}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.city || "-"}</p>
          </div>
        ),
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-sm">
            {categoryNames.get(row.original.service_category) ??
              row.original.service_category.slice(0, 8)}
          </span>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => <StatusBadge value={String(getValue())} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge value={String(getValue())} />,
      },
      {
        id: "provider",
        header: "Provider",
        cell: ({ row }) => {
          const name = row.original.assigned_provider
            ? providerNames.get(row.original.assigned_provider)
            : null;
          return (
            <span className="text-sm text-muted-foreground">{name ?? "Unassigned"}</span>
          );
        },
      },
      {
        accessorKey: "estimated_cost",
        header: "Estimate",
        cell: ({ getValue }) => (
          <span className="text-sm">{formatMoney(getValue() as string | null)}</span>
        ),
        meta: { align: "right" },
      },
    ],
    [categoryNames, providerNames],
  );

  const isLoading =
    requestsQuery.isPending || providersQuery.isPending || categoriesQuery.isPending;

  const loadError =
    requestsQuery.error ?? providersQuery.error ?? categoriesQuery.error;

  return (
    <AdminShell
      title="User requests"
      description="Triage incoming service requests, review assignments, and track payment status."
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading requests...
        </div>
      ) : loadError ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {(loadError as { uiMessage?: string; message?: string }).uiMessage ??
            (loadError as Error).message ??
            "Failed to load requests."}
        </div>
      ) : (
        <div className="space-y-4">
          <CompactFilterBar summary={`${filtered.length} of ${requests.length}`}>
            <SearchInput
              compact
              value={query}
              onChange={setQuery}
              placeholder="Search by ID, title, requester..."
            />
            <FilterSelect
              compact
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All statuses"
              options={statusOptions}
            />
            <FilterSelect
              compact
              value={providerFilter}
              onChange={setProviderFilter}
              allLabel="All providers"
              width="w-[170px]"
              options={[
                { value: "unassigned", label: "Unassigned" },
                ...providers.map((p) => ({ value: p.id, label: p.business_name })),
              ]}
            />
            <DateRangeFilter
              compact
              from={fromDate}
              to={toDate}
              onFrom={setFromDate}
              onTo={setToDate}
            />
            <AmountRangeFilter
              compact
              min={minAmount}
              max={maxAmount}
              onMin={setMinAmount}
              onMax={setMaxAmount}
              minPlaceholder="Cost min"
              maxPlaceholder="Cost max"
            />
            <ClearFiltersButton compact active={hasAdvanced} onClear={clearAll} />
          </CompactFilterBar>

          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No requests match your filters."
            onRowClick={(request) =>
              navigate({
                to: "/administrator/requests/$requestId",
                params: { requestId: request.id },
              })
            }
          />
        </div>
      )}
    </AdminShell>
  );
}
