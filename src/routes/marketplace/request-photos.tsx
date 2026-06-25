import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { AxiosError } from "axios";
import { z } from "zod";
import { CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadServiceRequestAttachment } from "@/lib/service-requests.api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const searchSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
});

export const Route = createFileRoute("/marketplace/request-photos")({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.id) {
      throw redirect({ to: "/marketplace/requests" });
    }
  },
  head: () => ({ meta: [{ title: "Add photos — Casmara Systems" }] }),
  component: RequestPhotosPage,
});

function RequestPhotosPage() {
  const { id, title } = Route.useSearch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function resetPreview() {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  function clearFile() {
    resetPreview();
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileSelect(selected: File | null) {
    resetPreview();
    setFile(null);
    setError(null);
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function goToRequests() {
    void navigate({ to: "/marketplace/requests", replace: true });
  }

  async function handleUpload() {
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    if (!caption.trim()) {
      setError("Add a short caption describing the photo.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadServiceRequestAttachment(id, file, caption.trim());
      goToRequests();
    } catch (err) {
      const axiosError = err as AxiosError & { uiMessage?: string };
      setError(
        axiosError.uiMessage ??
          (err instanceof Error ? err.message : "Could not upload the image. Try again."),
      );
      setUploading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto max-w-lg px-4 py-6 sm:py-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Request submitted
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {title ? `"${title}"` : "Your job"} is in the queue. Add a photo to help
                  providers assess the issue faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-lg px-4 py-6 sm:py-8">
          <section className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-foreground">Attach a photo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a clear image of the problem area. Providers use this to quote and prepare
                before visiting.
              </p>
            </div>

            {!file ? (
              <label
                htmlFor="attachment"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tap to choose a photo</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or WebP · up to 5 MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id="attachment"
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    handleFileSelect(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              </label>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src={previewUrl!}
                    alt="Selected attachment preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="border-t border-border p-4">
                  <p className="truncate text-xs text-muted-foreground">{file.name}</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={2}
                placeholder="e.g. Image of leaking tap under the sink"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="ghost" onClick={goToRequests} disabled={uploading}>
                Skip for now
              </Button>
              <Button
                type="button"
                onClick={() => void handleUpload()}
                disabled={uploading || !file}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    Upload photo
                    <Upload className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Skip now and add photos later from{" "}
              <Link to="/marketplace/requests" className="font-medium text-primary hover:underline">
                My requests
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
