// In-memory store. Replace with a real DB or POST to Unit & Tenant Views API.
import type { Specialty } from "@/data/providers";

export type RequestCategory =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Appliance"
  | "Structural"
  | "Other";

export interface ForwardedMaintenanceRequest {
  id: string;
  // Maps to MaintenanceRequest in Unit & Tenant Views
  propertyId: string | null;
  unitId: string | null;
  tenantId: string | null;
  title: string;
  description: string;
  category: RequestCategory;
  priority: "Low" | "Medium" | "High" | "Emergency";
  status: "Open";
  createdAt: string;
  updatedAt: string;
  // Marketplace metadata
  source: "marketplace";
  contact: { name: string; email: string; phone: string; address: string };
  preferredProviderId?: string;
  audience: "tenant" | "public";
}

const store: ForwardedMaintenanceRequest[] = [];

export function pushRequest(r: ForwardedMaintenanceRequest) {
  store.unshift(r);
  // In production: POST to Unit & Tenant Views endpoint, e.g.
  // await fetch(`${process.env.UTV_API_URL}/maintenance-requests`, { method: "POST", headers: { Authorization: `Bearer ${process.env.UTV_API_KEY}` }, body: JSON.stringify(r) });
  console.log("[marketplace] forwarded maintenance request", r.id);
}

export function listRequests() {
  return store;
}

export function mapSpecialtyToCategory(s: Specialty): RequestCategory {
  if (s === "Cleaning" || s === "Painting" || s === "Landscaping") return "Other";
  return s;
}