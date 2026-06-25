import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  /** Dialog heading — can be a string or JSX. */
  title: React.ReactNode;
  /**
   * Body content. Strings and string arrays render as styled paragraphs.
   * Pass a JSX element (e.g. a form component) for complex interactions —
   * the component owns its own submit button and calls `handleClose` when done.
   */
  description?: string | string[] | React.ReactNode;
  /** Confirm-footer callback. Omit when the description contains its own submit logic. */
  action?: () => void;
  actionButtonLabel?: string;
  actionVariant?: "default" | "destructive";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ActionDialog({
  isOpen,
  handleClose,
  title,
  description,
  action,
  actionButtonLabel = "Confirm",
  actionVariant = "default",
  loading = false,
  size = "md",
}: ActionDialogProps) {
  const sizeClass = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-xl" }[size];

  const body = (() => {
    if (!description) return null;
    if (typeof description === "string") {
      return <p className="text-sm text-muted-foreground">{description}</p>;
    }
    if (Array.isArray(description)) {
      return (
        <div className="space-y-1">
          {description.map((d, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              {d}
            </p>
          ))}
        </div>
      );
    }
    return description;
  })();

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogPrimitive.Portal>
        {/* Backdrop — blur matches MUI reference */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/35 backdrop-blur-[4px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "duration-200",
          )}
        />

        {/* Panel */}
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-2xl border border-border bg-background shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-[0.98]",
            "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-2",
            "duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            sizeClass,
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Accessibility description (visually hidden) */}
          <DialogPrimitive.Description className="sr-only">
            {typeof title === "string" ? title : "Dialog"}
          </DialogPrimitive.Description>

          {/* ── Title bar ── */}
          {/* Primary accent line via ::after — mirrors the MUI TitleBar design */}
          <div className="relative flex items-start justify-between gap-4 bg-background px-6 pt-5 pb-4 after:absolute after:inset-x-6 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary">
            <DialogPrimitive.Title asChild>
              <h2 className="text-base font-bold leading-snug text-foreground">{title}</h2>
            </DialogPrimitive.Title>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-destructive hover:rotate-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ── */}
          {body && (
            <div className="bg-muted/30 px-6 py-5">{body}</div>
          )}

          {/* ── Footer (simple confirm-mode only) ── */}
          {action && (
            <div className="flex items-center justify-end gap-2 border-t border-border bg-background px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={actionVariant}
                onClick={action}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {actionButtonLabel}
              </Button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
