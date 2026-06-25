import type { ServiceRequestListItem } from "@/lib/service-requests.api";

export function parseAmount(value: string | null | undefined): number {
  if (!value) return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(amount: number | string | null | undefined, compact = false): string {
  const n = typeof amount === "number" ? amount : parseAmount(amount);
  if (compact && n >= 1_000_000) return `USh ${(n / 1_000_000).toFixed(1)}M`;
  if (compact && n >= 100_000) return `USh ${Math.round(n / 1000)}K`;
  return `USh ${Math.round(n).toLocaleString()}`;
}

export function requestTotal(request: ServiceRequestListItem): number {
  const cost = parseAmount(request.estimated_cost);
  if (cost > 0) return cost;
  return parseAmount(request.estimated_budget);
}

export function requestBalance(request: ServiceRequestListItem): number {
  const total = requestTotal(request);
  const paid = parseAmount(request.amount_paid);
  if (request.payment_status === "paid") return 0;
  return Math.max(total - paid, 0);
}

export function prettify(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  return value;
}

export const PROGRESS_STEPS = [
  { key: "submitted", label: "Submitted", short: "Sent" },
  { key: "approved", label: "Approved", short: "Approved" },
  { key: "awaiting_assignment", label: "Deposit & queue", short: "Deposit" },
  { key: "assigned", label: "Assigned", short: "Match" },
  { key: "in_progress", label: "In progress", short: "Work" },
  { key: "completed", label: "Completed", short: "Done" },
] as const;

export const STATUS_ORDER: Record<string, number> = {
  submitted: 0,
  approved: 1,
  awaiting_assignment: 2,
  assigned: 3,
  accepted: 3,
  in_progress: 4,
  on_hold: 4,
  completed: 5,
  rejected: -1,
  cancelled: -1,
};

export function isTerminalStatus(status: string): boolean {
  return status === "rejected" || status === "cancelled";
}
