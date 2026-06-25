import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Plus, AlertCircle, Loader2, Trophy, Star, UserCheck, Timer, ArrowLeft, ShieldCheck, BriefcaseBusiness, MapPin, CalendarDays, Wrench, Award, CheckCircle2, FileText, ExternalLink, Mail, Phone, Navigation, Globe } from "lucide-react";
import { A as AdminShell, a as Avatar, c as AvatarImage, b as AvatarFallback } from "./admin-shell-DIDE6yaB.js";
import { useState } from "react";
import { B as Button, c as cn } from "./button-BmLZMIt9.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BhK3eTVt.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
import { c as createProviderService, S as SKILL_LEVELS, C as CERTIFICATION_STATUSES, g as getProvider } from "./providers.api-B4SzXqi_.js";
import { a as listServiceCategories } from "./service-categories.api-RHGMOrkk.js";
import { S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DkWCRhLz.js";
import { x as Route } from "./router-rAJgq2Yd.js";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./badge-BAnpIKa2.js";
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
const empty = {
  category: "",
  years_of_experience: "",
  skill_level: "intermediate",
  certification_status: "none",
  hourly_rate: ""
};
function prettify$1(value) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}
function ProviderServiceDialog({ providerId }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories,
    enabled: open
  });
  const mutation = useMutation({
    mutationFn: () => createProviderService(providerId, {
      category: form.category,
      years_of_experience: Number(form.years_of_experience) || 0,
      skill_level: form.skill_level,
      certification_status: form.certification_status,
      hourly_rate: form.hourly_rate
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", providerId] });
      setForm(empty);
      setOpen(false);
    }
  });
  function onOpenChange(next) {
    setOpen(next);
    if (!next) {
      setForm(empty);
      mutation.reset();
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    mutation.mutate();
  }
  const error = mutation.error;
  const categories = categoriesQuery.data?.results ?? [];
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", children: [
      /* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }),
      " Add service"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Add a service" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Register a service category this provider offers." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "mt-0.5 h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: error.uiMessage ?? error.message ?? "Failed to add service." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
              required: true,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(
                  SelectValue,
                  {
                    placeholder: categoriesQuery.isPending ? "Loading categories…" : "Select a category"
                  }
                ) }),
                /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "svc-years", children: "Years of experience" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "svc-years",
                type: "number",
                min: 0,
                value: form.years_of_experience,
                onChange: (e) => setForm((f) => ({ ...f, years_of_experience: e.target.value })),
                placeholder: "5"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "svc-rate", children: "Hourly rate" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "svc-rate",
                value: form.hourly_rate,
                onChange: (e) => setForm((f) => ({ ...f, hourly_rate: e.target.value })),
                placeholder: "1800.00"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Skill level" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: form.skill_level,
                onValueChange: (v) => setForm((f) => ({ ...f, skill_level: v })),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: SKILL_LEVELS.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: prettify$1(s) }, s)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Certification" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: form.certification_status,
                onValueChange: (v) => setForm((f) => ({ ...f, certification_status: v })),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: CERTIFICATION_STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: prettify$1(s) }, s)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: () => onOpenChange(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: mutation.isPending || !form.category,
              children: [
                mutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Add service"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ProviderDetailPage() {
  const {
    providerId
  } = Route.useParams();
  const providerQuery = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId)
  });
  if (providerQuery.isPending) {
    return /* @__PURE__ */ jsx(AdminShell, { title: "Provider", children: /* @__PURE__ */ jsx(LoadingState, {}) });
  }
  if (providerQuery.isError) {
    return /* @__PURE__ */ jsx(AdminShell, { title: "Provider", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
      providerQuery.error.uiMessage ?? providerQuery.error.message ?? "Failed to load provider."
    ] }) });
  }
  const provider = providerQuery.data;
  return /* @__PURE__ */ jsx(AdminShell, { title: "Provider profile", description: "Review service capability, verification state, documents, and operational metrics.", actions: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/providers", children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
    " All providers"
  ] }) }), children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(ProviderHero, { provider }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(MetricCard, { icon: Trophy, label: "Jobs completed", value: provider.statistics.jobs_completed.toLocaleString(), hint: `${provider.statistics.jobs_in_progress} in progress` }),
      /* @__PURE__ */ jsx(MetricCard, { icon: Star, label: "Average rating", value: formatRating(provider.average_rating), hint: `${provider.statistics.total_reviews} reviews` }),
      /* @__PURE__ */ jsx(MetricCard, { icon: UserCheck, label: "Acceptance rate", value: formatPercent(provider.statistics.acceptance_rate), hint: "Accepted requests" }),
      /* @__PURE__ */ jsx(MetricCard, { icon: Timer, label: "Response time", value: formatMinutes(provider.statistics.avg_response_minutes), hint: "Average response" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(SkillsTimeline, { provider }),
        /* @__PURE__ */ jsx(DocumentsCard, { provider })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(StatusCard, { provider }),
        /* @__PURE__ */ jsx(ContactCard, { provider }),
        /* @__PURE__ */ jsx(RegistrationCard, { provider })
      ] })
    ] })
  ] }) });
}
function ProviderHero({
  provider
}) {
  const joinedAt = new Date(provider.created_at).toLocaleDateString();
  const address = display(provider.formatted_address || provider.city || provider.country);
  return /* @__PURE__ */ jsx(Card, { className: "overflow-hidden border-border", children: /* @__PURE__ */ jsxs("div", { className: "relative min-h-[260px] bg-gradient-to-br from-sidebar via-sidebar to-primary/40", children: [
    provider.cover_image && /* @__PURE__ */ jsx("img", { src: provider.cover_image, alt: `${provider.business_name} cover`, className: "absolute inset-0 h-full w-full object-cover" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-[260px] flex-col justify-end p-5 md:p-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24 border-4 border-background shadow-lg", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: provider.profile_image ?? void 0, alt: provider.business_name }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-2xl font-bold text-primary-foreground", children: initials(provider.business_name) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(StatusBadge, { value: provider.approval_status }),
              /* @__PURE__ */ jsx(StatusBadge, { value: provider.verification_status }),
              /* @__PURE__ */ jsx(StatusBadge, { value: provider.availability_status })
            ] }),
            /* @__PURE__ */ jsxs("h2", { className: "flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl", children: [
              provider.business_name,
              provider.verification_status === "verified" && /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6 text-primary" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 capitalize", children: [
                /* @__PURE__ */ jsx(BriefcaseBusiness, { className: "h-4 w-4" }),
                provider.provider_type
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
                address
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4" }),
                "Joined ",
                joinedAt
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Service radius" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-2xl font-bold text-foreground", children: [
            provider.service_radius_km,
            " km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: formatCoordinates(provider.latitude, provider.longitude) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-3xl text-sm leading-6 text-muted-foreground", children: provider.description || "No provider description has been added yet. Use the service and document sections below to assess capability and readiness." })
    ] })
  ] }) });
}
function SkillsTimeline({
  provider
}) {
  const services = [...provider.services].sort((a, b) => {
    const rateA = Number.parseFloat(a.hourly_rate ?? "0");
    const rateB = Number.parseFloat(b.hourly_rate ?? "0");
    if (rateB !== rateA) return rateB - rateA;
    return b.years_of_experience - a.years_of_experience;
  });
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground", children: "Skills offered" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Service categories this provider can deliver, with proficiency and pricing." })
      ] }),
      /* @__PURE__ */ jsx(ProviderServiceDialog, { providerId: provider.id })
    ] }),
    services.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center", children: [
      /* @__PURE__ */ jsx(Wrench, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-foreground", children: "No skills listed yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Add a service category to make this provider eligible for matching." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: services.map((service, index) => {
      const isPrimary = index === 0;
      const hasRate = !!service.hourly_rate;
      return /* @__PURE__ */ jsxs("div", { className: cn("rounded-xl border p-4 transition-colors", isPrimary ? "border-primary/30 bg-primary/5" : "border-border bg-card/50"), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: service.category_name }),
              isPrimary && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary", children: [
                /* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
                "Primary skill"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              service.years_of_experience,
              " ",
              service.years_of_experience === 1 ? "year" : "years",
              " experience",
              hasRate ? ` · ${formatCurrency(service.hourly_rate)}` : " · No hourly rate set"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(StatusBadge, { value: service.skill_level }),
            /* @__PURE__ */ jsx(StatusBadge, { value: service.certification_status })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsx(SkillStat, { label: "Skill level", value: prettify(service.skill_level), accent: isPrimary }),
          /* @__PURE__ */ jsx(SkillStat, { label: "Certification", value: prettify(service.certification_status) }),
          /* @__PURE__ */ jsx(SkillStat, { label: "Hourly rate", value: hasRate ? formatCurrency(service.hourly_rate) : "Not set", accent: hasRate })
        ] }),
        service.certification_status === "verified" && /* @__PURE__ */ jsxs("p", { className: "mt-3 inline-flex items-center gap-1.5 text-xs text-success", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
          "Certification verified for this category"
        ] }),
        service.certification_status === "claimed" && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Provider has claimed certification — pending verification." })
      ] }, service.id);
    }) })
  ] });
}
function SkillStat({
  label,
  value,
  accent = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("rounded-lg border px-3 py-2", accent ? "border-primary/20 bg-primary/5" : "border-border/60 bg-muted/20"), children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-semibold text-foreground", children: value })
  ] });
}
function prettify(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function DocumentsCard({
  provider
}) {
  return /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Documents" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Uploaded compliance and verification documents." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: provider.documents.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: FileText, title: "No documents uploaded", body: "Documents will appear here once submitted by the provider." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: provider.documents.map((doc) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-foreground", children: doc.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs capitalize text-muted-foreground", children: doc.document_type.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Issued ",
            formatDate(doc.issue_date),
            " · Expires ",
            formatDate(doc.expiry_date)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(StatusBadge, { value: doc.verification_status }),
        doc.document_file && /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxs("a", { href: doc.document_file, target: "_blank", rel: "noreferrer", children: [
          "View ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "ml-1 h-3.5 w-3.5" })
        ] }) })
      ] })
    ] }, doc.id)) }) })
  ] });
}
function StatusCard({
  provider
}) {
  const stats = provider.statistics;
  return /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Provider status" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(StatusRow, { label: "Approval", value: provider.approval_status }),
      /* @__PURE__ */ jsx(StatusRow, { label: "Verification", value: provider.verification_status }),
      /* @__PURE__ */ jsx(StatusRow, { label: "Availability", value: provider.availability_status }),
      /* @__PURE__ */ jsx(StatusRow, { label: "Active account", value: provider.is_active ? "active" : "inactive" }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Acceptance rate" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: formatPercent(stats.acceptance_rate) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-primary", style: {
          width: `${clampPercent(stats.acceptance_rate)}%`
        } }) })
      ] })
    ] })
  ] });
}
function ContactCard({
  provider
}) {
  return /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Contact & location" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(DetailItem, { icon: Mail, label: "Email", value: display(provider.email) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: Phone, label: "Primary phone", value: display(provider.primary_phone) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: Phone, label: "Secondary phone", value: display(provider.secondary_phone) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: MapPin, label: "Address", value: display(provider.formatted_address || provider.city) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: Navigation, label: "District", value: display(provider.district) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: Globe, label: "Country", value: display(provider.country) })
    ] })
  ] });
}
function RegistrationCard({
  provider
}) {
  return /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Registration" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(DetailItem, { icon: BriefcaseBusiness, label: "Registration number", value: display(provider.registration_number) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: FileText, label: "Tax identification", value: display(provider.tax_identification_number) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: Globe, label: "Website", value: display(provider.website) }),
      /* @__PURE__ */ jsx(DetailItem, { icon: CalendarDays, label: "Updated", value: new Date(provider.updated_at).toLocaleDateString() })
    ] })
  ] });
}
function MetricCard({
  icon: Icon,
  label,
  value,
  hint
}) {
  return /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-foreground", children: value }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
  ] }) }) });
}
function StatusRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx(StatusBadge, { value })
  ] });
}
function DetailItem({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0", children: [
    /* @__PURE__ */ jsx("span", { className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 break-words text-sm font-medium text-foreground", children: value })
    ] })
  ] });
}
function EmptyState({
  icon: Icon,
  title,
  body
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-foreground", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: body })
  ] });
}
function LoadingState() {
  return /* @__PURE__ */ jsx("div", { className: "grid gap-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-20 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
    "Loading provider..."
  ] }) });
}
function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function formatRating(rating) {
  const value = Number.parseFloat(rating);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : "Unrated";
}
function formatCurrency(amount) {
  if (!amount) return "No rate";
  const value = Number.parseFloat(amount);
  if (!Number.isFinite(value)) return amount;
  return `USh ${value.toLocaleString()}/hr`;
}
function formatPercent(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return "0%";
  return `${parsed.toFixed(0)}%`;
}
function clampPercent(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, parsed));
}
function formatMinutes(value) {
  if (value <= 0) return "No data";
  if (value < 60) return `${value} min`;
  const hours = value / 60;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)} hr`;
}
function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}
function formatCoordinates(latitude, longitude) {
  if (latitude == null || longitude == null) return "No coordinates";
  return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
}
function display(value) {
  if (value == null || value === "") return "-";
  return String(value);
}
export {
  ProviderDetailPage as component
};
