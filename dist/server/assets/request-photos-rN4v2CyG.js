import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CheckCircle2, ImagePlus, X, Loader2, Upload } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { T as Textarea } from "./textarea-DOyZGKZq.js";
import { u as uploadServiceRequestAttachment } from "./service-requests.api-K3cgLLXa.js";
import { b as Route } from "./router-rAJgq2Yd.js";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
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
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
function RequestPhotosPage() {
  const {
    id,
    title
  } = Route.useSearch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(null);
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
  function handleFileSelect(selected) {
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
    void navigate({
      to: "/marketplace/requests",
      replace: true
    });
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
      const axiosError = err;
      setError(axiosError.uiMessage ?? (err instanceof Error ? err.message : "Could not upload the image. Try again."));
      setUploading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-border bg-muted/20", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-lg px-4 py-6 sm:py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-foreground sm:text-2xl", children: "Request submitted" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            title ? `"${title}"` : "Your job",
            " is in the queue. Add a photo to help providers assess the issue faster."
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-lg px-4 py-6 sm:py-8", children: /* @__PURE__ */ jsxs("section", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-foreground", children: "Attach a photo" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Upload a clear image of the problem area. Providers use this to quote and prepare before visiting." })
        ] }),
        !file ? /* @__PURE__ */ jsxs("label", { htmlFor: "attachment", className: "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center transition-colors hover:border-primary hover:bg-primary/5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(ImagePlus, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Tap to choose a photo" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "JPG, PNG or WebP · up to 5 MB" })
          ] }),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, id: "attachment", type: "file", accept: ACCEPTED_TYPES.join(","), className: "hidden", onChange: (e) => {
            handleFileSelect(e.target.files?.[0] ?? null);
            e.target.value = "";
          } })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/3] bg-muted", children: [
            /* @__PURE__ */ jsx("img", { src: previewUrl, alt: "Selected attachment preview", className: "h-full w-full object-cover" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: clearFile, className: "absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow", "aria-label": "Remove image", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border p-4", children: /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-muted-foreground", children: file.name }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "caption", children: "Caption" }),
          /* @__PURE__ */ jsx(Textarea, { id: "caption", rows: 2, placeholder: "e.g. Image of leaking tap under the sink", value: caption, onChange: (e) => setCaption(e.target.value) })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:justify-between", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: goToRequests, disabled: uploading, children: "Skip for now" }),
          /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => void handleUpload(), disabled: uploading || !file, children: uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-4 w-4 animate-spin" }),
            "Uploading…"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Upload photo",
            /* @__PURE__ */ jsx(Upload, { className: "ml-1 h-4 w-4" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
          "Skip now and add photos later from",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/marketplace/requests", className: "font-medium text-primary hover:underline", children: "My requests" }),
          "."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  RequestPhotosPage as component
};
