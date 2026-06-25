import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Search, Send, ClipboardList, Wrench } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Badge } from "./badge-BAnpIKa2.js";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
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
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const flow = [{
  icon: Search,
  title: "1. Submit on marketplace",
  body: "Public form on /request collects contact, address, optional property/unit code, category, priority, description and up to 5 photos."
}, {
  icon: Send,
  title: "2. Validated & forwarded",
  body: "submitRequest server function validates with Zod, maps Specialty → RequestCategory, then POSTs a MaintenanceRequest into Unit & Tenant Views."
}, {
  icon: ClipboardList,
  title: "3. Triaged in admin",
  body: "Marketplace admins see the request at /admin/dashboard and a property manager sees it at /maintenance in Unit & Tenant Views."
}, {
  icon: Wrench,
  title: "4. Assigned & completed",
  body: "A vetted provider is assigned, executes the job, and status updates flow back to the requester via email."
}];
const requiredFields = [{
  name: "audience",
  type: "'tenant' | 'public'",
  notes: "Drives whether property/unit are required."
}, {
  name: "name",
  type: "string (2–120)",
  notes: "Requester full name."
}, {
  name: "email",
  type: "email (≤200)",
  notes: "Used as tenantId when audience = tenant."
}, {
  name: "phone",
  type: "string (6–40)",
  notes: "Contact number."
}, {
  name: "address",
  type: "string (3–300)",
  notes: "Service address."
}, {
  name: "propertyCode",
  type: "string (≤60), optional",
  notes: "Required for tenants → propertyId."
}, {
  name: "unitNumber",
  type: "string (≤40), optional",
  notes: "Required for tenants → unitId."
}, {
  name: "specialty",
  type: "Specialty enum",
  notes: "Mapped to RequestCategory."
}, {
  name: "title",
  type: "string (3–120)",
  notes: "Short summary."
}, {
  name: "description",
  type: "string (10–2000)",
  notes: "What's wrong."
}, {
  name: "priority",
  type: "Low | Medium | High | Emergency",
  notes: "Drives SLA."
}, {
  name: "photos",
  type: "image/jpeg|png|webp, ≤5MB, max 5",
  notes: "Validated client + server side."
}, {
  name: "preferredProviderId",
  type: "string, optional",
  notes: "Set when arriving from a provider page."
}];
const statuses = [{
  name: "Open",
  tone: "bg-warning/15 text-warning-foreground border-warning/40",
  meaning: "Just submitted, awaiting triage."
}, {
  name: "Triaged",
  tone: "bg-primary/10 text-primary border-primary/30",
  meaning: "Reviewed and categorised by admin."
}, {
  name: "Assigned",
  tone: "bg-primary/15 text-primary border-primary/40",
  meaning: "Routed to a specific service provider."
}, {
  name: "InProgress",
  tone: "bg-accent/15 text-accent-foreground border-accent/40",
  meaning: "Provider is on-site or actively working."
}, {
  name: "Completed",
  tone: "bg-success/15 text-success border-success/40",
  meaning: "Job finished and signed off."
}, {
  name: "Cancelled",
  tone: "bg-muted text-muted-foreground border-border",
  meaning: "Withdrawn or duplicate."
}];
function HowItWorks() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("section", { className: "container mx-auto max-w-4xl px-4 py-16", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight text-foreground", children: "How Casmara Systems works" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg text-muted-foreground", children: "One marketplace, two audiences: tenants of managed properties and the general public. Both streams flow into the maintenance module of Unit & Tenant Views." }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 space-y-4", children: flow.map((s, i) => /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex gap-5 p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(s.icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
            "Step ",
            i + 1
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg font-semibold text-foreground", children: s.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-muted-foreground", children: s.body })
        ] })
      ] }) }, s.title)) }),
      /* @__PURE__ */ jsx("h2", { className: "mt-16 text-2xl font-bold tracking-tight text-foreground", children: "Required fields" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        "Validated by the ",
        /* @__PURE__ */ jsx("code", { className: "rounded bg-muted px-1", children: "submitRequest" }),
        " server function (Zod) before reaching the Maintenance module."
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "mt-4 border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Field" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Type / rule" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Notes" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: requiredFields.map((f) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-0", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs text-foreground", children: f.name }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: f.type }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: f.notes })
        ] }, f.name)) })
      ] }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "mt-16 text-2xl font-bold tracking-tight text-foreground", children: "Status lifecycle" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Open → Triaged → Assigned → InProgress → Completed (or Cancelled at any step)." }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: statuses.map((s) => /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: s.tone, children: s.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: s.meaning })
      ] }) }, s.name)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/request", children: "Submit a request" }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/admin/dashboard", children: "Open admin dashboard" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  HowItWorks as component
};
