import {
  pushRequest,
  listRequests,
  updateRequestStatus,
  mapSpecialtyToCategory,
  addPayment,
  getTotalPaidForRequest,
  addReview,
  listProviderReviews,
} from "@/server/requests.server";
import type { PaymentRecord, RequestReview } from "@/lib/marketplace/request-types";
import { deriveBillingRecord } from "@/lib/marketplace/billing";
import type {
  ForwardedMaintenanceRequest,
  RequestWizardStep,
} from "@/lib/marketplace/request-types";
import type { BillingRecord } from "@/lib/marketplace/billing";
import type { Specialty } from "@/data/providers";

export async function submitRequest({ data }: { data: {
  audience: "tenant" | "public";
  userId: string;
  propertyCode?: string;
  unitNumber?: string;
  specialty: string;
  title: string;
  description: string;
  priority: string;
  preferredProviderId?: string;
  photos?: { name: string; type: string; size: number; dataUrl: string }[];
  location: { lat: number; lng: number; accuracy?: number; address?: string };
  scheduledFor?: string;
  wizardStep?: RequestWizardStep;
  stepHistory?: { step: RequestWizardStep; at: string }[];
} }) {
  const now = new Date().toISOString();
  const id = `mkt-${Date.now().toString(36)}`;
  const forwarded: ForwardedMaintenanceRequest = {
    id,
    propertyId: data.audience === "tenant" ? (data.propertyCode ?? null) : null,
    unitId: data.audience === "tenant" ? (data.unitNumber ?? null) : null,
    tenantId: data.audience === "tenant" ? data.userId : null,
    title: data.title,
    description: data.description,
    category: mapSpecialtyToCategory(data.specialty as Specialty),
    priority: data.priority,
    status: "Open",
    createdAt: now,
    updatedAt: now,
    source: "marketplace",
    userId: data.userId,
    location: data.location,
    preferredProviderId: data.preferredProviderId,
    audience: data.audience,
    photos: data.photos ?? [],
    scheduledFor: data.scheduledFor,
    wizardStep: "submitted",
    stepHistory: [
      ...(data.stepHistory ?? []),
      { step: "submitted" as const, at: now },
    ],
    statusHistory: [{ status: "Open", at: now }],
  };
  pushRequest(forwarded);
  return { id, ok: true };
}

export async function listAllRequests() {
  return { requests: listRequests() };
}

export async function listUserRequests({ data }: { data: { userId: string } }) {
  const requests = listRequests().filter((r) => r.userId === data.userId);
  const paidAmounts: Record<string, number> = {};
  for (const r of requests) {
    paidAmounts[r.id] = getTotalPaidForRequest(r.id);
  }
  return { requests, paidAmounts };
}

export async function listUserBilling({ data }: { data: { userId: string } }) {
  const invoices: BillingRecord[] = listRequests()
    .filter((r) => r.userId === data.userId)
    .map((r) => deriveBillingRecord(r, getTotalPaidForRequest(r.id)));
  return { invoices };
}

export async function recordPayment({ data }: { data: { requestId: string; amount: number; type: "deposit" | "final" } }) {
  const payment: PaymentRecord = {
    id: `pay-${Date.now().toString(36)}`,
    requestId: data.requestId,
    amount: data.amount,
    type: data.type,
    paidAt: new Date().toISOString(),
  };
  addPayment(payment);
  return { ok: true };
}

export async function setRequestStatus({ data }: { data: { id: string; status: string; notes?: string } }) {
  const r = updateRequestStatus(data.id, data.status as never, data.notes);
  if (!r) throw new Error("Request not found");
  return { ok: true, request: r };
}

export async function submitReview({ data }: { data: { requestId: string; rating: number; comment: string; author: string } }) {
  const all = listRequests();
  const target = all.find((r) => r.id === data.requestId);
  if (!target) throw new Error("Request not found");
  if (target.status !== "Completed") throw new Error("Only completed jobs can be reviewed");
  const review: RequestReview = {
    rating: data.rating,
    comment: data.comment,
    at: new Date().toISOString(),
    author: data.author,
    providerId: target.preferredProviderId,
  };
  addReview(data.requestId, review);
  return { ok: true, review };
}

export async function listReviewsForProvider({ data }: { data: { providerId: string } }) {
  return { reviews: listProviderReviews(data.providerId) };
}
