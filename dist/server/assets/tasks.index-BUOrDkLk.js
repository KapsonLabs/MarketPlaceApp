import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalendarClock } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { u as useAppState, a as getRequest, g as getProvider, T as TASK_STATUS_LABEL, S as StatusBadge } from "./store-B0Ckyr1G.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DkWCRhLz.js";
import { i as inDateRange, F as FilterBar, S as SearchInput, a as FilterSelect, D as DateRangeFilter, C as ClearFiltersButton } from "./list-filters-CW1H0Bmo.js";
import "./input-D1RGD0cW.js";
import "./button-BmLZMIt9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "./router-rAJgq2Yd.js";
import "axios";
import "zod";
import "./server-ChUyfcIq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./request-types-C9A69B28.js";
import "./badge-BAnpIKa2.js";
import "sonner";
import "./select-C__ybL41.js";
import "@radix-ui/react-select";
const COLUMNS = ["Todo", "InProgress", "Blocked", "Done"];
function TasksPage() {
  const {
    tasks,
    providers
  } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const hasAdvanced = statusFilter !== "all" || providerFilter !== "all" || !!fromDate || !!toDate || !!query;
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
      const matchesQuery = !query || [t.id, t.title, request?.title, request?.city, provider?.company].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesProvider = providerFilter === "all" || t.providerId === providerFilter;
      const matchesDate = inDateRange(t.dueDate, fromDate, toDate);
      return matchesQuery && matchesStatus && matchesProvider && matchesDate;
    });
  }, [tasks, query, statusFilter, providerFilter, fromDate, toDate]);
  const grouped = useMemo(() => {
    const map = {
      Todo: [],
      InProgress: [],
      Blocked: [],
      Done: []
    };
    for (const t of filtered) map[t.status].push(t);
    return map;
  }, [filtered]);
  const visibleColumns = statusFilter === "all" ? COLUMNS : COLUMNS.filter((c) => c === statusFilter);
  return /* @__PURE__ */ jsxs(AdminShell, { title: "Task management", description: "Track every job assigned to providers. Open a task to update status, notes, and due date.", children: [
    /* @__PURE__ */ jsx(Card, { className: "mb-4 border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs(FilterBar, { children: [
      /* @__PURE__ */ jsx(SearchInput, { value: query, onChange: setQuery, placeholder: "Search by title, request, provider…" }),
      /* @__PURE__ */ jsx(FilterSelect, { value: statusFilter, onChange: setStatusFilter, allLabel: "All statuses", options: COLUMNS.map((s) => ({
        value: s,
        label: TASK_STATUS_LABEL[s]
      })) }),
      /* @__PURE__ */ jsx(FilterSelect, { value: providerFilter, onChange: setProviderFilter, allLabel: "All providers", width: "w-[190px]", options: providers.map((p) => ({
        value: p.id,
        label: p.company
      })) }),
      /* @__PURE__ */ jsx(DateRangeFilter, { from: fromDate, to: toDate, onFrom: setFromDate, onTo: setToDate }),
      /* @__PURE__ */ jsx(ClearFiltersButton, { active: hasAdvanced, onClear: clearAll }),
      /* @__PURE__ */ jsxs("p", { className: "ml-auto text-xs text-muted-foreground", children: [
        filtered.length,
        " of ",
        tasks.length,
        " tasks"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: visibleColumns.map((col) => /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-semibold", children: TASK_STATUS_LABEL[col] }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground", children: grouped[col].length })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        grouped[col].length === 0 && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground", children: "Nothing here" }),
        grouped[col].map((t) => {
          const provider = getProvider(t.providerId);
          const request = getRequest(t.requestId);
          return /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/admin/tasks/$taskId",
            params: {
              taskId: t.id
            }
          }), className: "w-full space-y-2 rounded-md border border-border bg-card p-3 text-left shadow-sm transition-colors hover:bg-accent/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-snug text-foreground", children: t.title }),
              /* @__PURE__ */ jsx(StatusBadge, { kind: "task", value: t.status })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              request?.title ?? t.requestId,
              " • ",
              request?.city
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: provider?.company ?? "Unassigned" }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CalendarClock, { className: "h-3 w-3" }),
                new Date(t.dueDate).toLocaleDateString()
              ] })
            ] })
          ] }, t.id);
        })
      ] })
    ] }, col)) })
  ] });
}
export {
  TasksPage as component
};
