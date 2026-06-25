import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./server-ChUyfcIq.js";
import { z } from "zod";
import { R as REQUEST_WIZARD_STEPS, a as REQUEST_STATUSES } from "./request-types-C9A69B28.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const store = [
  {
    id: "mkt-mock001",
    propertyId: "PROP-221",
    unitId: "4B",
    tenantId: "tenant-alice",
    title: "Kitchen tap dripping constantly",
    description: "The cold-water tap in the kitchen has been dripping non-stop for three days. Water is pooling under the cabinet.",
    category: "Plumbing",
    priority: "Medium",
    status: "InProgress",
    createdAt: "2026-05-01T08:14:00.000Z",
    updatedAt: "2026-05-03T11:22:00.000Z",
    source: "marketplace",
    userId: "tenant-alice",
    location: { lat: -26.2041, lng: 28.0473, accuracy: 12, address: "221 Main St, Johannesburg" },
    preferredProviderId: "prov-001",
    audience: "tenant",
    photos: [],
    notes: "Plumber confirmed appointment for Friday morning."
  },
  {
    id: "mkt-mock002",
    propertyId: null,
    unitId: null,
    tenantId: null,
    title: "Electrical panel keeps tripping",
    description: "The main breaker trips every time the stove and microwave are used at the same time. Happens multiple times a day.",
    category: "Electrical",
    priority: "High",
    status: "Triaged",
    createdAt: "2026-05-02T14:05:00.000Z",
    updatedAt: "2026-05-02T16:45:00.000Z",
    source: "marketplace",
    userId: "public-bob",
    location: { lat: -26.1929, lng: 28.0305, accuracy: 25, address: "7 Park Lane, Sandton" },
    audience: "public",
    photos: []
  },
  {
    id: "mkt-mock003",
    propertyId: "PROP-305",
    unitId: "2A",
    tenantId: "tenant-carol",
    title: "AC unit not cooling",
    description: "The HVAC system in the bedroom blows air but it's not cold. The unit is making a rattling noise when it starts up.",
    category: "HVAC",
    priority: "High",
    status: "Assigned",
    createdAt: "2026-05-03T09:30:00.000Z",
    updatedAt: "2026-05-04T08:00:00.000Z",
    source: "marketplace",
    userId: "tenant-carol",
    location: { lat: -26.1052, lng: 28.056, accuracy: 8, address: "305 Rivonia Rd, Morningside" },
    audience: "tenant",
    photos: [],
    notes: "Assigned to CoolTech HVAC — scheduled for 2026-05-06 AM."
  },
  {
    id: "mkt-mock004",
    propertyId: null,
    unitId: null,
    tenantId: null,
    title: "Washing machine not spinning",
    description: "The drum fills with water but never spins. Error code E3 shows on the display. Machine is a Samsung WW70.",
    category: "Appliance",
    priority: "Low",
    status: "Open",
    createdAt: "2026-05-04T17:22:00.000Z",
    updatedAt: "2026-05-04T17:22:00.000Z",
    source: "marketplace",
    userId: "public-dave",
    location: { lat: -26.2308, lng: 28.025, accuracy: 40, address: "14 Smit St, Braamfontein" },
    audience: "public",
    photos: []
  },
  {
    id: "mkt-mock005",
    propertyId: "PROP-118",
    unitId: "7C",
    tenantId: "tenant-eve",
    title: "Crack in load-bearing wall",
    description: "A diagonal crack roughly 30 cm long has appeared on the lounge wall over the past two weeks. It seems to be growing.",
    category: "Structural",
    priority: "Emergency",
    status: "Open",
    createdAt: "2026-05-05T07:50:00.000Z",
    updatedAt: "2026-05-05T07:50:00.000Z",
    source: "marketplace",
    userId: "tenant-eve",
    location: { lat: -26.1867, lng: 28.0549, address: "118 Oxford Rd, Rosebank" },
    audience: "tenant",
    photos: []
  },
  {
    id: "mkt-mock006",
    propertyId: "PROP-221",
    unitId: "2D",
    tenantId: "tenant-frank",
    title: "Blocked bathroom drain",
    description: "Shower drain is completely blocked. Water backs up within 30 seconds of running the shower.",
    category: "Plumbing",
    priority: "Medium",
    status: "Completed",
    createdAt: "2026-04-28T11:00:00.000Z",
    updatedAt: "2026-04-30T15:30:00.000Z",
    source: "marketplace",
    userId: "tenant-frank",
    location: { lat: -26.2041, lng: 28.0473, accuracy: 10, address: "221 Main St, Johannesburg" },
    audience: "tenant",
    photos: [],
    notes: "Cleared by FastFlow Plumbing on 2026-04-30. Root intrusion in shared stack."
  }
];
function pushRequest(r) {
  if (!r.statusHistory || r.statusHistory.length === 0) {
    r.statusHistory = [{ status: r.status, at: r.createdAt }];
  }
  store.unshift(r);
  console.log("[marketplace] forwarded maintenance request", r.id);
}
function listRequests() {
  return store;
}
function updateRequestStatus(id, status, notes) {
  const r = store.find((x) => x.id === id);
  if (!r) return null;
  const at = (/* @__PURE__ */ new Date()).toISOString();
  const statusChanged = r.status !== status;
  r.status = status;
  if (notes !== void 0) r.notes = notes;
  r.updatedAt = at;
  if (statusChanged) {
    r.statusHistory = [...r.statusHistory ?? [], { status, at, notes }];
  }
  return r;
}
function mapSpecialtyToCategory(s) {
  if (s === "Cleaning" || s === "Painting" || s === "Landscaping") return "Other";
  return s;
}
const payments = [];
function addPayment(p) {
  payments.push(p);
}
function getTotalPaidForRequest(requestId) {
  return payments.filter((p) => p.requestId === requestId).reduce((sum, p) => sum + p.amount, 0);
}
function addReview(requestId, review) {
  const r = store.find((x) => x.id === requestId);
  if (!r) return null;
  r.review = review;
  r.updatedAt = review.at;
  return r;
}
function listProviderReviews(providerId) {
  return store.filter((r) => r.review && r.preferredProviderId === providerId).map((r) => r.review);
}
const ASSESSMENT_FEE = 35e3;
const BASE_CATEGORY_PRICING = {
  Plumbing: 9e4,
  Electrical: 12e4,
  HVAC: 18e4,
  Appliance: 11e4,
  Structural: 22e4,
  Other: 8e4
};
const PRIORITY_SURCHARGE = {
  Low: 0,
  Medium: 15e3,
  High: 35e3,
  Emergency: 75e3
};
function deriveBillingStatus(requestStatus, paidAmount, total) {
  if (requestStatus === "Cancelled") return "Cancelled";
  if (paidAmount >= total) return "Paid";
  if (paidAmount > 0) return "PartiallyPaid";
  return "Pending";
}
function deriveBillingRecord(request, paidAmount = 0) {
  const serviceVisit = BASE_CATEGORY_PRICING[request.category];
  const priorityFee = PRIORITY_SURCHARGE[request.priority];
  const marketplaceFee = Math.round(serviceVisit * 0.08);
  const assessmentFee = ASSESSMENT_FEE;
  const assessmentComplete = request.status === "Assigned" || request.status === "InProgress" || request.status === "Completed";
  const workTotal = assessmentComplete ? serviceVisit + priorityFee + marketplaceFee : 0;
  const total = assessmentFee + workTotal;
  const clamped = Math.min(paidAmount, total);
  const status = deriveBillingStatus(request.status, clamped, total);
  const lineItems = [
    { label: "Assessment fee (non-refundable)", amount: assessmentFee }
  ];
  if (assessmentComplete) {
    lineItems.push(
      { label: `${request.category} service visit`, amount: serviceVisit },
      { label: `${request.priority} priority handling`, amount: priorityFee },
      { label: "Marketplace coordination fee", amount: marketplaceFee }
    );
  }
  return {
    id: `inv-${request.id}`,
    requestId: request.id,
    title: request.title,
    status,
    issuedAt: request.updatedAt,
    dueAt: new Date(new Date(request.updatedAt).getTime() + 3 * 24 * 60 * 60 * 1e3).toISOString(),
    total,
    paidAmount: clamped,
    balance: total - clamped,
    assessmentFee,
    workTotal,
    lineItems: lineItems.filter((item) => item.amount > 0)
  };
}
const photoSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().regex(/^image\/(jpeg|png|webp|heic|heif)$/),
  size: z.number().int().min(1).max(5 * 1024 * 1024),
  dataUrl: z.string().startsWith("data:image/").max(7 * 1024 * 1024)
});
const schema = z.object({
  audience: z.enum(["tenant", "public"]),
  userId: z.string().min(1).max(120),
  propertyCode: z.string().max(60).optional(),
  unitNumber: z.string().max(40).optional(),
  specialty: z.enum(["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Cleaning", "Painting", "Landscaping", "Other"]),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2e3),
  priority: z.enum(["Low", "Medium", "High", "Emergency"]),
  preferredProviderId: z.string().max(60).optional(),
  photos: z.array(photoSchema).max(5).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracy: z.number().min(0).max(1e5).optional(),
    address: z.string().max(300).optional()
  }),
  scheduledFor: z.string().min(1).max(40).optional().refine((v) => {
    if (!v) return true;
    const t = Date.parse(v);
    if (Number.isNaN(t)) return false;
    return t >= Date.now() - 6e4;
  }, {
    message: "Scheduled date must be in the future"
  }),
  wizardStep: z.enum(REQUEST_WIZARD_STEPS).optional(),
  stepHistory: z.array(z.object({
    step: z.enum(REQUEST_WIZARD_STEPS),
    at: z.string().min(1).max(40)
  })).max(20).optional()
});
const submitRequest_createServerFn_handler = createServerRpc({
  id: "e93aa084b225a10de1c927126a1ff459d5215406b06be5c36583b8118888976c",
  name: "submitRequest",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => submitRequest.__executeServer(opts));
const submitRequest = createServerFn({
  method: "POST"
}).validator((input) => schema.parse(input)).handler(submitRequest_createServerFn_handler, async ({
  data
}) => {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = `mkt-${Date.now().toString(36)}`;
  const forwarded = {
    id,
    propertyId: data.audience === "tenant" ? data.propertyCode ?? null : null,
    unitId: data.audience === "tenant" ? data.unitNumber ?? null : null,
    tenantId: data.audience === "tenant" ? data.userId : null,
    title: data.title,
    description: data.description,
    category: mapSpecialtyToCategory(data.specialty),
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
    stepHistory: [...data.stepHistory ?? [], {
      step: "submitted",
      at: now
    }],
    statusHistory: [{
      status: "Open",
      at: now
    }]
  };
  pushRequest(forwarded);
  return {
    id,
    ok: true
  };
});
const listAllRequests_createServerFn_handler = createServerRpc({
  id: "ae1c822e848442ea126b03d3acf47186b7a61075e203217837b714bc7319404f",
  name: "listAllRequests",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => listAllRequests.__executeServer(opts));
const listAllRequests = createServerFn({
  method: "GET"
}).handler(listAllRequests_createServerFn_handler, async () => {
  return {
    requests: listRequests()
  };
});
const userRequestsSchema = z.object({
  userId: z.string().min(1).max(120)
});
const listUserRequests_createServerFn_handler = createServerRpc({
  id: "66a65aa5f762496a265dd3d400a6a92d6fa165646732f6c7addcac08570b33d8",
  name: "listUserRequests",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => listUserRequests.__executeServer(opts));
const listUserRequests = createServerFn({
  method: "GET"
}).validator((input) => userRequestsSchema.parse(input)).handler(listUserRequests_createServerFn_handler, async ({
  data
}) => {
  const requests = listRequests().filter((r) => r.userId === data.userId);
  const paidAmounts = {};
  for (const r of requests) {
    paidAmounts[r.id] = getTotalPaidForRequest(r.id);
  }
  return {
    requests,
    paidAmounts
  };
});
const listUserBilling_createServerFn_handler = createServerRpc({
  id: "f684a10c0f613c2af52b6847254d9b491d6f7e7ebad63d86e93bf70095401efa",
  name: "listUserBilling",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => listUserBilling.__executeServer(opts));
const listUserBilling = createServerFn({
  method: "GET"
}).validator((input) => userRequestsSchema.parse(input)).handler(listUserBilling_createServerFn_handler, async ({
  data
}) => {
  const invoices = listRequests().filter((r) => r.userId === data.userId).map((r) => deriveBillingRecord(r, getTotalPaidForRequest(r.id)));
  return {
    invoices
  };
});
const paymentSchema = z.object({
  requestId: z.string().min(1).max(60),
  amount: z.number().int().positive(),
  type: z.enum(["deposit", "final"])
});
const recordPayment_createServerFn_handler = createServerRpc({
  id: "77dc76e87809f5163979bb4a7b39cf2b6b1fa09a8b1d676128f58ab3b03e31cb",
  name: "recordPayment",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => recordPayment.__executeServer(opts));
const recordPayment = createServerFn({
  method: "POST"
}).validator((input) => paymentSchema.parse(input)).handler(recordPayment_createServerFn_handler, async ({
  data
}) => {
  const payment = {
    id: `pay-${Date.now().toString(36)}`,
    requestId: data.requestId,
    amount: data.amount,
    type: data.type,
    paidAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  addPayment(payment);
  return {
    ok: true
  };
});
const statusSchema = z.object({
  id: z.string().min(1).max(60),
  status: z.enum(REQUEST_STATUSES),
  notes: z.string().max(2e3).optional()
});
const setRequestStatus_createServerFn_handler = createServerRpc({
  id: "3b6dc1f6c0f86709b4fd7a3d49654aa6ce126925b74f3b75dab4e2af7c8e3764",
  name: "setRequestStatus",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => setRequestStatus.__executeServer(opts));
const setRequestStatus = createServerFn({
  method: "POST"
}).validator((input) => statusSchema.parse(input)).handler(setRequestStatus_createServerFn_handler, async ({
  data
}) => {
  const r = updateRequestStatus(data.id, data.status, data.notes);
  if (!r) throw new Error("Request not found");
  return {
    ok: true,
    request: r
  };
});
const reviewSchema = z.object({
  requestId: z.string().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1e3),
  author: z.string().min(1).max(120)
});
const submitReview_createServerFn_handler = createServerRpc({
  id: "75e9bd6d5dbfae96f2259e728dd8b00e5d30415f4b76c329ce99d3c645657d12",
  name: "submitReview",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => submitReview.__executeServer(opts));
const submitReview = createServerFn({
  method: "POST"
}).validator((input) => reviewSchema.parse(input)).handler(submitReview_createServerFn_handler, async ({
  data
}) => {
  const at = (/* @__PURE__ */ new Date()).toISOString();
  const all = listRequests();
  const target = all.find((r) => r.id === data.requestId);
  if (!target) throw new Error("Request not found");
  if (target.status !== "Completed") throw new Error("Only completed jobs can be reviewed");
  const review = {
    rating: data.rating,
    comment: data.comment,
    at,
    author: data.author,
    providerId: target.preferredProviderId
  };
  addReview(data.requestId, review);
  return {
    ok: true,
    review
  };
});
const providerReviewsSchema = z.object({
  providerId: z.string().min(1).max(60)
});
const listReviewsForProvider_createServerFn_handler = createServerRpc({
  id: "0ec8f1406d99d780386558a75c73332e27484c13f07845bb5b7f2472a94274aa",
  name: "listReviewsForProvider",
  filename: "src/lib/marketplace/requests.functions.ts"
}, (opts) => listReviewsForProvider.__executeServer(opts));
const listReviewsForProvider = createServerFn({
  method: "GET"
}).validator((input) => providerReviewsSchema.parse(input)).handler(listReviewsForProvider_createServerFn_handler, async ({
  data
}) => {
  return {
    reviews: listProviderReviews(data.providerId)
  };
});
export {
  listAllRequests_createServerFn_handler,
  listReviewsForProvider_createServerFn_handler,
  listUserBilling_createServerFn_handler,
  listUserRequests_createServerFn_handler,
  recordPayment_createServerFn_handler,
  setRequestStatus_createServerFn_handler,
  submitRequest_createServerFn_handler,
  submitReview_createServerFn_handler
};
