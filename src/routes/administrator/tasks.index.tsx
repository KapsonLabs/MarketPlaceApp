import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { PaginatedDataTable } from "@/components/admin/paginated-data-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilterBar,
  SearchInput,
  FilterSelect,
  ClearFiltersButton,
} from "@/components/admin/list-filters";
import { useAdminSession } from "@/lib/admin-auth";
import {
  listAdminWorkOrders,
  listMyWorkOrders,
  WORK_ORDER_STATUS_OPTIONS,
  WORK_ORDER_STATUS_LABEL,
  type WorkOrder,
} from "@/lib/api/work-orders.api";

export const Route = createFileRoute("/administrator/tasks/")({
  head: () => ({ meta: [{ title: "Work Orders — Casmara Systems Admin" }] }),
  component: WorkOrdersPage,
});

const columns: ColumnDef<WorkOrder, unknown>[] = [
  {
    id: "service_request",
    header: "Work order",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">
          {row.original.service_request.title}
        </p>
        <p className="text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <StatusBadge
          kind="work-order"
          value={status}
          label={WORK_ORDER_STATUS_LABEL[status] ?? status}
        />
      );
    },
  },
  {
    id: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.provider.name}
      </span>
    ),
  },
  {
    accessorKey: "actual_start",
    header: "Started",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          {new Date(value).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-muted-foreground/50">—</span>
      );
    },
  },
];

function WorkOrdersPage() {
  const navigate = useNavigate();
  const session = useAdminSession();
  const isAdmin = session?.user.role.slug === "admin";

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const hasAdvanced = statusFilter !== "all" || !!query;

  function clearAll() {
    setQuery("");
    setStatusFilter("all");
    setPage(1);
  }

  const statusParam = statusFilter !== "all" ? statusFilter : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["work-orders", isAdmin ? "admin" : "my", page, statusFilter],
    queryFn: () =>
      isAdmin
        ? listAdminWorkOrders(page, { status: statusParam })
        : listMyWorkOrders(page, { status: statusParam }),
    placeholderData: (prev) => prev,
    enabled: !!session,
  });

  const rows = useMemo(() => {
    const results = data?.results ?? [];
    if (!query) return results;
    const q = query.toLowerCase();
    return results.filter((wo) =>
      [wo.id, wo.service_request.title, wo.provider.name, wo.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [data, query]);

  return (
    <AdminShell
      title="Work order management"
      description="Track every job assigned to providers. Open a work order to update status, notes, and due date."
    >
      <Card className="mb-4 border-border">
        <CardContent className="p-4">
          <FilterBar>
            <SearchInput
              value={query}
              onChange={(v) => { setQuery(v); setPage(1); }}
              placeholder="Search by title, provider, ID…"
            />
            <FilterSelect
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              allLabel="All statuses"
              options={WORK_ORDER_STATUS_OPTIONS}
            />
            <ClearFiltersButton active={hasAdvanced} onClear={clearAll} />
            <p className="ml-auto text-xs text-muted-foreground">
              {data?.count ?? 0} work orders
            </p>
          </FilterBar>
        </CardContent>
      </Card>

      <PaginatedDataTable
        columns={columns}
        data={rows}
        totalCount={data?.count ?? 0}
        page={page}
        hasPrev={!!data?.previous}
        hasNext={!!data?.next}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No work orders match the current filters."
        onRowClick={(wo) =>
          navigate({ to: "/administrator/tasks/$taskId", params: { taskId: wo.id } })
        }
      />
    </AdminShell>
  );
}
