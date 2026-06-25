import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { Inbox, Users, ListChecks, Wallet, ArrowUpRight, TrendingUp, Clock } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { u as useAppState, f as formatCurrency, g as getProvider, S as StatusBadge } from "./store-B0Ckyr1G.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DkWCRhLz.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-D9UBOVre.js";
import "./input-D1RGD0cW.js";
import "react";
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
function Dashboard() {
  const {
    requests,
    providers,
    tasks,
    payments
  } = useAppState();
  const navigate = useNavigate();
  const openRequests = requests.filter((r) => r.status === "Open" || r.status === "Triaged").length;
  const activeProviders = providers.filter((p) => p.status === "Active").length;
  const pendingOnboarding = providers.filter((p) => p.status === "Pending").length;
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const pendingPayouts = payments.filter((p) => p.status === "Pending" || p.status === "Approved").reduce((sum, p) => sum + p.net, 0);
  const monthGross = payments.reduce((sum, p) => sum + p.amount, 0);
  const recentRequests = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const stats = [{
    label: "Open requests",
    value: openRequests,
    icon: Inbox,
    hint: "Awaiting triage or assignment"
  }, {
    label: "Active providers",
    value: activeProviders,
    icon: Users,
    hint: `${pendingOnboarding} pending onboarding`
  }, {
    label: "Tasks in flight",
    value: openTasks,
    icon: ListChecks,
    hint: `${tasks.length} total tracked`
  }, {
    label: "Pending payouts",
    value: formatCurrency(pendingPayouts),
    icon: Wallet,
    hint: `${formatCurrency(monthGross)} processed this period`
  }];
  return /* @__PURE__ */ jsxs(AdminShell, { title: "Operations dashboard", description: "Live snapshot of marketplace activity across requests, providers, and remuneration.", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/admin/providers", children: "Onboard provider" }) }),
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/admin/requests", children: "Triage requests" }) })
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
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-border lg:col-span-2", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Recent requests" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Latest 5 submissions from tenants & landlords" })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/requests", children: [
            "View all ",
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Request" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Category" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Provider" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: recentRequests.map((r) => {
            const provider = getProvider(r.assignedProviderId);
            return /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer", onClick: () => navigate({
              to: "/admin/requests/$requestId",
              params: {
                requestId: r.id
              }
            }), children: [
              /* @__PURE__ */ jsxs(TableCell, { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: r.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  r.id,
                  " • ",
                  r.requester
                ] })
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: r.category }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { kind: "priority", value: r.priority }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { kind: "request", value: r.status }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: provider ? provider.company : "—" })
            ] }, r.id);
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Provider onboarding queue" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Awaiting verification & approval" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            providers.filter((p) => p.status === "Pending").map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-foreground", children: p.name }),
                /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
                  p.company,
                  " • ",
                  p.specialty
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/admin/providers/$providerId", params: {
                providerId: p.id
              }, children: "Review" }) })
            ] }, p.id)),
            providers.filter((p) => p.status === "Pending").length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "All caught up." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
            "Marketplace health"
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsx(Row, { label: "Avg. response time", value: "48 min", icon: Clock }),
            /* @__PURE__ */ jsx(Row, { label: "On-time completion", value: "92%" }),
            /* @__PURE__ */ jsx(Row, { label: "Avg. provider rating", value: "4.8 / 5" }),
            /* @__PURE__ */ jsx(Row, { label: "Disputed payments", value: "1" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Row({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0", children: [
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [
      Icon && /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: value })
  ] });
}
export {
  Dashboard as component
};
