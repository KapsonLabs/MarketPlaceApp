import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { TrendingUp, Wallet, AlertTriangle, Download } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { u as useAppState, a as getRequest, g as getProvider, f as formatCurrency, S as StatusBadge } from "./store-B0Ckyr1G.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-D9UBOVre.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-qL8K6F2E.js";
import { i as inDateRange, c as inAmountRange, F as FilterBar, S as SearchInput, a as FilterSelect, D as DateRangeFilter, A as AmountRangeFilter, C as ClearFiltersButton } from "./list-filters-CW1H0Bmo.js";
import "./input-D1RGD0cW.js";
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
import "class-variance-authority";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "./select-C__ybL41.js";
import "@radix-ui/react-select";
const STATUSES = ["Pending", "Approved", "Paid", "Disputed"];
function PaymentsPage() {
  const {
    payments,
    providers
  } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
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
  const filtered = useMemo(() => payments.filter((p) => {
    const r = getRequest(p.requestId);
    const sp = getProvider(p.providerId);
    const haystack = [p.id, p.requestId, sp?.company, sp?.name, r?.title].filter(Boolean).join(" ").toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesProvider = providerFilter === "all" || p.providerId === providerFilter;
    const matchesDate = inDateRange(p.invoicedAt, fromDate, toDate);
    const matchesAmount = inAmountRange(p.amount, minAmount, maxAmount);
    return matchesQuery && matchesStatus && matchesProvider && matchesDate && matchesAmount;
  }), [payments, query, statusFilter, providerFilter, fromDate, toDate, minAmount, maxAmount]);
  const totalGross = payments.reduce((s, p) => s + p.amount, 0);
  const totalNet = payments.reduce((s, p) => s + p.net, 0);
  const totalFees = payments.reduce((s, p) => s + p.platformFee, 0);
  const pendingPayouts = payments.filter((p) => p.status === "Pending" || p.status === "Approved").reduce((s, p) => s + p.net, 0);
  const disputed = payments.filter((p) => p.status === "Disputed").length;
  const remuneration = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const p of payments) {
      const entry = map.get(p.providerId) ?? {
        paid: 0,
        pending: 0,
        jobs: 0
      };
      entry.jobs += 1;
      if (p.status === "Paid") entry.paid += p.net;
      else if (p.status !== "Disputed") entry.pending += p.net;
      map.set(p.providerId, entry);
    }
    return Array.from(map.entries()).map(([providerId, v]) => ({
      provider: getProvider(providerId),
      ...v
    })).filter((r) => r.provider).sort((a, b) => b.paid + b.pending - (a.paid + a.pending));
  }, [payments]);
  const stats = [{
    label: "Gross processed",
    value: formatCurrency(totalGross),
    icon: TrendingUp,
    hint: `${payments.length} transactions`
  }, {
    label: "Platform fees",
    value: formatCurrency(totalFees),
    icon: Wallet,
    hint: "10% of gross"
  }, {
    label: "Pending payouts",
    value: formatCurrency(pendingPayouts),
    icon: Wallet,
    hint: "Awaiting release"
  }, {
    label: "Disputed",
    value: String(disputed),
    icon: AlertTriangle,
    hint: "Requires review"
  }];
  return /* @__PURE__ */ jsxs(AdminShell, { title: "Payments & remuneration", description: "Track customer payments, platform fees, and provider payouts. Open a payment to update or release it.", actions: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
    /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
    " Export CSV"
  ] }), children: [
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: s.label }),
          /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-2xl font-bold text-foreground", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: s.hint })
      ] }) }, s.label);
    }) }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "transactions", className: "mt-6", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "transactions", children: "Transactions" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "remuneration", children: "Provider remuneration" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "transactions", children: /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-4 md:p-6", children: [
        /* @__PURE__ */ jsxs(FilterBar, { children: [
          /* @__PURE__ */ jsx(SearchInput, { value: query, onChange: setQuery, placeholder: "Search by ID, provider, request…" }),
          /* @__PURE__ */ jsx(FilterSelect, { value: statusFilter, onChange: setStatusFilter, allLabel: "All statuses", options: STATUSES.map((s) => ({
            value: s,
            label: s
          })) }),
          /* @__PURE__ */ jsx(FilterSelect, { value: providerFilter, onChange: setProviderFilter, allLabel: "All providers", width: "w-[190px]", options: providers.map((p) => ({
            value: p.id,
            label: p.company
          })) }),
          /* @__PURE__ */ jsx(DateRangeFilter, { from: fromDate, to: toDate, onFrom: setFromDate, onTo: setToDate }),
          /* @__PURE__ */ jsx(AmountRangeFilter, { min: minAmount, max: maxAmount, onMin: setMinAmount, onMax: setMaxAmount, minPlaceholder: "Gross min", maxPlaceholder: "Gross max" }),
          /* @__PURE__ */ jsx(ClearFiltersButton, { active: hasAdvanced, onClear: clearAll }),
          /* @__PURE__ */ jsxs("p", { className: "ml-auto text-xs text-muted-foreground", children: [
            "Net to providers: ",
            formatCurrency(totalNet)
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-md border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Payment" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Provider" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Request" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Method" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Gross" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Fee" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Net" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxs(TableBody, { children: [
            filtered.map((p) => {
              const sp = getProvider(p.providerId);
              const r = getRequest(p.requestId);
              return /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer", onClick: () => navigate({
                to: "/admin/payments/$paymentId",
                params: {
                  paymentId: p.id
                }
              }), children: [
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: p.id }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(p.invoicedAt).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-sm", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: sp?.company }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: sp?.name })
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: "text-sm", children: [
                  /* @__PURE__ */ jsx("p", { children: r?.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: p.requestId })
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: p.method }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm", children: formatCurrency(p.amount) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm text-muted-foreground", children: formatCurrency(p.platformFee) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm font-medium", children: formatCurrency(p.net) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { kind: "payment", value: p.status }) })
              ] }, p.id);
            }),
            filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "py-10 text-center text-muted-foreground", children: "No payments match your filters." }) })
          ] })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "remuneration", children: /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4 md:p-6", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-md border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Provider" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Specialty" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Jobs invoiced" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Paid out" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Pending payout" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: remuneration.map((row) => /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer", onClick: () => navigate({
          to: "/admin/providers/$providerId",
          params: {
            providerId: row.provider.id
          }
        }), children: [
          /* @__PURE__ */ jsxs(TableCell, { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: row.provider.company }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: row.provider.name })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: row.provider.specialty }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm", children: row.jobs }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm font-medium text-success", children: formatCurrency(row.paid) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right text-sm", children: formatCurrency(row.pending) })
        ] }, row.provider.id)) })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  PaymentsPage as component
};
