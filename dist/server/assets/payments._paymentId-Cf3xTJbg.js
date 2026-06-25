import { jsx, jsxs } from "react/jsx-runtime";
import { notFound, Link } from "@tanstack/react-router";
import { CreditCard, Receipt, Wallet, ArrowLeft } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { u as useAppState, g as getProvider, a as getRequest, S as StatusBadge, f as formatCurrency, s as setPaymentStatus, r as releasePayout } from "./store-B0Ckyr1G.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-DkWCRhLz.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
import { y as Route } from "./router-rAJgq2Yd.js";
import "./input-D1RGD0cW.js";
import "react";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "./badge-BAnpIKa2.js";
import "class-variance-authority";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
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
const STATUSES = ["Pending", "Approved", "Paid", "Disputed"];
function PaymentDetailPage() {
  const {
    paymentId
  } = Route.useParams();
  const {
    payments
  } = useAppState();
  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) throw notFound();
  const provider = getProvider(payment.providerId);
  const request = getRequest(payment.requestId);
  const releasable = payment.status === "Pending" || payment.status === "Approved";
  return /* @__PURE__ */ jsx(AdminShell, { title: `Payment ${payment.id}`, description: `Invoiced ${new Date(payment.invoicedAt).toLocaleString()}${payment.paidAt ? ` • paid ${new Date(payment.paidAt).toLocaleDateString()}` : ""}`, actions: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/payments", children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
    " All payments"
  ] }) }), children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(StatusBadge, { kind: "payment", value: payment.status }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "h-3.5 w-3.5" }),
            " ",
            payment.method
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsx(Amount, { icon: Receipt, label: "Gross", value: formatCurrency(payment.amount) }),
          /* @__PURE__ */ jsx(Amount, { icon: Wallet, label: "Platform fee", value: formatCurrency(payment.platformFee), muted: true }),
          /* @__PURE__ */ jsx(Amount, { icon: Wallet, label: "Net to provider", value: formatCurrency(payment.net), accent: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Linked records" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          request && /* @__PURE__ */ jsxs(Link, { to: "/admin/requests/$requestId", params: {
            requestId: request.id
          }, className: "block rounded-md border border-border p-3 transition-colors hover:bg-accent/50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Request" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: request.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: request.id })
          ] }),
          provider && /* @__PURE__ */ jsxs(Link, { to: "/admin/providers/$providerId", params: {
            providerId: provider.id
          }, className: "block rounded-md border border-border p-3 transition-colors hover:bg-accent/50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Provider" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: provider.company }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: provider.name })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Status" }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Select, { value: payment.status, onValueChange: (v) => setPaymentStatus(payment.id, v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "w-full", disabled: !releasable, onClick: () => releasePayout(payment.id), children: [
          /* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }),
          payment.status === "Paid" ? "Payout released" : "Release payout"
        ] }),
        payment.status === "Disputed" && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "This payment is disputed. Resolve before releasing." })
      ] })
    ] }) })
  ] }) });
}
function Amount({
  icon: Icon,
  label,
  value,
  muted,
  accent
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border p-4", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: accent ? "mt-1 text-xl font-bold text-success" : muted ? "mt-1 text-xl font-bold text-muted-foreground" : "mt-1 text-xl font-bold text-foreground", children: value })
  ] });
}
export {
  PaymentDetailPage as component
};
