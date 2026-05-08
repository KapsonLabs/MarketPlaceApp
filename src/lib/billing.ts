import type { ForwardedMaintenanceRequest, RequestStatus } from "@/lib/request-types";

export type BillingStatus = "Estimate" | "Pending" | "PartiallyPaid" | "Paid" | "Cancelled";

export interface BillingLineItem {
  label: string;
  amount: number;
}

export interface BillingRecord {
  id: string;
  requestId: string;
  title: string;
  status: BillingStatus;
  issuedAt: string;
  dueAt: string;
  total: number;
  paidAmount: number;
  balance: number;
  lineItems: BillingLineItem[];
}

const BASE_CATEGORY_PRICING: Record<ForwardedMaintenanceRequest["category"], number> = {
  Plumbing: 90000,
  Electrical: 120000,
  HVAC: 180000,
  Appliance: 110000,
  Structural: 220000,
  Other: 80000,
};

const PRIORITY_SURCHARGE: Record<ForwardedMaintenanceRequest["priority"], number> = {
  Low: 0,
  Medium: 15000,
  High: 35000,
  Emergency: 75000,
};

export function deriveBillingStatus(
  requestStatus: RequestStatus,
  paidAmount: number,
  total: number,
): BillingStatus {
  if (requestStatus === "Cancelled") return "Cancelled";
  if (requestStatus === "Open" || requestStatus === "Triaged") return "Estimate";
  // Job is assigned or further — payment is now expected
  if (paidAmount >= total) return "Paid";
  if (paidAmount > 0) return "PartiallyPaid";
  return "Pending";
}

export function deriveBillingRecord(
  request: ForwardedMaintenanceRequest,
  paidAmount = 0,
): BillingRecord {
  const serviceVisit = BASE_CATEGORY_PRICING[request.category];
  const priorityFee = PRIORITY_SURCHARGE[request.priority];
  const marketplaceFee = Math.round(serviceVisit * 0.08);
  const materialsAllowance = request.preferredProviderId ? 30000 : 18000;
  const total = serviceVisit + priorityFee + marketplaceFee + materialsAllowance;
  const clamped = Math.min(paidAmount, total);
  const status = deriveBillingStatus(request.status, clamped, total);

  return {
    id: `inv-${request.id}`,
    requestId: request.id,
    title: request.title,
    status,
    issuedAt: request.updatedAt,
    dueAt: new Date(new Date(request.updatedAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    total,
    paidAmount: clamped,
    balance: total - clamped,
    lineItems: [
      { label: `${request.category} service visit`, amount: serviceVisit },
      { label: `${request.priority} priority handling`, amount: priorityFee },
      { label: "Marketplace coordination fee", amount: marketplaceFee },
      { label: "Materials allowance", amount: materialsAllowance },
    ].filter((item) => item.amount > 0),
  };
}

export const REQUEST_PROGRESS_STEPS: RequestStatus[] = [
  "Open",
  "Triaged",
  "Assigned",
  "InProgress",
  "Completed",
];
