import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { D as DataTable } from "./data-table-BdEmie2k.js";
import { f as formatStatusLabel, S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import { i as inDateRange, b as CompactFilterBar, S as SearchInput, a as FilterSelect, D as DateRangeFilter, A as AmountRangeFilter, C as ClearFiltersButton, c as inAmountRange } from "./list-filters-CW1H0Bmo.js";
import { a as listServiceCategories } from "./service-categories.api-RHGMOrkk.js";
import { l as listAllProviders } from "./providers.api-B4SzXqi_.js";
import { a as listAllAdminServiceRequests } from "./service-requests.api-K3cgLLXa.js";
import "./input-D1RGD0cW.js";
import "./button-BmLZMIt9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
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
import "@tanstack/react-table";
import "./table-D9UBOVre.js";
import "./badge-BAnpIKa2.js";
import "./select-C__ybL41.js";
import "@radix-ui/react-select";
function formatMoney(value) {
  if (!value) return "-";
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return value;
  return `USh ${amount.toLocaleString()}`;
}
function displayName(name, fallback) {
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
    queryFn: listAllAdminServiceRequests
  });
  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: listAllProviders
  });
  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories
  });
  const requests = requestsQuery.data ?? [];
  const providers = providersQuery.data ?? [];
  const categories = categoriesQuery.data?.results ?? [];
  const providerNames = useMemo(() => new Map(providers.map((p) => [p.id, p.business_name])), [providers]);
  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const statusOptions = useMemo(() => Array.from(new Set(requests.map((r) => r.status))).sort().map((s) => ({
    value: s,
    label: formatStatusLabel(s)
  })), [requests]);
  const hasAdvanced = statusFilter !== "all" || providerFilter !== "all" || !!fromDate || !!toDate || !!minAmount || !!maxAmount || !!query;
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
      const providerName = r.assigned_provider ? providerNames.get(r.assigned_provider) : "";
      const categoryName = categoryNames.get(r.service_category) ?? r.service_category;
      const matchesQuery = !query || [r.id, r.title, r.requester_name, r.contact_email, r.city, categoryName, providerName].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesProvider = providerFilter === "all" || (providerFilter === "unassigned" ? !r.assigned_provider : r.assigned_provider === providerFilter);
      const matchesDate = inDateRange(r.created_at, fromDate, toDate);
      const cost = r.estimated_cost ? Number.parseFloat(r.estimated_cost) : void 0;
      const matchesAmount = inAmountRange(cost, minAmount, maxAmount);
      return matchesQuery && matchesStatus && matchesProvider && matchesDate && matchesAmount;
    });
  }, [requests, query, statusFilter, providerFilter, fromDate, toDate, minAmount, maxAmount, providerNames, categoryNames]);
  const columns = useMemo(() => [{
    accessorKey: "title",
    header: "Request",
    cell: ({
      row
    }) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: row.original.title }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        row.original.id.slice(0, 8),
        "..."
      ] })
    ] })
  }, {
    id: "requester",
    header: "Requester",
    cell: ({
      row
    }) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: displayName(row.original.requester_name, "Unknown requester") }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: row.original.city || "-" })
    ] })
  }, {
    id: "category",
    header: "Category",
    cell: ({
      row
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: categoryNames.get(row.original.service_category) ?? row.original.service_category.slice(0, 8) })
  }, {
    accessorKey: "priority",
    header: "Priority",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx(StatusBadge, { value: String(getValue()) })
  }, {
    accessorKey: "status",
    header: "Status",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx(StatusBadge, { value: String(getValue()) })
  }, {
    id: "provider",
    header: "Provider",
    cell: ({
      row
    }) => {
      const name = row.original.assigned_provider ? providerNames.get(row.original.assigned_provider) : null;
      return /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: name ?? "Unassigned" });
    }
  }, {
    accessorKey: "estimated_cost",
    header: "Estimate",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: formatMoney(getValue()) }),
    meta: {
      align: "right"
    }
  }], [categoryNames, providerNames]);
  const isLoading = requestsQuery.isPending || providersQuery.isPending || categoriesQuery.isPending;
  const loadError = requestsQuery.error ?? providersQuery.error ?? categoriesQuery.error;
  return /* @__PURE__ */ jsx(AdminShell, { title: "User requests", description: "Triage incoming service requests, review assignments, and track payment status.", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading requests..."
  ] }) : loadError ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
    loadError.uiMessage ?? loadError.message ?? "Failed to load requests."
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(CompactFilterBar, { summary: `${filtered.length} of ${requests.length}`, children: [
      /* @__PURE__ */ jsx(SearchInput, { compact: true, value: query, onChange: setQuery, placeholder: "Search by ID, title, requester..." }),
      /* @__PURE__ */ jsx(FilterSelect, { compact: true, value: statusFilter, onChange: setStatusFilter, allLabel: "All statuses", options: statusOptions }),
      /* @__PURE__ */ jsx(FilterSelect, { compact: true, value: providerFilter, onChange: setProviderFilter, allLabel: "All providers", width: "w-[170px]", options: [{
        value: "unassigned",
        label: "Unassigned"
      }, ...providers.map((p) => ({
        value: p.id,
        label: p.business_name
      }))] }),
      /* @__PURE__ */ jsx(DateRangeFilter, { compact: true, from: fromDate, to: toDate, onFrom: setFromDate, onTo: setToDate }),
      /* @__PURE__ */ jsx(AmountRangeFilter, { compact: true, min: minAmount, max: maxAmount, onMin: setMinAmount, onMax: setMaxAmount, minPlaceholder: "Cost min", maxPlaceholder: "Cost max" }),
      /* @__PURE__ */ jsx(ClearFiltersButton, { compact: true, active: hasAdvanced, onClear: clearAll })
    ] }),
    /* @__PURE__ */ jsx(DataTable, { columns, data: filtered, emptyMessage: "No requests match your filters.", onRowClick: (request) => navigate({
      to: "/admin/requests/$requestId",
      params: {
        requestId: request.id
      }
    }) })
  ] }) });
}
export {
  RequestsPage as component
};
