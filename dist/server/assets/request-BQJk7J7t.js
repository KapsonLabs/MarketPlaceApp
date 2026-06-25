import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link, ClientOnly } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LockKeyhole, Wrench, Loader2, MapPin, Phone, ClipboardCheck, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { u as useCurrentUser, S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button, c as cn } from "./button-BmLZMIt9.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { T as Textarea } from "./textarea-DOyZGKZq.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
import { l as listAllServiceCategories } from "./service-categories.api-RHGMOrkk.js";
import { c as createServiceRequest } from "./service-requests.api-K3cgLLXa.js";
import { l as listAllProviders, g as getProvider } from "./providers.api-B4SzXqi_.js";
import { c as Route } from "./router-rAJgq2Yd.js";
import "./notifications.ws-DJ822Bff.js";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
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
const DRAFT_KEY = "casmara.request.draft.v2";
const PRIORITIES = ["low", "normal", "high", "emergency"];
const STEPS = ["job", "location", "contact", "review"];
const emptyForm = () => ({
  serviceCategoryId: "",
  priority: "normal",
  title: "",
  description: "",
  estimatedBudget: "",
  formattedAddress: "",
  city: "",
  district: "",
  contactPerson: "",
  contactPhone: "",
  contactAlternatePhone: "",
  contactEmail: "",
  preferredDate: "",
  preferredTime: "",
  assignmentType: "platform_assigned",
  preferredProviderId: ""
});
function RequestPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [form, setForm] = useState(() => ({
    ...emptyForm(),
    serviceCategoryId: search.categoryId ?? "",
    preferredProviderId: search.providerId ?? "",
    assignmentType: search.providerId ? "customer_selected" : "platform_assigned"
  }));
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ["service-categories"],
    queryFn: listAllServiceCategories
  });
  const {
    data: providers = []
  } = useQuery({
    queryKey: ["providers", "all"],
    queryFn: listAllProviders,
    enabled: form.assignmentType === "customer_selected"
  });
  const {
    data: pinnedProvider
  } = useQuery({
    queryKey: ["provider", search.providerId],
    queryFn: () => getProvider(search.providerId),
    enabled: !!search.providerId
  });
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.form) setForm((f) => ({
        ...f,
        ...d.form
      }));
      if (typeof d.stepIndex === "number") setStepIndex(d.stepIndex);
      if (d.location) setLocation(d.location);
      setResumed(true);
    } catch {
    }
  }, []);
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      contactPerson: f.contactPerson || user.name,
      contactEmail: f.contactEmail || user.email
    }));
  }, [user]);
  useEffect(() => {
    if (categories.length && !form.serviceCategoryId && !search.categoryId) {
      setForm((f) => ({
        ...f,
        serviceCategoryId: categories[0].id
      }));
    }
  }, [categories, form.serviceCategoryId, search.categoryId]);
  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({
        form,
        stepIndex,
        location
      }));
    } catch {
    }
  }, [form, stepIndex, location]);
  const update = (key, value) => setForm((f) => ({
    ...f,
    [key]: value
  }));
  const step = STEPS[stepIndex];
  const stepValid = validateStep(step, form, location);
  function nextStep() {
    setError(null);
    if (!stepValid.ok) {
      setError(stepValid.message);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function prevStep() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (stepIndex < STEPS.length - 1) {
      if (!stepValid.ok) {
        setError(stepValid.message);
        return;
      }
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
      return;
    }
    if (!user) {
      navigate({
        to: "/marketplace/sign-in",
        search: {
          redirect: "/marketplace/request"
        }
      });
      return;
    }
    const check = validateStep("review", form, location);
    if (!check.ok || !location) {
      setError(check.message ?? "Complete all required fields.");
      return;
    }
    await submitRequest();
  }
  async function submitRequest() {
    if (!location) return;
    setSubmitting(true);
    setError(null);
    try {
      const budget = form.estimatedBudget.trim();
      const result = await createServiceRequest({
        service_category: form.serviceCategoryId,
        priority: form.priority,
        title: form.title.trim(),
        description: form.description.trim(),
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: form.formattedAddress.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        contact_person: form.contactPerson.trim(),
        contact_phone: form.contactPhone.trim(),
        contact_alternate_phone: form.contactAlternatePhone.trim(),
        contact_email: form.contactEmail.trim(),
        preferred_date: form.preferredDate || null,
        preferred_time: form.preferredTime ? formatApiTime(form.preferredTime) : null,
        estimated_budget: budget ? formatApiMoney(budget) : null,
        assignment_type: form.assignmentType,
        preferred_provider: form.assignmentType === "customer_selected" ? form.preferredProviderId || null : null
      });
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
        }
      }
      await navigate({
        to: "/marketplace/request-photos",
        search: {
          id: result.id,
          title: result.title
        },
        replace: true
      });
    } catch (err) {
      const axiosError = err;
      setError(axiosError.uiMessage ?? (err instanceof Error ? err.message : "Something went wrong. Please try again."));
      setSubmitting(false);
    }
  }
  function discardDraft() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_KEY);
    }
    setResumed(false);
    setForm({
      ...emptyForm(),
      serviceCategoryId: categories[0]?.id ?? "",
      preferredProviderId: search.providerId ?? "",
      assignmentType: search.providerId ? "customer_selected" : "platform_assigned"
    });
    setLocation(null);
    setStepIndex(0);
  }
  const categoryName = categories.find((c) => c.id === form.serviceCategoryId)?.name ?? "Service category";
  const selectedProvider = providers.find((p) => p.id === form.preferredProviderId) ?? pinnedProvider;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-border bg-muted/20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-2xl px-4 py-6 sm:py-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl", children: "Request a service" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground sm:text-base", children: "Describe the job, pin the location, and we'll match you with a provider." }),
        /* @__PURE__ */ jsx(Stepper, { stepIndex, onJump: (i) => i <= stepIndex && setStepIndex(i) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-2xl px-4 py-6 sm:py-8", children: [
        resumed && /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { children: "Resumed your saved draft." }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: discardDraft, children: "Discard draft" })
        ] }),
        !user && /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(LockKeyhole, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Sign in to submit" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "You can fill in the form now — sign in before submitting." })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", className: "shrink-0", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/sign-in", search: {
            redirect: "/marketplace/request"
          }, children: "Sign in" }) })
        ] }),
        pinnedProvider && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Preferred provider" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: pinnedProvider.business_name })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
          step === "job" && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(SectionHeading, { icon: Wrench, title: "Job details" }),
            categoriesLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-8 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              "Loading categories…"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Field, { label: "Service category", id: "category", required: true, children: /* @__PURE__ */ jsxs(Select, { value: form.serviceCategoryId, onValueChange: (v) => update("serviceCategoryId", v), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "category", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a category" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(Field, { label: "Priority", id: "priority", required: true, children: /* @__PURE__ */ jsxs(Select, { value: form.priority, onValueChange: (v) => update("priority", v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { id: "priority", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: prettify(p) }, p)) })
                ] }) }),
                /* @__PURE__ */ jsx(Field, { label: "Estimated budget (UGX)", id: "budget", hint: "Optional — helps providers quote accurately.", children: /* @__PURE__ */ jsx(Input, { id: "budget", type: "number", min: 0, step: 1e3, inputMode: "numeric", placeholder: "50000", value: form.estimatedBudget, onChange: (e) => update("estimatedBudget", e.target.value) }) })
              ] }),
              /* @__PURE__ */ jsx(Field, { label: "Title", id: "title", required: true, hint: "Short summary of the issue", children: /* @__PURE__ */ jsx(Input, { id: "title", required: true, minLength: 3, placeholder: "Fix leaking kitchen tap", value: form.title, onChange: (e) => update("title", e.target.value) }) }),
              /* @__PURE__ */ jsx(Field, { label: "Description", id: "description", required: true, children: /* @__PURE__ */ jsx(Textarea, { id: "description", required: true, minLength: 10, rows: 5, placeholder: "Describe what's wrong and any access details…", value: form.description, onChange: (e) => update("description", e.target.value) }) })
            ] })
          ] }),
          step === "location" && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(SectionHeading, { icon: MapPin, title: "Service location", subtitle: "Pin the exact spot on the map, then confirm the address." }),
            /* @__PURE__ */ jsx(ClientOnly, { fallback: /* @__PURE__ */ jsx("div", { className: "h-64 rounded-lg border border-dashed border-border" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Street address", id: "formattedAddress", required: true, children: /* @__PURE__ */ jsx(Input, { id: "formattedAddress", required: true, placeholder: "123 Kampala Road", value: form.formattedAddress, onChange: (e) => update("formattedAddress", e.target.value) }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "City", id: "city", required: true, children: /* @__PURE__ */ jsx(Input, { id: "city", required: true, placeholder: "Kampala", value: form.city, onChange: (e) => update("city", e.target.value) }) }),
              /* @__PURE__ */ jsx(Field, { label: "District", id: "district", children: /* @__PURE__ */ jsx(Input, { id: "district", placeholder: "Kampala", value: form.district, onChange: (e) => update("district", e.target.value) }) })
            ] })
          ] }),
          step === "contact" && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(SectionHeading, { icon: Phone, title: "Contact & scheduling", subtitle: "Who should the provider reach, and when works best?" }),
            /* @__PURE__ */ jsx(Field, { label: "Contact person", id: "contactPerson", required: true, children: /* @__PURE__ */ jsx(Input, { id: "contactPerson", required: true, placeholder: "Jane Doe", value: form.contactPerson, onChange: (e) => update("contactPerson", e.target.value) }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "Phone", id: "contactPhone", required: true, children: /* @__PURE__ */ jsx(Input, { id: "contactPhone", type: "tel", required: true, placeholder: "+256700000000", value: form.contactPhone, onChange: (e) => update("contactPhone", e.target.value) }) }),
              /* @__PURE__ */ jsx(Field, { label: "Alternate phone", id: "contactAlternatePhone", children: /* @__PURE__ */ jsx(Input, { id: "contactAlternatePhone", type: "tel", placeholder: "Optional", value: form.contactAlternatePhone, onChange: (e) => update("contactAlternatePhone", e.target.value) }) })
            ] }),
            /* @__PURE__ */ jsx(Field, { label: "Email", id: "contactEmail", required: true, children: /* @__PURE__ */ jsx(Input, { id: "contactEmail", type: "email", required: true, placeholder: "jane@example.com", value: form.contactEmail, onChange: (e) => update("contactEmail", e.target.value) }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "Preferred date", id: "preferredDate", hint: "Optional", children: /* @__PURE__ */ jsx(Input, { id: "preferredDate", type: "date", min: todayInput(), value: form.preferredDate, onChange: (e) => update("preferredDate", e.target.value) }) }),
              /* @__PURE__ */ jsx(Field, { label: "Preferred time", id: "preferredTime", hint: "Optional", children: /* @__PURE__ */ jsx(Input, { id: "preferredTime", type: "time", value: form.preferredTime, onChange: (e) => update("preferredTime", e.target.value) }) })
            ] })
          ] }),
          step === "review" && /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
            /* @__PURE__ */ jsx(SectionHeading, { icon: ClipboardCheck, title: "Assignment & review", subtitle: "Choose how providers are matched, then confirm your details." }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Label, { children: "Provider assignment" }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(AssignmentOption, { active: form.assignmentType === "platform_assigned", title: "Platform matched", body: "We'll assign the best available provider.", onClick: () => {
                  update("assignmentType", "platform_assigned");
                  update("preferredProviderId", "");
                } }),
                /* @__PURE__ */ jsx(AssignmentOption, { active: form.assignmentType === "customer_selected", title: "Choose a provider", body: "Pick a specific provider from the marketplace.", onClick: () => update("assignmentType", "customer_selected") })
              ] }),
              form.assignmentType === "customer_selected" && /* @__PURE__ */ jsx(Field, { label: "Preferred provider", id: "preferredProvider", required: true, children: /* @__PURE__ */ jsxs(Select, { value: form.preferredProviderId, onValueChange: (v) => update("preferredProviderId", v), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "preferredProvider", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a provider" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: providers.map((p) => /* @__PURE__ */ jsxs(SelectItem, { value: p.id, children: [
                  p.business_name,
                  p.city ? ` · ${p.city}` : ""
                ] }, p.id)) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("dl", { className: "divide-y divide-border rounded-lg border border-border", children: [
              /* @__PURE__ */ jsx(ReviewRow, { label: "Category", value: categoryName }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Priority", value: prettify(form.priority) }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Title", value: form.title }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Description", value: form.description }),
              form.estimatedBudget && /* @__PURE__ */ jsx(ReviewRow, { label: "Budget", value: `USh ${Number(form.estimatedBudget).toLocaleString()}` }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Location", value: [form.formattedAddress, form.city, form.district].filter(Boolean).join(", ") }),
              location && /* @__PURE__ */ jsx(ReviewRow, { label: "Coordinates", value: `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Contact", value: form.contactPerson }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Phone", value: form.contactPhone }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Email", value: form.contactEmail }),
              (form.preferredDate || form.preferredTime) && /* @__PURE__ */ jsx(ReviewRow, { label: "Preferred slot", value: [form.preferredDate, form.preferredTime].filter(Boolean).join(" at ") || "—" }),
              /* @__PURE__ */ jsx(ReviewRow, { label: "Assignment", value: form.assignmentType === "platform_assigned" ? "Platform matched" : selectedProvider?.business_name ?? "Provider selected" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Photos can be added after submission from your request details." })
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: prevStep, disabled: stepIndex === 0, children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
              "Back"
            ] }),
            stepIndex < STEPS.length - 1 ? /* @__PURE__ */ jsxs(Button, { type: "button", onClick: nextStep, disabled: categoriesLoading, children: [
              "Continue",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
            ] }) : /* @__PURE__ */ jsx(Button, { type: "button", disabled: submitting || !user, onClick: () => {
              if (!user) {
                navigate({
                  to: "/marketplace/sign-in",
                  search: {
                    redirect: "/marketplace/request"
                  }
                });
                return;
              }
              const check = validateStep("review", form, location);
              if (!check.ok || !location) {
                setError(check.message ?? "Complete all required fields.");
                return;
              }
              void submitRequest();
            }, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-4 w-4 animate-spin" }),
              "Submitting…"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Submit request",
              /* @__PURE__ */ jsx(Check, { className: "ml-1 h-4 w-4" })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function validateStep(step, form, location) {
  switch (step) {
    case "job":
      if (!form.serviceCategoryId) return {
        ok: false,
        message: "Select a service category."
      };
      if (form.title.trim().length < 3) return {
        ok: false,
        message: "Title must be at least 3 characters."
      };
      if (form.description.trim().length < 10) return {
        ok: false,
        message: "Description must be at least 10 characters."
      };
      return {
        ok: true
      };
    case "location":
      if (!location) return {
        ok: false,
        message: "Pin your location on the map."
      };
      if (!form.formattedAddress.trim()) return {
        ok: false,
        message: "Enter a street address."
      };
      if (!form.city.trim()) return {
        ok: false,
        message: "Enter a city."
      };
      return {
        ok: true
      };
    case "contact":
      if (!form.contactPerson.trim()) return {
        ok: false,
        message: "Enter a contact person."
      };
      if (!form.contactPhone.trim()) return {
        ok: false,
        message: "Enter a phone number."
      };
      if (!form.contactEmail.trim() || !form.contactEmail.includes("@")) return {
        ok: false,
        message: "Enter a valid email address."
      };
      return {
        ok: true
      };
    case "review":
      if (form.assignmentType === "customer_selected" && !form.preferredProviderId) return {
        ok: false,
        message: "Select a preferred provider."
      };
      return validateStep("job", form, location).ok && validateStep("location", form, location).ok && validateStep("contact", form, location).ok ? {
        ok: true
      } : {
        ok: false,
        message: "Some required fields are missing."
      };
    default:
      return {
        ok: true
      };
  }
}
function Stepper({
  stepIndex,
  onJump
}) {
  const labels = ["Job", "Location", "Contact", "Review"];
  const icons = [Wrench, MapPin, Phone, ClipboardCheck];
  return /* @__PURE__ */ jsx("ol", { className: "mt-5 flex gap-1 sm:gap-2", children: labels.map((label, i) => {
    const Icon = icons[i];
    const active = stepIndex === i;
    const done = stepIndex > i;
    return /* @__PURE__ */ jsx("li", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onJump(i), disabled: i > stepIndex, className: cn("flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 text-center transition-colors sm:px-2", active && "bg-primary/10", i > stepIndex && "opacity-40"), children: [
      /* @__PURE__ */ jsx("span", { className: cn("flex h-7 w-7 items-center justify-center rounded-full text-xs", done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"), children: done ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsx("span", { className: cn("text-[10px] font-medium leading-tight sm:text-xs", active ? "text-foreground" : "text-muted-foreground"), children: label })
    ] }) }, label);
  }) });
}
function SectionHeading({
  icon: Icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: subtitle })
    ] })
  ] });
}
function AssignmentOption({
  active,
  title,
  body,
  onClick
}) {
  return /* @__PURE__ */ jsxs("button", { type: "button", onClick, className: cn("rounded-lg border px-4 py-3 text-left transition-colors", active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"), children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: body })
  ] });
}
function ReviewRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-1 px-4 py-3 sm:grid-cols-[120px_1fr]", children: [
    /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "text-sm text-foreground", children: value || "—" })
  ] });
}
function Field({
  label,
  id,
  hint,
  required,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs(Label, { htmlFor: id, children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-destructive", children: " *" })
    ] }),
    children,
    hint && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: hint })
  ] });
}
function prettify(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function todayInput() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function formatApiTime(value) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
}
function formatApiMoney(value) {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return value;
  return n.toFixed(2);
}
export {
  RequestPage as component
};
