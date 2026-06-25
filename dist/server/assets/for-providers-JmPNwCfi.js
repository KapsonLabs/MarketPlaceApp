import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
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
const perks = ["Steady stream of qualified jobs from managed properties.", "Get paid through the platform — no chasing invoices.", "Build a verified reputation with ratings & reviews.", "Set your own service area, hours, and rates."];
function ForProviders() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("section", { className: "container mx-auto max-w-3xl px-4 py-16", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight text-foreground", children: "Grow your business with Casmara Systems" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg text-muted-foreground", children: "We connect verified pros with property managers and homeowners who need reliable work — fast." }),
      /* @__PURE__ */ jsx(Card, { className: "mt-10 border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 p-6", children: perks.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "mt-0.5 h-5 w-5 shrink-0 text-success" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground", children: p })
      ] }, p)) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(Button, { size: "lg", disabled: true, children: "Apply to join (coming soon)" }),
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", children: "See current providers" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  ForProviders as component
};
