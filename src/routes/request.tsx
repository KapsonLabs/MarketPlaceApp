import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, ArrowRight, Upload, X, MapPin, User } from "lucide-react";
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
import { specialties, getProvider } from "@/data/providers";
import { submitRequest } from "@/server/requests.functions";
import { useCurrentUser } from "@/lib/current-user";
import { ClientOnly } from "@tanstack/react-router";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PHOTOS = 5;

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

  const [form, setForm] = useState({
    specialty: search.specialty ?? preferred?.specialty ?? "Plumbing",
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High" | "Emergency",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!location) {
      setError("Please share your location or drop a pin on the map.");
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
        },
      });
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Request a service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us what you need. We'll route it to the right pro and, if you're a
            tenant, log it into your property's maintenance queue.
          </p>

          {preferred && (
            <Card className="mt-6 border-primary/40 bg-primary/5">
              <CardContent className="flex items-center justify-between p-4">
                <div>
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
            {/* Audience */}
            <Card className="border-border">
              <CardContent className="p-6">
                <Label className="text-sm font-semibold">I am a…</Label>
                <RadioGroup
                  value={audience}
                  onValueChange={(v) => setAudience(v as Audience)}
                  className="mt-3 grid gap-3 sm:grid-cols-2"
                >
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="tenant" id="aud-tenant" />
                    <div>
                      <p className="font-medium text-foreground">Tenant</p>
                      <p className="text-xs text-muted-foreground">
                        I rent a unit in a managed property.
                      </p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="public" id="aud-public" />
                    <div>
                      <p className="font-medium text-foreground">Homeowner / public</p>
                      <p className="text-xs text-muted-foreground">
                        I just need a pro at my address.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-border">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-foreground">Your details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" id="name">
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Email" id="email">
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Phone" id="phone">
                    <Input
                      id="phone"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </Field>
                  <Field label="Service address" id="address">
                    <Input
                      id="address"
                      required
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </Field>
                </div>
                {audience === "tenant" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Property code" id="propcode" hint="e.g. PROP-002">
                      <Input
                        id="propcode"
                        value={form.propertyCode}
                        onChange={(e) => update("propertyCode", e.target.value)}
                      />
                    </Field>
                    <Field label="Unit number" id="unitno">
                      <Input
                        id="unitno"
                        value={form.unitNumber}
                        onChange={(e) => update("unitNumber", e.target.value)}
                      />
                    </Field>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job */}
            <Card className="border-border">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-foreground">The job</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Service type" id="specialty">
                    <Select
                      value={form.specialty}
                      onValueChange={(v) => update("specialty", v)}
                    >
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
                      onValueChange={(v) =>
                        update("priority", v as typeof form.priority)
                      }
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

                <div className="space-y-2">
                  <Label htmlFor="photos">Photos (optional)</Label>
                  <label
                    htmlFor="photos"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center transition-colors hover:border-primary"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      Click to upload photos
                    </p>
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
                  {photoError && (
                    <p className="text-xs text-destructive">{photoError}</p>
                  )}
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
                </div>
              </CardContent>
            </Card>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Submit request <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
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