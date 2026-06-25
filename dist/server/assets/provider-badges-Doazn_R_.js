import { jsx } from "react/jsx-runtime";
import { B as Badge } from "./badge-BAnpIKa2.js";
import { c as cn } from "./button-BmLZMIt9.js";
const tone = {
  // positive
  verified: "bg-success/15 text-success border-success/40",
  approved: "bg-success/15 text-success border-success/40",
  available: "bg-success/15 text-success border-success/40",
  active: "bg-success/15 text-success border-success/40",
  inactive: "bg-muted text-muted-foreground border-border",
  accepted: "bg-success/15 text-success border-success/40",
  declined: "bg-destructive/10 text-destructive border-destructive/40",
  // pending / neutral-warn
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  submitted: "bg-primary/10 text-primary border-primary/30",
  claimed: "bg-warning/15 text-warning-foreground border-warning/40",
  busy: "bg-warning/15 text-warning-foreground border-warning/40",
  beginner: "bg-muted text-muted-foreground border-border",
  intermediate: "bg-primary/10 text-primary border-primary/30",
  expert: "bg-success/15 text-success border-success/40",
  // service request statuses
  awaiting_assignment: "bg-warning/15 text-warning-foreground border-warning/40",
  assigned: "bg-primary/15 text-primary border-primary/40",
  in_progress: "bg-accent/15 text-accent border-accent/40",
  on_hold: "bg-warning/15 text-warning-foreground border-warning/40",
  normal: "bg-secondary text-secondary-foreground border-border",
  high: "bg-warning/20 text-warning-foreground border-warning/40",
  low: "bg-muted text-muted-foreground border-border",
  emergency: "bg-destructive/15 text-destructive border-destructive/40",
  completed: "bg-success/15 text-success border-success/40",
  cancelled: "bg-muted text-muted-foreground border-border",
  // payment statuses
  paid: "bg-success/15 text-success border-success/40",
  deposit_paid: "bg-primary/10 text-primary border-primary/30",
  unpaid: "bg-muted text-muted-foreground border-border",
  // negative
  rejected: "bg-destructive/10 text-destructive border-destructive/40",
  unavailable: "bg-muted text-muted-foreground border-border",
  none: "bg-muted text-muted-foreground border-border"
};
const STATUS_LABELS = {
  awaiting_assignment: "Assigning"
};
function prettify(value) {
  if (STATUS_LABELS[value]) return STATUS_LABELS[value];
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatStatusLabel(value) {
  return prettify(value);
}
function StatusBadge({
  value,
  className
}) {
  return /* @__PURE__ */ jsx(
    Badge,
    {
      variant: "outline",
      className: cn(tone[value] ?? "bg-muted text-muted-foreground border-border", className),
      children: prettify(value)
    }
  );
}
export {
  StatusBadge as S,
  formatStatusLabel as f
};
