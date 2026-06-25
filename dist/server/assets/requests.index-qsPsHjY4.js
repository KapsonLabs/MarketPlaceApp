import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText, FileText, ArrowRight, Loader2, CheckCircle2, Plus, ChevronRight, Clock3, MapPin } from "lucide-react";
import { u as useCurrentUser, S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { i as isTerminalStatus, r as requestBalance, f as formatMoney, a as requestTotal, R as RequestProgress } from "./request-progress-AGaJIlfr.js";
import { l as listAllMyServiceRequests } from "./service-requests.api-K3cgLLXa.js";
import { S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import { B as Button, c as cn } from "./button-BmLZMIt9.js";
import "./notifications.ws-DJ822Bff.js";
import "react";
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
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
function RequestsPage() {
  const user = useCurrentUser();
  const {
    data: requests = [],
    isLoading
  } = useQuery({
    queryKey: ["marketplace", "my-service-requests"],
    queryFn: listAllMyServiceRequests,
    enabled: !!user
  });
  const activeCount = requests.filter((r) => !isTerminalStatus(r.status) && r.status !== "completed").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const outstandingBalance = requests.reduce((sum, r) => sum + requestBalance(r), 0);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4 py-6 sm:py-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl", children: "My requests" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground sm:text-base", children: "Track jobs from submission through completion." })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "shrink-0", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/billing", children: [
            /* @__PURE__ */ jsx(ReceiptText, { className: "h-4 w-4 sm:mr-1.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Billing" })
          ] }) })
        ] }),
        user && !isLoading && requests.length > 0 && /* @__PURE__ */ jsxs("dl", { className: "mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-border bg-background", children: [
          /* @__PURE__ */ jsx(StatCell, { label: "Active", value: activeCount.toString() }),
          /* @__PURE__ */ jsx(StatCell, { label: "Done", value: completedCount.toString(), bordered: true }),
          /* @__PURE__ */ jsx(StatCell, { label: "Due", value: formatMoney(outstandingBalance, true), bordered: true })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-3xl px-4 py-6 sm:py-8", children: !user ? /* @__PURE__ */ jsx(GuestState, {}) : isLoading ? /* @__PURE__ */ jsx(LoadingState, {}) : requests.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: requests.map((request) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(RequestRow, { request }) }, request.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function StatCell({
  label,
  value,
  bordered = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("px-3 py-3 text-center sm:px-4", bordered && "border-l border-border"), children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-0.5 truncate text-base font-semibold tabular-nums text-foreground sm:text-lg", children: value })
  ] });
}
function RequestRow({
  request
}) {
  const balance = requestBalance(request);
  const total = requestTotal(request);
  const location = [request.city, request.district].filter(Boolean).join(", ");
  const isTerminal = isTerminalStatus(request.status);
  return /* @__PURE__ */ jsxs(Link, { to: "/marketplace/requests/$requestId", params: {
    requestId: request.id
  }, className: "group block py-5 transition-colors hover:bg-muted/20 sm:-mx-2 sm:rounded-lg sm:px-2 sm:py-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold leading-snug text-foreground group-hover:text-primary sm:text-lg", children: request.title }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsx(StatusBadge, { value: request.status }),
          request.payment_status !== "unpaid" && /* @__PURE__ */ jsx(StatusBadge, { value: request.payment_status })
        ] })
      ] }),
      !isTerminal && balance > 0 && /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "Due" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold tabular-nums text-foreground sm:text-base", children: formatMoney(balance) })
      ] }),
      request.payment_status === "paid" && /* @__PURE__ */ jsx("div", { className: "shrink-0 text-right", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-success", children: "Paid" }) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-2 text-sm text-muted-foreground", children: request.description }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 sm:text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Clock3, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: formatRelativeDate(request.updated_at) })
      ] }),
      location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: location })
      ] }),
      total > 0 && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Estimate " }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: formatMoney(total) })
      ] })
    ] }),
    !isTerminal && request.status !== "completed" && /* @__PURE__ */ jsx("div", { className: "pointer-events-none mt-4", children: /* @__PURE__ */ jsx(RequestProgress, { status: request.status }) })
  ] });
}
function formatRelativeDate(iso) {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) {
    return `Updated today, ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    })}`;
  }
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${date.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric"
  })}`;
}
function GuestState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center px-2 py-12 text-center sm:py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6 text-primary" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-lg font-semibold text-foreground", children: "Sign in to track your requests" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: "Your service history, progress and billing live here once you're signed in." }),
    /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/sign-in", search: {
      redirect: "/marketplace/requests"
    }, children: [
      "Sign in ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
    ] }) })
  ] });
}
function LoadingState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading your requests..."
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center px-2 py-12 text-center sm:py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6 text-primary" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-lg font-semibold text-foreground", children: "No requests yet" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: "Submit a facility service request and it will appear here with live status updates." }),
    /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request", children: [
      /* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }),
      "Request service"
    ] }) })
  ] });
}
export {
  RequestsPage as component
};
