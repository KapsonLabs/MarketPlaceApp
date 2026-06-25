import { createFileRoute, Link, useNavigate, ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  LockKeyhole,
  Wrench,
  ClipboardCheck,
  Check,
  Phone,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/lib/marketplace/current-user";
import { LocationPicker, type PickedLocation } from "@/components/marketplace/location-picker";
import { listAllServiceCategories } from "@/lib/service-categories.api";
import { createServiceRequest } from "@/lib/service-requests.api";
import { getProvider, listAllProviders } from "@/lib/providers.api";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "casmara.request.draft.v2";
const PRIORITIES = ["low", "normal", "high", "emergency"] as const;
const STEPS = ["job", "location", "contact", "review"] as const;
type Step = (typeof STEPS)[number];

const searchSchema = z.object({
  providerId: z.string().optional(),
  categoryId: z.string().optional(),
});

export const Route = createFileRoute("/marketplace/request")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Request a service — Casmara Systems" },
      {
        name: "description",
        content: "Submit a service request with job details, location, and contact information.",
      },
    ],
  }),
  component: RequestPage,
});

interface RequestForm {
  serviceCategoryId: string;
  priority: (typeof PRIORITIES)[number];
  title: string;
  description: string;
  estimatedBudget: string;
  formattedAddress: string;
  city: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
  contactAlternatePhone: string;
  contactEmail: string;
  preferredDate: string;
  preferredTime: string;
  assignmentType: "platform_assigned" | "customer_selected";
  preferredProviderId: string;
}

const emptyForm = (): RequestForm => ({
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
  preferredProviderId: "",
});

function RequestPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [form, setForm] = useState<RequestForm>(() => ({
    ...emptyForm(),
    serviceCategoryId: search.categoryId ?? "",
    preferredProviderId: search.providerId ?? "",
    assignmentType: search.providerId ? "customer_selected" : "platform_assigned",
  }));

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["service-categories"],
    queryFn: listAllServiceCategories,
  });

  const { data: providers = [] } = useQuery({
    queryKey: ["providers", "all"],
    queryFn: listAllProviders,
    enabled: form.assignmentType === "customer_selected",
  });

  const { data: pinnedProvider } = useQuery({
    queryKey: ["provider", search.providerId],
    queryFn: () => getProvider(search.providerId!),
    enabled: !!search.providerId,
  });

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as {
        form?: RequestForm;
        stepIndex?: number;
        location?: PickedLocation | null;
      };
      if (d.form) setForm((f) => ({ ...f, ...d.form }));
      if (typeof d.stepIndex === "number") setStepIndex(d.stepIndex);
      if (d.location) setLocation(d.location);
      setResumed(true);
    } catch {
      // ignore corrupt draft
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      contactPerson: f.contactPerson || user.name,
      contactEmail: f.contactEmail || user.email,
    }));
  }, [user]);

  useEffect(() => {
    if (categories.length && !form.serviceCategoryId && !search.categoryId) {
      setForm((f) => ({ ...f, serviceCategoryId: categories[0].id }));
    }
  }, [categories, form.serviceCategoryId, search.categoryId]);

  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, stepIndex, location }));
    } catch {
      // storage may be full
    }
  }, [form, stepIndex, location]);

  const update = <K extends keyof RequestForm>(key: K, value: RequestForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Enter in an input fires form submit on any step — only advance or submit on review.
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
        search: { redirect: "/marketplace/request" } as never,
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
        preferred_provider:
          form.assignmentType === "customer_selected" ? form.preferredProviderId || null : null,
      });

      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // ignore
        }
      }

      await navigate({
        to: "/marketplace/request-photos",
        search: { id: result.id, title: result.title },
        replace: true,
      });
    } catch (err) {
      const axiosError = err as AxiosError & { uiMessage?: string };
      setError(
        axiosError.uiMessage ??
          (err instanceof Error ? err.message : "Something went wrong. Please try again."),
      );
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
      assignmentType: search.providerId ? "customer_selected" : "platform_assigned",
    });
    setLocation(null);
    setStepIndex(0);
  }

  const categoryName =
    categories.find((c) => c.id === form.serviceCategoryId)?.name ?? "Service category";
  const selectedProvider =
    providers.find((p) => p.id === form.preferredProviderId) ?? pinnedProvider;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Request a service
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Describe the job, pin the location, and we&apos;ll match you with a provider.
            </p>
            <Stepper stepIndex={stepIndex} onJump={(i) => i <= stepIndex && setStepIndex(i)} />
          </div>
        </div>

        <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
          {resumed && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              <span>Resumed your saved draft.</span>
              <Button type="button" variant="ghost" size="sm" onClick={discardDraft}>
                Discard draft
              </Button>
            </div>
          )}

          {!user && (
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sign in to submit</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    You can fill in the form now — sign in before submitting.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link
                  to="/marketplace/sign-in"
                  search={{ redirect: "/marketplace/request" } as never}
                >
                  Sign in
                </Link>
              </Button>
            </div>
          )}

          {pinnedProvider && (
            <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              <p className="text-xs text-muted-foreground">Preferred provider</p>
              <p className="font-semibold text-foreground">{pinnedProvider.business_name}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {step === "job" && (
              <section className="space-y-4">
                <SectionHeading icon={Wrench} title="Job details" />
                {categoriesLoading ? (
                  <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading categories…
                  </div>
                ) : (
                  <>
                    <Field label="Service category" id="category" required>
                      <Select
                        value={form.serviceCategoryId}
                        onValueChange={(v) => update("serviceCategoryId", v)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Priority" id="priority" required>
                        <Select
                          value={form.priority}
                          onValueChange={(v) =>
                            update("priority", v as RequestForm["priority"])
                          }
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITIES.map((p) => (
                              <SelectItem key={p} value={p}>
                                {prettify(p)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field
                        label="Estimated budget (UGX)"
                        id="budget"
                        hint="Optional — helps providers quote accurately."
                      >
                        <Input
                          id="budget"
                          type="number"
                          min={0}
                          step={1000}
                          inputMode="numeric"
                          placeholder="50000"
                          value={form.estimatedBudget}
                          onChange={(e) => update("estimatedBudget", e.target.value)}
                        />
                      </Field>
                    </div>

                    <Field label="Title" id="title" required hint="Short summary of the issue">
                      <Input
                        id="title"
                        required
                        minLength={3}
                        placeholder="Fix leaking kitchen tap"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                      />
                    </Field>

                    <Field label="Description" id="description" required>
                      <Textarea
                        id="description"
                        required
                        minLength={10}
                        rows={5}
                        placeholder="Describe what's wrong and any access details…"
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                      />
                    </Field>
                  </>
                )}
              </section>
            )}

            {step === "location" && (
              <section className="space-y-4">
                <SectionHeading
                  icon={MapPin}
                  title="Service location"
                  subtitle="Pin the exact spot on the map, then confirm the address."
                />
                <ClientOnly
                  fallback={<div className="h-64 rounded-lg border border-dashed border-border" />}
                >
                  <LocationPicker value={location} onChange={setLocation} />
                </ClientOnly>

                <Field label="Street address" id="formattedAddress" required>
                  <Input
                    id="formattedAddress"
                    required
                    placeholder="123 Kampala Road"
                    value={form.formattedAddress}
                    onChange={(e) => update("formattedAddress", e.target.value)}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" id="city" required>
                    <Input
                      id="city"
                      required
                      placeholder="Kampala"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </Field>
                  <Field label="District" id="district">
                    <Input
                      id="district"
                      placeholder="Kampala"
                      value={form.district}
                      onChange={(e) => update("district", e.target.value)}
                    />
                  </Field>
                </div>
              </section>
            )}

            {step === "contact" && (
              <section className="space-y-4">
                <SectionHeading
                  icon={Phone}
                  title="Contact & scheduling"
                  subtitle="Who should the provider reach, and when works best?"
                />

                <Field label="Contact person" id="contactPerson" required>
                  <Input
                    id="contactPerson"
                    required
                    placeholder="Jane Doe"
                    value={form.contactPerson}
                    onChange={(e) => update("contactPerson", e.target.value)}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone" id="contactPhone" required>
                    <Input
                      id="contactPhone"
                      type="tel"
                      required
                      placeholder="+256700000000"
                      value={form.contactPhone}
                      onChange={(e) => update("contactPhone", e.target.value)}
                    />
                  </Field>
                  <Field label="Alternate phone" id="contactAlternatePhone">
                    <Input
                      id="contactAlternatePhone"
                      type="tel"
                      placeholder="Optional"
                      value={form.contactAlternatePhone}
                      onChange={(e) => update("contactAlternatePhone", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Email" id="contactEmail" required>
                  <Input
                    id="contactEmail"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred date" id="preferredDate" hint="Optional">
                    <Input
                      id="preferredDate"
                      type="date"
                      min={todayInput()}
                      value={form.preferredDate}
                      onChange={(e) => update("preferredDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Preferred time" id="preferredTime" hint="Optional">
                    <Input
                      id="preferredTime"
                      type="time"
                      value={form.preferredTime}
                      onChange={(e) => update("preferredTime", e.target.value)}
                    />
                  </Field>
                </div>
              </section>
            )}

            {step === "review" && (
              <section className="space-y-5">
                <SectionHeading
                  icon={ClipboardCheck}
                  title="Assignment & review"
                  subtitle="Choose how providers are matched, then confirm your details."
                />

                <div className="space-y-3">
                  <Label>Provider assignment</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <AssignmentOption
                      active={form.assignmentType === "platform_assigned"}
                      title="Platform matched"
                      body="We'll assign the best available provider."
                      onClick={() => {
                        update("assignmentType", "platform_assigned");
                        update("preferredProviderId", "");
                      }}
                    />
                    <AssignmentOption
                      active={form.assignmentType === "customer_selected"}
                      title="Choose a provider"
                      body="Pick a specific provider from the marketplace."
                      onClick={() => update("assignmentType", "customer_selected")}
                    />
                  </div>

                  {form.assignmentType === "customer_selected" && (
                    <Field label="Preferred provider" id="preferredProvider" required>
                      <Select
                        value={form.preferredProviderId}
                        onValueChange={(v) => update("preferredProviderId", v)}
                      >
                        <SelectTrigger id="preferredProvider">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.business_name}
                              {p.city ? ` · ${p.city}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </div>

                <dl className="divide-y divide-border rounded-lg border border-border">
                  <ReviewRow label="Category" value={categoryName} />
                  <ReviewRow label="Priority" value={prettify(form.priority)} />
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow label="Description" value={form.description} />
                  {form.estimatedBudget && (
                    <ReviewRow
                      label="Budget"
                      value={`USh ${Number(form.estimatedBudget).toLocaleString()}`}
                    />
                  )}
                  <ReviewRow
                    label="Location"
                    value={[form.formattedAddress, form.city, form.district]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  {location && (
                    <ReviewRow
                      label="Coordinates"
                      value={`${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
                    />
                  )}
                  <ReviewRow label="Contact" value={form.contactPerson} />
                  <ReviewRow label="Phone" value={form.contactPhone} />
                  <ReviewRow label="Email" value={form.contactEmail} />
                  {(form.preferredDate || form.preferredTime) && (
                    <ReviewRow
                      label="Preferred slot"
                      value={
                        [form.preferredDate, form.preferredTime].filter(Boolean).join(" at ") ||
                        "—"
                      }
                    />
                  )}
                  <ReviewRow
                    label="Assignment"
                    value={
                      form.assignmentType === "platform_assigned"
                        ? "Platform matched"
                        : selectedProvider?.business_name ?? "Provider selected"
                    }
                  />
                </dl>

                <p className="text-xs text-muted-foreground">
                  Photos can be added after submission from your request details.
                </p>
              </section>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={stepIndex === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              {stepIndex < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep} disabled={categoriesLoading}>
                  Continue
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitting || !user}
                  onClick={() => {
                    if (!user) {
                      navigate({
                        to: "/marketplace/sign-in",
                        search: { redirect: "/marketplace/request" } as never,
                      });
                      return;
                    }
                    const check = validateStep("review", form, location);
                    if (!check.ok || !location) {
                      setError(check.message ?? "Complete all required fields.");
                      return;
                    }
                    void submitRequest();
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit request
                      <Check className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function validateStep(
  step: Step,
  form: RequestForm,
  location: PickedLocation | null,
): { ok: boolean; message?: string } {
  switch (step) {
    case "job":
      if (!form.serviceCategoryId) return { ok: false, message: "Select a service category." };
      if (form.title.trim().length < 3)
        return { ok: false, message: "Title must be at least 3 characters." };
      if (form.description.trim().length < 10)
        return { ok: false, message: "Description must be at least 10 characters." };
      return { ok: true };
    case "location":
      if (!location) return { ok: false, message: "Pin your location on the map." };
      if (!form.formattedAddress.trim())
        return { ok: false, message: "Enter a street address." };
      if (!form.city.trim()) return { ok: false, message: "Enter a city." };
      return { ok: true };
    case "contact":
      if (!form.contactPerson.trim())
        return { ok: false, message: "Enter a contact person." };
      if (!form.contactPhone.trim()) return { ok: false, message: "Enter a phone number." };
      if (!form.contactEmail.trim() || !form.contactEmail.includes("@"))
        return { ok: false, message: "Enter a valid email address." };
      return { ok: true };
    case "review":
      if (form.assignmentType === "customer_selected" && !form.preferredProviderId)
        return { ok: false, message: "Select a preferred provider." };
      return validateStep("job", form, location).ok &&
        validateStep("location", form, location).ok &&
        validateStep("contact", form, location).ok
        ? { ok: true }
        : { ok: false, message: "Some required fields are missing." };
    default:
      return { ok: true };
  }
}

function Stepper({
  stepIndex,
  onJump,
}: {
  stepIndex: number;
  onJump: (index: number) => void;
}) {
  const labels = ["Job", "Location", "Contact", "Review"];
  const icons = [Wrench, MapPin, Phone, ClipboardCheck];

  return (
    <ol className="mt-5 flex gap-1 sm:gap-2">
      {labels.map((label, i) => {
        const Icon = icons[i];
        const active = stepIndex === i;
        const done = stepIndex > i;
        return (
          <li key={label} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i > stepIndex}
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 text-center transition-colors sm:px-2",
                active && "bg-primary/10",
                i > stepIndex && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  done || active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight sm:text-xs",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Wrench;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function AssignmentOption({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-4 py-3 text-left transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
    >
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[120px_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

function Field({
  label,
  id,
  hint,
  required,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function prettify(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function todayInput(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatApiTime(value: string): string {
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
}

function formatApiMoney(value: string): string {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return value;
  return n.toFixed(2);
}
