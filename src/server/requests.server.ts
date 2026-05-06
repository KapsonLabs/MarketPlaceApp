// In-memory store. Replace with a real DB or POST to Unit & Tenant Views API.
import type { Specialty } from "@/data/providers";
import type {
  RequestCategory,
  RequestStatus,
  ForwardedMaintenanceRequest,
} from "@/lib/request-types";

export type {
  RequestCategory,
  RequestStatus,
  ForwardedMaintenanceRequest,
} from "@/lib/request-types";
export { REQUEST_STATUSES } from "@/lib/request-types";
export type { RequestPhoto, RequestLocation } from "@/lib/request-types";

const store: ForwardedMaintenanceRequest[] = [
  {
    id: "mkt-mock001",
    propertyId: "PROP-221",
    unitId: "4B",
    tenantId: "tenant-alice",
    title: "Kitchen tap dripping constantly",
    description:
      "The cold-water tap in the kitchen has been dripping non-stop for three days. Water is pooling under the cabinet.",
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
    notes: "Plumber confirmed appointment for Friday morning.",
  },
  {
    id: "mkt-mock002",
    propertyId: null,
    unitId: null,
    tenantId: null,
    title: "Electrical panel keeps tripping",
    description:
      "The main breaker trips every time the stove and microwave are used at the same time. Happens multiple times a day.",
    category: "Electrical",
    priority: "High",
    status: "Triaged",
    createdAt: "2026-05-02T14:05:00.000Z",
    updatedAt: "2026-05-02T16:45:00.000Z",
    source: "marketplace",
    userId: "public-bob",
    location: { lat: -26.1929, lng: 28.0305, accuracy: 25, address: "7 Park Lane, Sandton" },
    audience: "public",
    photos: [],
  },
  {
    id: "mkt-mock003",
    propertyId: "PROP-305",
    unitId: "2A",
    tenantId: "tenant-carol",
    title: "AC unit not cooling",
    description:
      "The HVAC system in the bedroom blows air but it's not cold. The unit is making a rattling noise when it starts up.",
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
    notes: "Assigned to CoolTech HVAC — scheduled for 2026-05-06 AM.",
  },
  {
    id: "mkt-mock004",
    propertyId: null,
    unitId: null,
    tenantId: null,
    title: "Washing machine not spinning",
    description:
      "The drum fills with water but never spins. Error code E3 shows on the display. Machine is a Samsung WW70.",
    category: "Appliance",
    priority: "Low",
    status: "Open",
    createdAt: "2026-05-04T17:22:00.000Z",
    updatedAt: "2026-05-04T17:22:00.000Z",
    source: "marketplace",
    userId: "public-dave",
    location: { lat: -26.2308, lng: 28.025, accuracy: 40, address: "14 Smit St, Braamfontein" },
    audience: "public",
    photos: [],
  },
  {
    id: "mkt-mock005",
    propertyId: "PROP-118",
    unitId: "7C",
    tenantId: "tenant-eve",
    title: "Crack in load-bearing wall",
    description:
      "A diagonal crack roughly 30 cm long has appeared on the lounge wall over the past two weeks. It seems to be growing.",
    category: "Structural",
    priority: "Emergency",
    status: "Open",
    createdAt: "2026-05-05T07:50:00.000Z",
    updatedAt: "2026-05-05T07:50:00.000Z",
    source: "marketplace",
    userId: "tenant-eve",
    location: { lat: -26.1867, lng: 28.0549, address: "118 Oxford Rd, Rosebank" },
    audience: "tenant",
    photos: [],
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
    notes: "Cleared by FastFlow Plumbing on 2026-04-30. Root intrusion in shared stack.",
  },
];

export function pushRequest(r: ForwardedMaintenanceRequest) {
  store.unshift(r);
  // In production: POST to Unit & Tenant Views endpoint, e.g.
  // await fetch(`${process.env.UTV_API_URL}/maintenance-requests`, { method: "POST", headers: { Authorization: `Bearer ${process.env.UTV_API_KEY}` }, body: JSON.stringify(r) });
  console.log("[marketplace] forwarded maintenance request", r.id);
}

export function listRequests() {
  return store;
}

export function updateRequestStatus(
  id: string,
  status: RequestStatus,
  notes?: string,
): ForwardedMaintenanceRequest | null {
  const r = store.find((x) => x.id === id);
  if (!r) return null;
  r.status = status;
  if (notes !== undefined) r.notes = notes;
  r.updatedAt = new Date().toISOString();
  return r;
}

export function mapSpecialtyToCategory(s: Specialty): RequestCategory {
  if (s === "Cleaning" || s === "Painting" || s === "Landscaping") return "Other";
  return s;
}
