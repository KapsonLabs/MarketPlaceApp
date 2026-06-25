import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft, CalendarDays, ReceiptText, AlertCircle, ImagePlus, MapPin, User } from "lucide-react";
import { u as useCurrentUser, S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { p as prettify, r as requestBalance, a as requestTotal, f as formatMoney, b as formatDate, R as RequestProgress, c as formatTime } from "./request-progress-AGaJIlfr.js";
import { S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import { B as Button, c as cn } from "./button-BmLZMIt9.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BhK3eTVt.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { l as listAllServiceCategories } from "./service-categories.api-RHGMOrkk.js";
import { g as getMyServiceRequest, m as makeServiceRequestPayment } from "./service-requests.api-K3cgLLXa.js";
import { h as Route } from "./router-rAJgq2Yd.js";
import "./notifications.ws-DJ822Bff.js";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "./badge-BAnpIKa2.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
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
function RequestDetailPage() {
  const {
    requestId
  } = Route.useParams();
  const user = useCurrentUser();
  const {
    data: request,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["marketplace", "service-request", requestId],
    queryFn: () => getMyServiceRequest(requestId),
    enabled: !!user
  });
  const {
    data: categories = []
  } = useQuery({
    queryKey: ["service-categories"],
    queryFn: listAllServiceCategories,
    enabled: !!user
  });
  const categoryName = request ? categories.find((c) => c.id === request.service_category)?.name ?? prettify(request.service_category) : "";
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: !user ? /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsx(GuestState, {}) }) : isLoading ? /* @__PURE__ */ jsx(LoadingState, {}) : isError || !request ? /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsx(NotFoundState, {}) }) : /* @__PURE__ */ jsx(RequestDetail, { request, categoryName }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function RequestDetail({
  request,
  categoryName
}) {
  const queryClient = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const payMutation = useMutation({
    mutationFn: (amount) => makeServiceRequestPayment(request.id, amount),
    onSuccess: () => {
      setPayOpen(false);
      setPayAmount("");
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "service-request", request.id]
      });
    }
  });
  const balance = requestBalance(request);
  requestTotal(request);
  const location = [request.formatted_address, request.city, request.district].filter(Boolean).join(", ");
  const heroImage = request.images[0];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4 py-5 sm:py-6", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2 mb-4 h-8 px-2", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/requests", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1.5 h-4 w-4" }),
        "My requests"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: categoryName }),
          /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl", children: request.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsx(StatusBadge, { value: request.status }),
            /* @__PURE__ */ jsx(StatusBadge, { value: request.priority }),
            request.payment_status !== "unpaid" && /* @__PURE__ */ jsx(StatusBadge, { value: request.payment_status })
          ] })
        ] }),
        balance > 0 && /* @__PURE__ */ jsxs("div", { className: "shrink-0 rounded-lg border border-border bg-background px-4 py-3 text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Balance due" }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xl font-bold tabular-nums text-foreground", children: formatMoney(balance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("dl", { className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsx(MetaChip, { label: "Submitted", value: formatDate(request.created_at) }),
        /* @__PURE__ */ jsx(MetaChip, { label: "Updated", value: formatDate(request.updated_at) }),
        /* @__PURE__ */ jsx(MetaChip, { label: "Budget", value: request.estimated_budget ? formatMoney(request.estimated_budget) : "—" }),
        /* @__PURE__ */ jsx(MetaChip, { label: "Assignment", value: prettify(request.assignment_type) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4 py-6 sm:py-8", children: [
      /* @__PURE__ */ jsx("section", { className: "mb-8", children: /* @__PURE__ */ jsx(RequestProgress, { status: request.status }) }),
      request.description && /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx(SectionLabel, { children: "About this job" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-foreground/90", children: request.description })
      ] }),
      request.assignments.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx(SectionLabel, { children: "Provider assignments" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-3 divide-y divide-border rounded-xl border border-border", children: request.assignments.map((a) => /* @__PURE__ */ jsxs("li", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx(StatusBadge, { value: a.acceptance_status }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: new Date(a.assignment_date).toLocaleString() })
          ] }),
          a.assignment_reason && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: a.assignment_reason })
        ] }, a.id)) })
      ] }),
      request.payments.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsx(SectionLabel, { children: "Payment history" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-3 divide-y divide-border rounded-xl border border-border", children: request.payments.map((p) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: prettify(p.payment_type) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(p.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold tabular-nums", children: formatMoney(p.amount) })
        ] }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs(InfoBlock, { title: "Preferred slot", icon: CalendarDays, children: [
          /* @__PURE__ */ jsx(InfoLine, { label: "Date", value: formatDate(request.preferred_date) }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Time", value: formatTime(request.preferred_time) })
        ] }),
        /* @__PURE__ */ jsxs(InfoBlock, { title: "Payment", icon: ReceiptText, children: [
          /* @__PURE__ */ jsx(InfoLine, { label: "Estimated cost", value: request.estimated_cost ? formatMoney(request.estimated_cost) : "Pending" }),
          request.estimated_cost && !request.is_deposit_paid && request.deposit_required != null && /* @__PURE__ */ jsx(InfoLine, { label: "Deposit required", value: formatMoney(request.deposit_required), highlight: true }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Amount paid", value: formatMoney(request.amount_paid) }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Balance", value: balance > 0 ? formatMoney(balance) : "Nothing due", highlight: balance > 0 }),
          balance > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            request.estimated_cost && !request.is_deposit_paid && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Pay the deposit to have a provider assigned to your request." }),
            /* @__PURE__ */ jsxs(Dialog, { open: payOpen, onOpenChange: (open) => {
              setPayOpen(open);
              if (!open) payMutation.reset();
            }, children: [
              /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "sm", className: "mt-2 w-full", onClick: () => setPayAmount(request.deposit_required != null && !request.is_deposit_paid ? String(request.deposit_required) : String(balance)), children: "Make Payment" }) }),
              /* @__PURE__ */ jsxs(DialogContent, { children: [
                /* @__PURE__ */ jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsx(DialogTitle, { children: "Make Payment" }),
                  /* @__PURE__ */ jsx(DialogDescription, { children: request.estimated_cost && !request.is_deposit_paid ? `Pay the deposit of ${formatMoney(request.deposit_required)} to proceed with your request.` : `Outstanding balance: ${formatMoney(balance)}` })
                ] }),
                payMutation.isError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
                  payMutation.error.uiMessage ?? payMutation.error.message ?? "Payment failed."
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "pay-amount", children: "Amount (USh)" }),
                  /* @__PURE__ */ jsx(Input, { id: "pay-amount", type: "number", min: "1", placeholder: "e.g. 112500", value: payAmount, onChange: (e) => setPayAmount(e.target.value) })
                ] }),
                /* @__PURE__ */ jsxs(DialogFooter, { children: [
                  /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setPayOpen(false), disabled: payMutation.isPending, children: "Cancel" }),
                  /* @__PURE__ */ jsxs(Button, { disabled: !payAmount || payMutation.isPending, onClick: () => payMutation.mutate(payAmount), children: [
                    payMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Pay"
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx(SectionLabel, { children: "Photos" }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request-photos", search: {
            id: request.id,
            title: request.title
          }, children: [
            /* @__PURE__ */ jsx(ImagePlus, { className: "mr-1.5 h-4 w-4" }),
            "Add photo"
          ] }) })
        ] }),
        request.images.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center", children: [
          /* @__PURE__ */ jsx(ImagePlus, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No photos yet — add one to help providers assess the issue." })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3", children: [
          heroImage && /* @__PURE__ */ jsxs("a", { href: heroImage.image, target: "_blank", rel: "noopener noreferrer", className: "block overflow-hidden rounded-xl border border-border", children: [
            /* @__PURE__ */ jsx("img", { src: heroImage.image, alt: heroImage.caption, className: "aspect-[16/10] w-full object-cover sm:aspect-[2/1]" }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-border bg-background px-4 py-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: heroImage.caption }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: new Date(heroImage.created_at).toLocaleString() })
            ] })
          ] }),
          request.images.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: request.images.slice(1).map((image) => /* @__PURE__ */ jsx(PhotoThumb, { image }, image.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs(InfoBlock, { title: "Location", icon: MapPin, children: [
          /* @__PURE__ */ jsx(InfoLine, { label: "Address", value: request.formatted_address }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Area", value: [request.city, request.district].filter(Boolean).join(", ") }),
          location && /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-start gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
            location
          ] })
        ] }),
        /* @__PURE__ */ jsxs(InfoBlock, { title: "Contact", icon: User, children: [
          /* @__PURE__ */ jsx(InfoLine, { label: "Person", value: request.contact_person }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Phone", value: request.contact_phone, href: `tel:${request.contact_phone}` }),
          request.contact_alternate_phone && /* @__PURE__ */ jsx(InfoLine, { label: "Alt. phone", value: request.contact_alternate_phone }),
          /* @__PURE__ */ jsx(InfoLine, { label: "Email", value: request.contact_email, href: `mailto:${request.contact_email}` })
        ] })
      ] })
    ] })
  ] });
}
function SectionLabel({
  children
}) {
  return /* @__PURE__ */ jsx("h2", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children });
}
function MetaChip({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 bg-background px-3 py-2", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-0.5 truncate text-sm font-medium text-foreground", children: value })
  ] });
}
function InfoBlock({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-border p-4", children: [
    /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children })
  ] });
}
function InfoLine({
  label,
  value,
  href,
  highlight = false
}) {
  const content = /* @__PURE__ */ jsx("span", { className: cn("text-sm", highlight ? "font-semibold text-foreground" : "text-foreground"), children: value || "—" });
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    href && value ? /* @__PURE__ */ jsx("a", { href, className: "text-sm font-medium text-primary hover:underline", children: value }) : content
  ] });
}
function PhotoThumb({
  image
}) {
  return /* @__PURE__ */ jsx("a", { href: image.image, target: "_blank", rel: "noopener noreferrer", className: "block w-28 shrink-0 overflow-hidden rounded-lg border border-border sm:w-32", children: /* @__PURE__ */ jsx("img", { src: image.image, alt: image.caption, className: "aspect-square w-full object-cover", loading: "lazy" }) });
}
function LoadingState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading request…"
  ] });
}
function GuestState() {
  return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Sign in to view this request" }),
    /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/sign-in", search: {
      redirect: "/marketplace/requests"
    }, children: "Sign in" }) })
  ] });
}
function NotFoundState() {
  return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Request not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This request doesn't exist or you don't have access to it." }),
    /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "mt-4", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/requests", children: "Back to my requests" }) })
  ] });
}
export {
  RequestDetailPage as component
};
