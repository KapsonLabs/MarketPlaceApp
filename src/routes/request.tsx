import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  MapPin,
  User,
  LockKeyhole,
  Wrench,
  ClipboardCheck,
  Check,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { specialties, getProvider, providerCover } from "@/data/providers";
import { submitRequest } from "@/lib/requests.functions";
import { useCurrentUser } from "@/lib/current-user";
import { ClientOnly } from "@tanstack/react-router";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";
import type { RequestStepHistoryEntry, RequestWizardStep } from "@/lib/request-types";
import { ASSESSMENT_FEE } from "@/lib/billing";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PHOTOS = 5;
const DRAFT_KEY = "casmara.request.draft.v1";
const STEP_NAMES: RequestWizardStep[] = ["job", "location", "review", "submitted"];

interface UploadedPhoto {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

const searchSchema = z.object({
  providerId: z.string().optional(),
  specialty: z.string().optional(),
});

export const Route = createFileRoute("/request")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Request a service — Casmara Systems" },
      {
        name: "description",
        content:
          "Submit a maintenance request. Tenants get routed into their property's maintenance queue automatically.",
      },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const preferred = search.providerId ? getProvider(search.providerId) : undefined;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [stepHistory, setStepHistory] = useState<RequestStepHistoryEntry[]>(() => [
    { step: "job", at: new Date().toISOString() },
  ]);
  const [resumed, setResumed] = useState(false);

