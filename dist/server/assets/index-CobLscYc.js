import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Zap, ArrowRight, Star, Search, Sparkles, CheckCircle2, Shield, Clock, ClipboardCheck } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Badge } from "./badge-BAnpIKa2.js";
import { s as specialties, S as SPECIALTY_IMAGES, p as providerCover, a as providers } from "./router-rAJgq2Yd.js";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "react";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
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
const stats = [{
  value: "1,200+",
  label: "Verified pros"
}, {
  value: "18 min",
  label: "Avg. response"
}, {
  value: "4.8★",
  label: "Avg. rating"
}, {
  value: "24/7",
  label: "Emergency desk"
}];
const steps = [{
  icon: Search,
  title: "Tell us what's broken",
  body: "Describe the issue in 30 seconds. Add photos if it helps."
}, {
  icon: Sparkles,
  title: "We match a pro",
  body: "Your request is routed to the right specialist nearby."
}, {
  icon: CheckCircle2,
  title: "Job tracked end-to-end",
  body: "Tenant requests sync into your property's maintenance queue automatically."
}];
function Landing() {
  const featured = providers.slice(0, 3);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 opacity-90", style: {
          background: "var(--gradient-soft)"
        } }),
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-2 lg:py-28", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "mb-5 w-fit gap-1.5", children: [
              /* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5" }),
              " Synced with your property manager"
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl", children: [
              "Find a trusted pro.",
              " ",
              /* @__PURE__ */ jsx("span", { className: "bg-clip-text text-transparent", style: {
                backgroundImage: "var(--gradient-hero)"
              }, children: "Fix it today." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-xl text-lg text-muted-foreground", children: "Request a plumber, electrician, HVAC tech or handyman. Tenants get their request routed straight into the building's maintenance queue — homeowners get a vetted pro on-site, fast." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "shadow-[var(--shadow-elegant)]", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request", children: [
                "Request a service ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
              ] }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", children: "Browse providers" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: s.value }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
            ] }, s.label)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(Card, { className: "border-border shadow-[var(--shadow-elegant)]", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Popular services" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4", children: specialties.slice(0, 8).map((s) => /* @__PURE__ */ jsxs(Link, { to: "/marketplace/providers", search: {
              specialty: s
            }, className: "group relative aspect-[4/3] overflow-hidden rounded-lg border border-border", children: [
              /* @__PURE__ */ jsx("img", { src: SPECIALTY_IMAGES[s], alt: `${s} services`, loading: "lazy", className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" }),
              /* @__PURE__ */ jsx("span", { className: "absolute inset-x-0 bottom-1.5 text-center text-xs font-semibold text-background", children: s })
            ] }, s)) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-3", children: featured.map((p) => /* @__PURE__ */ jsxs(Link, { to: "/marketplace/providers/$providerId", params: {
              providerId: p.id
            }, className: "flex items-center gap-3 rounded-lg border border-border bg-background p-2 pr-4 transition-all hover:border-primary", children: [
              /* @__PURE__ */ jsx("img", { src: providerCover(p), alt: p.company, loading: "lazy", className: "h-12 w-16 shrink-0 rounded-md object-cover" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-foreground", children: p.company }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  p.specialty,
                  " • ",
                  p.city
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs font-medium text-foreground", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-warning text-warning" }),
                p.rating
              ] })
            ] }, p.id)) })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-4 py-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight text-foreground sm:text-4xl", children: `From "it's broken" to "it's fixed"` }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: "The same workflow whether you rent, own, or manage a building." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: steps.map((s, i) => /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
            "Step ",
            i + 1
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg font-semibold text-foreground", children: s.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: s.body })
        ] }) }, s.title)) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "border-y border-border bg-card", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3", children: [{
        icon: Shield,
        title: "Vetted & insured",
        body: "Background checks, license verification, customer reviews."
      }, {
        icon: Clock,
        title: "Real response times",
        body: "Most jobs accepted within 30 minutes during business hours."
      }, {
        icon: ClipboardCheck,
        title: "Independent assessment",
        body: "A vetted assessor visits first, scopes the job and issues a transparent invoice before any provider is dispatched."
      }].map((b) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(b.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: b.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: b.body })
        ] })
      ] }, b.title)) }) }),
      /* @__PURE__ */ jsx("section", { className: "container mx-auto px-4 py-20", children: /* @__PURE__ */ jsx(Card, { className: "overflow-hidden border-0 text-primary-foreground", style: {
        background: "var(--gradient-hero)"
      }, children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold sm:text-3xl", children: "Got a leak, an outage, or a broken appliance?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-primary-foreground/85", children: "Submit a request and we'll route it to the right pro in minutes." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "secondary", className: "shrink-0", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request", children: [
          "Request a service ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  Landing as component
};
