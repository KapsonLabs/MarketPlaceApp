import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Wrench, BadgeCheck, ShieldCheck, Star, MapPin, Clock, BriefcaseBusiness, Languages, MessageSquareText, Images, Calendar, CheckCircle2 } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { B as Badge } from "./badge-BAnpIKa2.js";
import { i as Route, p as providerCover, j as providerGallery } from "./router-rAJgq2Yd.js";
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
function ProviderDetail() {
  const {
    provider: p,
    marketplaceReviews
  } = Route.useLoaderData();
  const cover = providerCover(p);
  const gallery = providerGallery(p);
  const services = p.services ?? ["On-site assessment", "Material sourcing", "Photo job updates"];
  const certifications = p.certifications ?? ["Identity verified", "Workmanship guarantee", "Marketplace quality checks"];
  const serviceAreas = p.serviceAreas ?? [p.city];
  const languages = p.languages ?? ["English"];
  const baseReviews = p.profileReviews ?? [{
    id: "review-default-1",
    author: "Verified customer",
    role: "Customer",
    rating: Math.round(p.rating),
    date: "Recent",
    service: p.specialty,
    comment: "Professional service, clear communication and tidy handover after the job was completed."
  }];
  const marketplaceMapped = (marketplaceReviews ?? []).map((r, i) => ({
    id: `mkt-review-${i}`,
    author: r.author,
    role: "Marketplace customer",
    rating: r.rating,
    date: new Date(r.at).toLocaleDateString(),
    service: p.specialty,
    comment: r.comment
  }));
  const reviews = [...marketplaceMapped, ...baseReviews];
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "mb-4 -ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/providers", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
        " All providers"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-56 w-full sm:h-72", children: [
          /* @__PURE__ */ jsx("img", { src: cover, alt: `${p.company} — ${p.specialty} services`, className: "h-full w-full object-cover", loading: "lazy" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "mb-2", children: [
                /* @__PURE__ */ jsx(Wrench, { className: "mr-1 h-3 w-3" }),
                p.specialty
              ] }),
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground sm:text-3xl", children: p.company })
            ] }),
            p.verified && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
              /* @__PURE__ */ jsx(BadgeCheck, { className: "h-3.5 w-3.5" }),
              " Verified"
            ] })
          ] })
        ] }),
        gallery.length > 1 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1 bg-border", children: gallery.slice(0, 3).map((src, i) => /* @__PURE__ */ jsx("img", { src, alt: `${p.company} work sample ${i + 1}`, className: "h-24 w-full object-cover sm:h-32", loading: "lazy" }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground", children: p.name.split(" ").map((part) => part[0]).join("").slice(0, 2) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Lead pro: ",
                  p.name
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
                    /* @__PURE__ */ jsx(Wrench, { className: "mr-1 h-3 w-3" }),
                    " ",
                    p.specialty
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1 h-3 w-3" }),
                    " Workmanship guarantee"
                  ] })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-warning text-warning" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: p.rating }),
                "(",
                p.reviews,
                " ",
                "reviews)"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
                " ",
                p.city
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
                " Responds ",
                p.responseTime.toLowerCase()
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-6 leading-relaxed text-foreground", children: p.bio }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-3", children: services.slice(0, 6).map((service) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 text-sm font-medium text-foreground", children: [
              /* @__PURE__ */ jsx(BriefcaseBusiness, { className: "mb-2 h-4 w-4 text-primary" }),
              service
            ] }, service)) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsx(Stat, { label: "Years experience", value: `${p.yearsExperience}` }),
            /* @__PURE__ */ jsx(Stat, { label: "Jobs completed", value: p.completedJobs.toLocaleString() }),
            /* @__PURE__ */ jsx(Stat, { label: "Hourly rate", value: `USh ${p.hourlyRate.toLocaleString()}` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx(DetailPanel, { title: "Credentials", icon: ShieldCheck, children: certifications.map((item) => /* @__PURE__ */ jsx(DetailRow, { children: item }, item)) }),
            /* @__PURE__ */ jsx(DetailPanel, { title: "Coverage", icon: MapPin, children: serviceAreas.map((area) => /* @__PURE__ */ jsx(DetailRow, { children: area }, area)) }),
            /* @__PURE__ */ jsx(DetailPanel, { title: "Languages", icon: Languages, children: languages.map((language) => /* @__PURE__ */ jsx(DetailRow, { children: language }, language)) }),
            /* @__PURE__ */ jsx(DetailPanel, { title: "Availability", icon: Clock, children: /* @__PURE__ */ jsx(DetailRow, { children: p.availability ?? p.responseTime }) })
          ] }),
          /* @__PURE__ */ jsx(Card, { className: "mt-6 border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MessageSquareText, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Reviews" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-warning text-warning" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: p.rating }),
                "average from ",
                p.reviews,
                " reviews"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: reviews.map((review) => /* @__PURE__ */ jsx(Review, { review }, review.id)) })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { className: "mt-6 border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Images, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Photo gallery" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                gallery.length,
                " photo",
                gallery.length === 1 ? "" : "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Recent work and on-site photos from ",
              p.company,
              "."
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3", children: gallery.map((src, i) => /* @__PURE__ */ jsx("a", { href: src, target: "_blank", rel: "noreferrer", className: "group relative block aspect-[4/3] overflow-hidden rounded-lg border border-border", children: /* @__PURE__ */ jsx("img", { src, alt: `${p.company} gallery image ${i + 1}`, className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105", loading: "lazy" }) }, i)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx(Card, { className: "sticky top-20 border-border shadow-[var(--shadow-elegant)]", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Starting from" }),
          /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-foreground", children: [
            "USh ",
            p.hourlyRate.toLocaleString(),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-muted-foreground", children: " /hr" })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "mt-5 w-full", children: /* @__PURE__ */ jsxs(Link, { to: "/marketplace/request", search: {
            providerId: p.id,
            specialty: p.specialty
          }, children: [
            /* @__PURE__ */ jsx(Calendar, { className: "mr-1 h-4 w-4" }),
            " Request this pro"
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: "No charge until the pro accepts your request." })
        ] }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function DetailPanel({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children })
  ] }) });
}
function DetailRow({
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
    /* @__PURE__ */ jsx("span", { children })
  ] });
}
function Review({
  review
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: review.author }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          review.role,
          " • ",
          review.date
        ] })
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", children: review.service })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center gap-1 text-warning", children: Array.from({
      length: 5
    }).map((_, idx) => /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 " + (idx < review.rating ? "fill-current" : "text-muted") }, idx)) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-foreground", children: review.comment })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-foreground", children: value })
  ] }) });
}
export {
  ProviderDetail as component
};