  // Min value for the datetime-local input (now, rounded to the minute, in local time).
  function localNowForInput(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  const minScheduledFor = localNowForInput();

  const [form, setForm] = useState({
    specialty: search.specialty ?? preferred?.specialty ?? "Plumbing",
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High" | "Emergency",
    scheduledFor: "" as string,
  });

  // Hydrate draft on mount (client-only).
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as {
        form?: typeof form;
        step?: 0 | 1 | 2;
        location?: PickedLocation | null;
        photos?: UploadedPhoto[];
        stepHistory?: RequestStepHistoryEntry[];
      };
      if (d.form) setForm(d.form);
      if (typeof d.step === "number") setStep(d.step);
      if (d.location) setLocation(d.location);
      if (d.photos) setPhotos(d.photos);
      if (d.stepHistory) setStepHistory(d.stepHistory);
      setResumed(true);
    } catch {
      // ignore corrupt draft
    }
  }, []);

  // Auto-save draft on changes.
  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ form, step, location, photos, stepHistory }),
      );
    } catch {
      // storage may be full or unavailable
    }
  }, [form, step, location, photos, stepHistory]);

  function recordStep(next: 0 | 1 | 2) {
    const stepName = STEP_NAMES[next];
    setStepHistory((h) =>
      h.some((e) => e.step === stepName)
        ? h
        : [...h, { step: stepName, at: new Date().toISOString() }],
    );
  }

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const scheduledInPast = (() => {
    if (!form.scheduledFor) return false;
    const t = Date.parse(form.scheduledFor);
    if (Number.isNaN(t)) return true;
    return t < Date.now() - 60_000;
  })();

  const stepValid =
    step === 0
      ? form.title.trim().length >= 3 &&
        form.description.trim().length >= 10 &&
        !scheduledInPast
      : step === 1
        ? !!location
        : true;

  function nextStep() {
    setError(null);
    if (!stepValid) {
      setError(
        step === 0
          ? scheduledInPast
            ? "Scheduled date can't be in the past. Pick a future date and time."
            : "Add a short title and a description (10+ characters)."
          : "Share your location or drop a pin to continue.",
      );
      return;
    }
    setStep((s) => {
      const ns = (s < 2 ? s + 1 : s) as 0 | 1 | 2;
      recordStep(ns);
      return ns;
    });
  }
  function prevStep() {
    setError(null);
    setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : s));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      navigate({ to: "/sign-in", search: { redirect: "/request" } as never });
      return;
    }
    if (!location) {
      setError("Please share your location or drop a pin on the map.");
      return;
    }
    if (scheduledInPast) {
      setError("Scheduled date can't be in the past. Pick a future date and time.");
      setStep(0);
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitRequest({
        data: {
          audience: user.audience,
          userId: user.id,
          propertyCode: user.propertyCode,
          unitNumber: user.unitNumber,
          specialty: form.specialty as never,
          title: form.title,
          description: form.description,
          priority: form.priority,
          preferredProviderId: preferred?.id,
          photos,
          location: {
            lat: location.lat,
            lng: location.lng,
            accuracy: location.accuracy,
          },
          scheduledFor: form.scheduledFor
            ? new Date(form.scheduledFor).toISOString()
            : undefined,
          wizardStep: "submitted",
          stepHistory,
        },
      });
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // ignore
        }
      }
      navigate({
        to: "/request/success",
        search: { id: res.id } as never,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setPhotoError(null);
    const next: UploadedPhoto[] = [...photos];
    for (const file of Array.from(files)) {
      if (next.length >= MAX_PHOTOS) {
        setPhotoError(`You can upload up to ${MAX_PHOTOS} photos.`);
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setPhotoError(`"${file.name}" is not a supported image (JPG, PNG, WebP).`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setPhotoError(`"${file.name}" exceeds the 5 MB limit.`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        next.push({ name: file.name, type: file.type, size: file.size, dataUrl });
      } catch {
        setPhotoError(`Could not read "${file.name}".`);
      }
    }
    setPhotos(next);
  }

  function removePhoto(idx: number) {
    setPhotos((p) => p.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Request a service</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us what you need. We'll route it to the right pro and, if you're a tenant, log it
            into your property's maintenance queue.
          </p>

          <Stepper step={step} history={stepHistory} onJump={(i) => {
            // allow jumping back to any previously visited step
            const visited = stepHistory.some((e) => e.step === STEP_NAMES[i]);
            if (visited && i <= 2) {
              setStep(i as 0 | 1 | 2);
              setError(null);
            }
          }} />

          {resumed && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
              <span className="text-foreground">
                Resumed your saved draft from this device.
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem(DRAFT_KEY);
                  }
                  setResumed(false);
                  setForm({
                    specialty: search.specialty ?? preferred?.specialty ?? "Plumbing",
                    title: "",
                    description: "",
                    priority: "Medium",
                    scheduledFor: "",
                  });
                  setLocation(null);
                  setPhotos([]);
                  setStep(0);
                  setStepHistory([{ step: "job", at: new Date().toISOString() }]);
                }}
              >
                Discard draft
              </Button>
            </div>
          )}

          {!user && (
            <Card className="mt-6 border-primary/40 bg-primary/5">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sign in to continue</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign in with your marketplace account before a provider can be assigned at a
                      fee.
                    </p>
                  </div>
                </div>
                <Button asChild className="shrink-0">
                  <Link to="/sign-in" search={{ redirect: "/request" } as never}>
                    Sign in
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {preferred && (
            <Card className="mt-6 border-primary/40 bg-primary/5">
              <CardContent className="flex items-center gap-4 p-4">
                <img
                  src={providerCover(preferred)}
                  alt={preferred.company}
                  className="h-12 w-16 rounded-md object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Requested provider</p>
                  <p className="font-semibold text-foreground">{preferred.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {preferred.specialty} • {preferred.city}
                </span>
              </CardContent>
            </Card>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-8">
            {/* Signed-in user */}
            <Card className="border-border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  {user ? (
                    <>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                        {user.audience === "tenant" && user.propertyCode && (
                          <>
                            {" "}
                            • {user.propertyCode} / Unit {user.unitNumber}
                          </>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">Guest user</p>
                      <p className="text-xs text-muted-foreground">
                        Sign in before submitting this service request.
                      </p>
                    </>
                  )}
                </div>
                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {user?.audience ?? "guest"}
                </span>
              </CardContent>
            </Card>

            {/* Step 0 — Job */}
            {step === 0 && (
            <Card className="border-border">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-foreground">The job</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Service type" id="specialty">
                    <Select value={form.specialty} onValueChange={(v) => update("specialty", v)}>
                      <SelectTrigger id="specialty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Priority" id="priority">
                    <Select
                      value={form.priority}
                      onValueChange={(v) => update("priority", v as typeof form.priority)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["Low", "Medium", "High", "Emergency"] as const).map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="Title" id="title" hint="A short summary, e.g. 'Kitchen tap leaking'">
                  <Input
                    id="title"
                    required
                    minLength={3}
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </Field>
                <Field label="Describe the issue" id="desc">
                  <Textarea
                    id="desc"
                    required
                    minLength={10}
                    rows={5}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </Field>
                <Field
                  label="Schedule assessment (optional)"
                  id="scheduledFor"
                  hint="Leave empty to have an assessor dispatched as soon as possible."
                >
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={form.scheduledFor}
                    onChange={(e) => update("scheduledFor", e.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>
            )}

            {/* Step 1 — Location & photos */}
            {step === 1 && (
            <>
            <Card className="border-border">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Service location</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  We use your coordinates to dispatch the nearest provider.
                </p>
                <ClientOnly
                  fallback={<div className="h-72 rounded-lg border border-dashed border-border" />}
                >
                  <LocationPicker value={location} onChange={setLocation} />
                </ClientOnly>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="space-y-2 p-6">
                  <Label htmlFor="photos">Photos (optional)</Label>
                  <label
                    htmlFor="photos"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center transition-colors hover:border-primary"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Click to upload photos</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or WebP — up to 5 MB each, max {MAX_PHOTOS} photos
                    </p>
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept={ACCEPTED_TYPES.join(",")}
                      className="hidden"
                      onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {photoError && <p className="text-xs text-destructive">{photoError}</p>}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {photos.map((p, i) => (
                        <div
                          key={i}
                          className="group relative aspect-square overflow-hidden rounded-md border border-border"
                        >
                          <img
                            src={p.dataUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label={`Remove ${p.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>
            </>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <Card className="border-border">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Review your request</h2>
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <ReviewRow label="Service" value={form.specialty} />
                    <ReviewRow label="Priority" value={form.priority} />
                    <ReviewRow label="Title" value={form.title || "—"} />
                    <ReviewRow
                      label="Provider"
                      value={preferred ? preferred.company : "Auto-match"}
                    />
                    <ReviewRow
                      label="Assessment"
                      value={
                        form.scheduledFor
                          ? `Scheduled for ${new Date(form.scheduledFor).toLocaleString()}`
                          : "Dispatch as soon as possible"
                      }
                    />
                    <ReviewRow
                      label="Location"
                      value={
                        location
                          ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                          : "—"
                      }
                      full
                    />
                    <ReviewRow label="Description" value={form.description || "—"} full />
                  </dl>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                    <p className="font-semibold text-foreground">
                      How billing works
                    </p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                      <li>
                        A non-refundable assessment fee of{" "}
                        <span className="font-medium text-foreground">
                          USh {ASSESSMENT_FEE.toLocaleString()}
                        </span>{" "}
                        is charged on submit. An assessor is then dispatched.
                      </li>
                      <li>
                        After the visit, a detailed work invoice is issued for your approval.
                      </li>
                      <li>
                        A vetted service provider is assigned and the job is tracked end-to-end.
                      </li>
                      <li>
                        You pay the remaining balance only once the work is completed.
                      </li>
                    </ol>
                  </div>
                  {photos.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Photos ({photos.length})
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {photos.map((p, i) => (
                          <img
                            key={i}
                            src={p.dataUrl}
                            alt={p.name}
                            className="aspect-square w-full rounded-md border border-border object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={prevStep}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              {step < 2 ? (
                <Button type="button" size="lg" onClick={nextStep}>
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="lg" disabled={submitting || !user || !location}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      Submit request <Check className="ml-1 h-4 w-4" />
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

function Stepper({
  step,
  history,
  onJump,
}: {
  step: 0 | 1 | 2;
  history: RequestStepHistoryEntry[];
  onJump: (i: number) => void;
}) {
  const steps = [
    { label: "Job details", icon: Wrench, key: "job" as const, hint: "What needs fixing" },
    { label: "Location & photos", icon: MapPin, key: "location" as const, hint: "Where & evidence" },
    { label: "Review & submit", icon: ClipboardCheck, key: "review" as const, hint: "Confirm & send" },
  ];

  const visitedIndex = (key: (typeof steps)[number]["key"]) =>
    history.findIndex((e) => e.step === key);

  // Furthest step reached so far (by stepHistory). 0..2 within the wizard.
  const furthest = steps.reduce(
    (max, s, i) => (visitedIndex(s.key) >= 0 ? Math.max(max, i) : max),
    0,
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mt-8">
      <ol className="relative grid grid-cols-3 gap-3">
        {/* connector line behind the circles */}
        <div
          className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-4 h-0.5 -translate-y-1/2 bg-border"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[16.66%] top-4 h-0.5 -translate-y-1/2 bg-primary transition-all"
          style={{ width: `${(furthest / 2) * 66.66}%` }}
          aria-hidden
        />
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = step === i;
          const done = furthest > i;
          const visited = visitedIndex(s.key) >= 0;
          const lastSeen = visited ? history.filter((h) => h.step === s.key).at(-1) : undefined;
          const isLastReached = furthest === i && !active;

          return (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={!visited}
                aria-current={active ? "step" : undefined}
                className={
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : done
                      ? "border-primary bg-primary text-primary-foreground"
                      : visited
                        ? "border-primary/50 bg-background text-primary"
                        : "border-border bg-background text-muted-foreground") +
                  (visited ? " cursor-pointer hover:scale-105" : " cursor-not-allowed")
                }
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </button>
              <div className="mt-2 space-y-0.5">
                <p
                  className={
                    "text-xs font-semibold " +
                    (active || done ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {i + 1}. {s.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.hint}</p>
                {lastSeen && (
                  <p className="text-[11px] text-muted-foreground/80">
                    {active ? "On this step" : `Reached ${fmt(lastSeen.at)}`}
                  </p>
                )}
                {isLastReached && (
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    Last reached
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
