import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilterBar,
  SearchInput,
  FilterSelect,
  DateRangeFilter,
  ClearFiltersButton,
  inDateRange,
} from "@/components/admin/list-filters";
import { useAppState } from "@/lib/admin/store";
import {
  getProvider,
  getRequest,
  TASK_STATUS_LABEL,
  type Task,
  type TaskStatus,
} from "@/lib/admin/mock-data";

export const Route = createFileRoute("/administrator/tasks/")({
  head: () => ({ meta: [{ title: "Tasks — Casmara Systems Admin" }] }),
  component: TasksPage,
});

const COLUMNS: TaskStatus[] = ["Todo", "InProgress", "Blocked", "Done"];

function TasksPage() {
  const { tasks, providers } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const hasAdvanced =
    statusFilter !== "all" ||
    providerFilter !== "all" ||
    !!fromDate ||
    !!toDate ||
    !!query;

  const clearAll = () => {
    setQuery("");
    setStatusFilter("all");
    setProviderFilter("all");
    setFromDate("");
    setToDate("");
  };

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const request = getRequest(t.requestId);
      const provider = getProvider(t.providerId);
      const matchesQuery =
        !query ||
        [t.id, t.title, request?.title, request?.city, provider?.company]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesProvider =
        providerFilter === "all" || t.providerId === providerFilter;
      const matchesDate = inDateRange(t.dueDate, fromDate, toDate);
      return matchesQuery && matchesStatus && matchesProvider && matchesDate;
    });
  }, [tasks, query, statusFilter, providerFilter, fromDate, toDate]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      Todo: [],
      InProgress: [],
      Blocked: [],
      Done: [],
    };
    for (const t of filtered) map[t.status].push(t);
    return map;
  }, [filtered]);

  const visibleColumns =
    statusFilter === "all" ? COLUMNS : COLUMNS.filter((c) => c === statusFilter);

  return (
    <AdminShell
      title="Task management"
      description="Track every job assigned to providers. Open a task to update status, notes, and due date."
    >
      <Card className="mb-4 border-border">
        <CardContent className="p-4">
          <FilterBar>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by title, request, provider…"
            />
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All statuses"
              options={COLUMNS.map((s) => ({ value: s, label: TASK_STATUS_LABEL[s] }))}
            />
            <FilterSelect
              value={providerFilter}
              onChange={setProviderFilter}
              allLabel="All providers"
              width="w-[190px]"
              options={providers.map((p) => ({ value: p.id, label: p.company }))}
            />
            <DateRangeFilter
              from={fromDate}
              to={toDate}
              onFrom={setFromDate}
              onTo={setToDate}
            />
            <ClearFiltersButton active={hasAdvanced} onClear={clearAll} />
            <p className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {tasks.length} tasks
            </p>
          </FilterBar>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleColumns.map((col) => (
          <Card key={col} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">
                {TASK_STATUS_LABEL[col]}
              </CardTitle>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {grouped[col].length}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {grouped[col].length === 0 && (
                <p className="rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Nothing here
                </p>
              )}
              {grouped[col].map((t) => {
                const provider = getProvider(t.providerId);
                const request = getRequest(t.requestId);
                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      navigate({ to: "/administrator/tasks/$taskId", params: { taskId: t.id } })
                    }
                    className="w-full space-y-2 rounded-md border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {t.title}
                      </p>
                      <StatusBadge kind="task" value={t.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {request?.title ?? t.requestId} • {request?.city}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {provider?.company ?? "Unassigned"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarClock className="h-3 w-3" />
                        {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
