import type { ForwardedMaintenanceRequest, RequestStatus } from "@/lib/marketplace/request-types";

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
  assessmentFee: number;
  workTotal: number;
  lineItems: BillingLineItem[];
}

/** Flat, non-refundable assessment fee charged upfront on every request. */
export const ASSESSMENT_FEE = 35000;

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
  const assessmentFee = ASSESSMENT_FEE;
  // Work invoice is only firmed up once the assessor has visited (status >= Assigned).
  const assessmentComplete =
    request.status === "Assigned" ||
    request.status === "InProgress" ||
    request.status === "Completed";
  const workTotal = assessmentComplete ? serviceVisit + priorityFee + marketplaceFee : 0;
  const total = assessmentFee + workTotal;
  const clamped = Math.min(paidAmount, total);
  const status = deriveBillingStatus(request.status, clamped, total);

  const lineItems: BillingLineItem[] = [
    { label: "Assessment fee (non-refundable)", amount: assessmentFee },
  ];
  if (assessmentComplete) {
    lineItems.push(
      { label: `${request.category} service visit`, amount: serviceVisit },
      { label: `${request.priority} priority handling`, amount: priorityFee },
      { label: "Marketplace coordination fee", amount: marketplaceFee },
    );
  }

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
    assessmentFee,
    workTotal,
    lineItems: lineItems.filter((item) => item.amount > 0),
  };
}

export const REQUEST_PROGRESS_STEPS: RequestStatus[] = [
  "Open",
  "Triaged",
  "Assigned",
  "InProgress",
  "Completed",
];

/** Human labels for each lifecycle stage in the new workflow. */
export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  Open: "Assessment requested",
  Triaged: "Assessor dispatched",
  Assigned: "Provider assigned",
  InProgress: "Work in progress",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export const REQUEST_STATUS_HINT: Record<RequestStatus, string> = {
  Open: "Pay assessment fee to dispatch an assessor.",
  Triaged: "Assessor is scoping the job. Work invoice coming next.",
  Assigned: "Invoice issued. Service provider assigned to the job.",
  InProgress: "Provider is on-site delivering the work.",
  Completed: "Job complete — pay the remaining balance to close.",
  Cancelled: "This job was cancelled.",
};
