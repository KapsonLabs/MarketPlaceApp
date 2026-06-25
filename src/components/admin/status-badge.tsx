import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  RequestStatus,
  Priority,
  ProviderStatus,
  TaskStatus,
  PaymentStatus,
} from "@/lib/admin/mock-data";

const requestTone: Record<RequestStatus, string> = {
  Open: "bg-warning/15 text-warning-foreground border-warning/40",
  Triaged: "bg-primary/10 text-primary border-primary/30",
  Assessing: "bg-accent text-accent-foreground border-accent/60",
  Assigned: "bg-primary/15 text-primary border-primary/40",
  InProgress: "bg-accent text-accent-foreground border-accent/60",
  Completed: "bg-success/15 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

const priorityTone: Record<Priority, string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Normal: "bg-secondary text-secondary-foreground border-border",
  High: "bg-warning/20 text-warning-foreground border-warning/40",
  Emergency: "bg-destructive/15 text-destructive border-destructive/40",
};

const providerTone: Record<ProviderStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Active: "bg-success/15 text-success border-success/40",
  Suspended: "bg-destructive/15 text-destructive border-destructive/40",
};

const taskTone: Record<TaskStatus, string> = {
  Todo: "bg-muted text-muted-foreground border-border",
  InProgress: "bg-primary/15 text-primary border-primary/40",
  Blocked: "bg-destructive/15 text-destructive border-destructive/40",
  Done: "bg-success/15 text-success border-success/40",
};

const paymentTone: Record<PaymentStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Approved: "bg-primary/15 text-primary border-primary/40",
  Paid: "bg-success/15 text-success border-success/40",
  Disputed: "bg-destructive/15 text-destructive border-destructive/40",
};

export function StatusBadge({
  kind,
  value,
}: {
  kind: "request" | "priority" | "provider" | "task" | "payment";
  value: string;
}) {
  const map =
    kind === "request"
      ? requestTone
      : kind === "priority"
        ? priorityTone
        : kind === "provider"
          ? providerTone
          : kind === "task"
            ? taskTone
            : paymentTone;
  const cls = (map as Record<string, string>)[value] ?? "";
  return (
    <Badge variant="outline" className={cn("font-medium", cls)}>
      {value}
    </Badge>
  );
}
