import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Star, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { a as Avatar, b as AvatarFallback, A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { D as DataTable } from "./data-table-BdEmie2k.js";
import { S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { i as inDateRange, b as CompactFilterBar, S as SearchInput, a as FilterSelect, D as DateRangeFilter, C as ClearFiltersButton } from "./list-filters-CW1H0Bmo.js";
import { l as listAllProviders } from "./providers.api-B4SzXqi_.js";
import "./input-D1RGD0cW.js";
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
import "class-variance-authority";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "./select-C__ybL41.js";
import "@radix-ui/react-select";
const APPROVAL_STATUSES = ["pending", "approved", "rejected"];
function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}
function formatRating(rating) {
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
    queryFn: listAllProviders
  });
  const providers = providersQuery.data ?? [];
  const providerTypes = useMemo(() => Array.from(new Set(providers.map((p) => p.provider_type))).sort(), [providers]);
  const hasAdvanced = approvalFilter !== "all" || typeFilter !== "all" || !!fromDate || !!toDate || !!query;
  const clearAll = () => {
    setQuery("");
    setApprovalFilter("all");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
  };
  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesQuery = !query || [p.id, p.business_name, p.city, p.district, p.provider_type].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesApproval = approvalFilter === "all" || p.approval_status === approvalFilter;
      const matchesType = typeFilter === "all" || p.provider_type === typeFilter;
      const matchesDate = inDateRange(p.created_at, fromDate, toDate);
      return matchesQuery && matchesApproval && matchesType && matchesDate;
    });
  }, [providers, query, approvalFilter, typeFilter, fromDate, toDate]);
  const columns = useMemo(() => [{
    accessorKey: "business_name",
    header: "Provider",
    cell: ({
      row
    }) => {
      const provider = row.original;
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs", children: initials(provider.business_name) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-sm font-medium text-foreground", children: [
            provider.business_name,
            provider.verification_status === "verified" && /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            provider.id.slice(0, 8),
            "..."
          ] })
        ] })
      ] });
    }
  }, {
    accessorKey: "provider_type",
    header: "Type",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", children: String(getValue()) })
  }, {
    accessorKey: "city",
    header: "City",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: String(getValue() || "-") })
  }, {
    accessorKey: "approval_status",
    header: "Approval",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx(StatusBadge, { value: String(getValue()) })
  }, {
    accessorKey: "verification_status",
    header: "Verification",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx(StatusBadge, { value: String(getValue()) })
  }, {
    accessorKey: "average_rating",
    header: "Rating",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-end gap-1 text-sm", children: [
      /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-warning text-warning" }),
      formatRating(String(getValue()))
    ] }),
    meta: {
      align: "right"
    }
  }, {
    accessorKey: "jobs_completed",
    header: "Jobs",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: String(getValue()) }),
    meta: {
      align: "right"
    }
  }], []);
  const pending = providers.filter((p) => p.approval_status === "pending");
  return /* @__PURE__ */ jsx(AdminShell, { title: "Service providers", description: "Approve onboarding applications and manage active providers. Open a provider to review and act.", children: providersQuery.isPending ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading providers..."
  ] }) : providersQuery.isError ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
    providersQuery.error.uiMessage ?? providersQuery.error.message ?? "Failed to load providers."
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    pending.length > 0 && /* @__PURE__ */ jsx(Card, { className: "border-warning/40 bg-warning/5", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "mt-0.5 h-5 w-5 text-warning-foreground" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            pending.length,
            " provider",
            pending.length === 1 ? "" : "s",
            " awaiting review"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Open each application to verify credentials and approve." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: pending.map((p) => /* @__PURE__ */ jsx(PendingCard, { provider: p }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs(CompactFilterBar, { summary: `${filtered.length} of ${providers.length}`, children: [
      /* @__PURE__ */ jsx(SearchInput, { compact: true, value: query, onChange: setQuery, placeholder: "Search providers..." }),
      /* @__PURE__ */ jsx(FilterSelect, { compact: true, value: approvalFilter, onChange: setApprovalFilter, allLabel: "All approvals", options: APPROVAL_STATUSES.map((s) => ({
        value: s,
        label: s
      })) }),
      /* @__PURE__ */ jsx(FilterSelect, { compact: true, value: typeFilter, onChange: setTypeFilter, allLabel: "All types", width: "w-[140px]", options: providerTypes.map((t) => ({
        value: t,
        label: t
      })) }),
      /* @__PURE__ */ jsx(DateRangeFilter, { compact: true, from: fromDate, to: toDate, onFrom: setFromDate, onTo: setToDate }),
      /* @__PURE__ */ jsx(ClearFiltersButton, { compact: true, active: hasAdvanced, onClear: clearAll })
    ] }),
    /* @__PURE__ */ jsx(DataTable, { columns, data: filtered, emptyMessage: "No providers match your filters.", onRowClick: (provider) => navigate({
      to: "/admin/providers/$providerId",
      params: {
        providerId: provider.id
      }
    }) })
  ] }) });
}
function PendingCard({
  provider
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
      /* @__PURE__ */ jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs", children: initials(provider.business_name) }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium", children: provider.business_name }),
        /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
          provider.provider_type,
          " • ",
          provider.city || "No city"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/admin/providers/$providerId", params: {
      providerId: provider.id
    }, children: "Review" }) })
  ] });
}
export {
  ProvidersPage as component
};
