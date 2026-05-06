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

export function deriveBillingStatus(requestStatus: RequestStatus): BillingStatus {
  switch (requestStatus) {
    case "Open":
    case "Triaged":
      return "Estimate";
    case "Assigned":
      return "Pending";
    case "InProgress":
      return "PartiallyPaid";
    case "Completed":
      return "Paid";
    case "Cancelled":
      return "Cancelled";
  }
}

export function deriveBillingRecord(request: ForwardedMaintenanceRequest): BillingRecord {
  const serviceVisit = BASE_CATEGORY_PRICING[request.category];
  const priorityFee = PRIORITY_SURCHARGE[request.priority];
  const marketplaceFee = Math.round(serviceVisit * 0.08);
  const materialsAllowance = request.preferredProviderId ? 30000 : 18000;
  const total = serviceVisit + priorityFee + marketplaceFee + materialsAllowance;
  const status = deriveBillingStatus(request.status);
  const paidAmount =
    status === "Paid" ? total : status === "PartiallyPaid" ? Math.round(total * 0.4) : 0;

  return {
    id: `inv-${request.id}`,
    requestId: request.id,
    title: request.title,
    status,
    issuedAt: request.updatedAt,
    dueAt: new Date(new Date(request.updatedAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    total,
    paidAmount,
    balance: total - paidAmount,
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
