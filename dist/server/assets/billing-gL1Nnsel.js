import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, startTransition } from "react";
import { ArrowRight, ReceiptText, Wallet, CreditCard, Loader2 } from "lucide-react";
import { u as useCurrentUser, S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { e as listUserBilling, r as recordPayment } from "./router-rAJgq2Yd.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Badge } from "./badge-BAnpIKa2.js";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
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
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const billingTone = {
  Estimate: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  PartiallyPaid: "bg-primary/10 text-primary border-primary/30",
  Paid: "bg-success/15 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border"
};
function BillingPage() {
  const user = useCurrentUser();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(null);
  function reload() {
    if (!user) return;
    startTransition(() => {
      listUserBilling({
        data: {
          userId: user.id
        }
      }).then((result) => setInvoices(result.invoices));
    });
  }
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    startTransition(() => {
      listUserBilling({
        data: {
          userId: user.id
        }
      }).then((result) => setInvoices(result.invoices)).finally(() => setLoading(false));
    });
  }, [user]);
  async function handlePay(invoice) {
    const assessmentDue = Math.max(invoice.assessmentFee - invoice.paidAmount, 0);
    const isAssessmentPayment = assessmentDue > 0;
    const amount = isAssessmentPayment ? assessmentDue : invoice.balance;
    const type = isAssessmentPayment ? "deposit" : "final";
    setPaying(invoice.id);
    try {
      await recordPayment({
        data: {
          requestId: invoice.requestId,
          amount,
          type
        }
      });
      reload();
    } finally {
      setPaying(null);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl px-4 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground", children: "Billing" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Review service estimates, balances due and completed payments for your jobs." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/requests", children: [
          "My requests ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] }),
      !user ? /* @__PURE__ */ jsx(GuestState, {}) : loading ? /* @__PURE__ */ jsx(LoadingState, {}) : invoices.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsx(SummaryCard, { icon: ReceiptText, label: "Open balance", value: `USh ${invoices.reduce((sum, invoice) => sum + invoice.balance, 0).toLocaleString()}` }),
          /* @__PURE__ */ jsx(SummaryCard, { icon: Wallet, label: "Paid so far", value: `USh ${invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0).toLocaleString()}` }),
          /* @__PURE__ */ jsx(SummaryCard, { icon: CreditCard, label: "Invoices", value: invoices.length.toString() })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-4", children: invoices.map((invoice) => /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground", children: invoice.title }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: billingTone[invoice.status], children: invoice.status })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-mono text-muted-foreground", children: invoice.id }),
              /* @__PURE__ */ jsxs(Link, { to: "/marketplace/requests", className: "mt-1 inline-block text-xs font-medium text-primary hover:underline", children: [
                "View request ",
                invoice.requestId,
                " →"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                "Issued ",
                new Date(invoice.issuedAt).toLocaleDateString(),
                " • Due",
                " ",
                new Date(invoice.dueAt).toLocaleDateString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Outstanding" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-2xl font-semibold text-foreground", children: [
                "USh ",
                invoice.balance.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                "Paid: USh ",
                invoice.paidAmount.toLocaleString(),
                " of USh",
                " ",
                invoice.total.toLocaleString()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-3 md:grid-cols-2", children: invoice.lineItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item.label }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
              "USh ",
              item.amount.toLocaleString()
            ] })
          ] }, item.label)) }),
          (invoice.status === "Pending" || invoice.status === "PartiallyPaid") && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: invoice.paidAmount < invoice.assessmentFee ? "Pay assessment fee to dispatch an assessor" : "Pay remaining balance to close job" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
                "Amount due: USh ",
                invoice.balance.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { size: "sm", disabled: paying === invoice.id, onClick: () => handlePay(invoice), children: paying === invoice.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-3.5 w-3.5 animate-spin" }),
              "Processing…"
            ] }) : invoice.paidAmount < invoice.assessmentFee ? "Pay assessment fee" : "Pay in full" })
          ] })
        ] }) }, invoice.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function SummaryCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-foreground", children: value })
  ] }) });
}
function GuestState() {
  return /* @__PURE__ */ jsx(Card, { className: "mt-8 border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-start gap-4 p-8", children: [
    /* @__PURE__ */ jsx(ReceiptText, { className: "h-6 w-6 text-primary" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Sign in to view billing" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Your estimates, invoices and outstanding balances are saved to your marketplace account." })
    ] }),
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/sign-in", search: {
      redirect: "/marketplace/billing"
    }, children: "Sign in" }) })
  ] }) });
}
function LoadingState() {
  return /* @__PURE__ */ jsx(Card, { className: "mt-8 border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading your billing records..."
  ] }) });
}
function EmptyState() {
  return /* @__PURE__ */ jsx(Card, { className: "mt-8 border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-start gap-4 p-8", children: [
    /* @__PURE__ */ jsx(Wallet, { className: "h-6 w-6 text-primary" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "No billing records yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Billing items appear here once you submit a request and it enters the service workflow." })
    ] }),
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/request", children: "Request service" }) })
  ] }) });
}
export {
  BillingPage as component
};
