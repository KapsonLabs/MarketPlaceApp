import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  pushRequest,
  listRequests,
  updateRequestStatus,
  mapSpecialtyToCategory,
  addPayment,
  getTotalPaidForRequest,
  addReview,
  listProviderReviews,
} from "../server/requests.server";
import type { PaymentRecord, RequestReview } from "@/lib/request-types";
import { REQUEST_STATUSES, REQUEST_WIZARD_STEPS } from "@/lib/request-types";
import { deriveBillingRecord } from "@/lib/billing";
import type {
  ForwardedMaintenanceRequest,
  RequestStatus,
  RequestWizardStep,
  RequestStepHistoryEntry,
} from "@/lib/request-types";
import type { BillingRecord } from "@/lib/billing";
import type { Specialty } from "@/data/providers";

const photoSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().regex(/^image\/(jpeg|png|webp|heic|heif)$/),
  size: z
    .number()
    .int()
    .min(1)
    .max(5 * 1024 * 1024),
  dataUrl: z
    .string()
    .startsWith("data:image/")
    .max(7 * 1024 * 1024),
});

const schema = z.object({
  audience: z.enum(["tenant", "public"]),
  userId: z.string().min(1).max(120),
  propertyCode: z.string().max(60).optional(),
  unitNumber: z.string().max(40).optional(),
  specialty: z.enum([
    "Plumbing",
    "Electrical",
    "HVAC",
    "Appliance",
    "Structural",
    "Cleaning",
    "Painting",
    "Landscaping",
    "Other",
  ]),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  priority: z.enum(["Low", "Medium", "High", "Emergency"]),
  preferredProviderId: z.string().max(60).optional(),
  photos: z.array(photoSchema).max(5).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracy: z.number().min(0).max(100000).optional(),
    address: z.string().max(300).optional(),
  }),
  wizardStep: z
    .enum(REQUEST_WIZARD_STEPS as [RequestWizardStep, ...RequestWizardStep[]])
    .optional(),
  stepHistory: z
    .array(
      z.object({
        step: z.enum(REQUEST_WIZARD_STEPS as [RequestWizardStep, ...RequestWizardStep[]]),
        at: z.string().min(1).max(40),
      }),
    )
    .max(20)
    .optional(),
});

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
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
      wizardStep: "submitted",
      stepHistory: [
        ...(data.stepHistory ?? []),
        { step: "submitted" as const, at: now },
      ],
      statusHistory: [{ status: "Open", at: now }],
    };
    pushRequest(forwarded);
    return { id, ok: true };
  });

export const listAllRequests = createServerFn({ method: "GET" }).handler(async () => {
  return { requests: listRequests() };
});

const userRequestsSchema = z.object({
  userId: z.string().min(1).max(120),
});

export const listUserRequests = createServerFn({ method: "GET" })
  .inputValidator((input) => userRequestsSchema.parse(input))
  .handler(async ({ data }) => {
    const requests = listRequests().filter((r) => r.userId === data.userId);
    const paidAmounts: Record<string, number> = {};
    for (const r of requests) {
      paidAmounts[r.id] = getTotalPaidForRequest(r.id);
    }
    return { requests, paidAmounts };
  });

export const listUserBilling = createServerFn({ method: "GET" })
  .inputValidator((input) => userRequestsSchema.parse(input))
  .handler(async ({ data }) => {
    const invoices: BillingRecord[] = listRequests()
      .filter((r) => r.userId === data.userId)
      .map((r) => deriveBillingRecord(r, getTotalPaidForRequest(r.id)));
    return { invoices };
  });

const paymentSchema = z.object({
  requestId: z.string().min(1).max(60),
  amount: z.number().int().positive(),
  type: z.enum(["deposit", "final"]),
});

export const recordPayment = createServerFn({ method: "POST" })
  .inputValidator((input) => paymentSchema.parse(input))
  .handler(async ({ data }) => {
    const payment: PaymentRecord = {
      id: `pay-${Date.now().toString(36)}`,
      requestId: data.requestId,
      amount: data.amount,
      type: data.type,
      paidAt: new Date().toISOString(),
    };
    addPayment(payment);
    return { ok: true };
  });

const statusSchema = z.object({
  id: z.string().min(1).max(60),
  status: z.enum(REQUEST_STATUSES as [RequestStatus, ...RequestStatus[]]),
  notes: z.string().max(2000).optional(),
});

export const setRequestStatus = createServerFn({ method: "POST" })
  .inputValidator((input) => statusSchema.parse(input))
  .handler(async ({ data }) => {
    const r = updateRequestStatus(data.id, data.status, data.notes);
    if (!r) throw new Error("Request not found");
    return { ok: true, request: r };
  });

const reviewSchema = z.object({
  requestId: z.string().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
  author: z.string().min(1).max(120),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const at = new Date().toISOString();
    const all = listRequests();
    const target = all.find((r) => r.id === data.requestId);
    if (!target) throw new Error("Request not found");
    if (target.status !== "Completed") throw new Error("Only completed jobs can be reviewed");
    const review: RequestReview = {
      rating: data.rating,
      comment: data.comment,
      at,
      author: data.author,
      providerId: target.preferredProviderId,
    };
    addReview(data.requestId, review);
    return { ok: true, review };
  });

const providerReviewsSchema = z.object({ providerId: z.string().min(1).max(60) });

export const listReviewsForProvider = createServerFn({ method: "GET" })
  .inputValidator((input) => providerReviewsSchema.parse(input))
  .handler(async ({ data }) => {
    return { reviews: listProviderReviews(data.providerId) };
  });
