import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Star, MapPin, Clock, Users } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Badge } from "./badge-BAnpIKa2.js";
import { d as Route, a as providers, s as specialties, p as providerCover } from "./router-rAJgq2Yd.js";
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
function ProvidersPage() {
  const search = Route.useSearch();
  const activeSpecialty = search.specialty;
  const list = activeSpecialty ? providers.filter((p) => p.specialty === activeSpecialty) : providers;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      search.welcome === "1" && /* @__PURE__ */ jsx("div", { className: "border-b border-primary/20 bg-primary/5", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary", children: "Welcome to Casmara Systems! Browse our vetted providers below and request a service when you're ready." }) }) }),
      /* @__PURE__ */ jsx("section", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground", children: "Browse providers" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "All providers are background-checked, licensed, and reviewed by customers. Pick one and request directly, or let us match you automatically." })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request", children: [
            "Request a service ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", search: {}, className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " + (!activeSpecialty ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"), children: "All" }),
          specialties.filter((s) => s !== "Other").map((s) => /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", search: {
            specialty: s
          }, className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " + (activeSpecialty === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"), children: s }, s))
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "container mx-auto px-4 py-10", children: list.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No providers found for that specialty." }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "mt-4", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", search: {}, children: "Clear filter" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: list.map((p) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-border transition-shadow hover:shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-40 w-full overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsx("img", { src: providerCover(p), alt: `${p.company} — ${p.specialty}`, loading: "lazy", className: "h-full w-full object-cover transition-transform duration-300 hover:scale-105" }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "absolute left-3 top-3", children: p.specialty })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "flex h-full flex-col p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground", children: p.name.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("h2", { className: "truncate text-base font-semibold text-foreground", children: p.company }),
                p.verified && /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4 shrink-0 text-primary" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: p.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-warning text-warning" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: p.rating }),
              "(",
              p.reviews,
              " reviews)"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
              " ",
              p.city
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
              " ",
              p.responseTime
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5" }),
              " ",
              p.completedJobs.toLocaleString(),
              " jobs completed"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground", children: p.bio }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Starting from" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                "USh ",
                p.hourlyRate.toLocaleString(),
                "/hr"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers/$providerId", params: {
                providerId: p.id
              }, children: "Profile" }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/request", search: {
                providerId: p.id,
                specialty: p.specialty
              }, children: "Request" }) })
            ] })
          ] })
        ] })
      ] }, p.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  ProvidersPage as component
};
