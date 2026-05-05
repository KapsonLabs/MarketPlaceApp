import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  pushRequest,
  mapSpecialtyToCategory,
  type ForwardedMaintenanceRequest,
} from "./requests.server";
import type { Specialty } from "@/data/providers";

const schema = z.object({
  audience: z.enum(["tenant", "public"]),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(40),
  address: z.string().min(3).max(300),
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
});

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const now = new Date().toISOString();
    const id = `mkt-${Date.now().toString(36)}`;
    const forwarded: ForwardedMaintenanceRequest = {
      id,
      propertyId: data.audience === "tenant" ? data.propertyCode ?? null : null,
      unitId: data.audience === "tenant" ? data.unitNumber ?? null : null,
      tenantId: data.audience === "tenant" ? data.email : null,
      title: data.title,
      description: data.description,
      category: mapSpecialtyToCategory(data.specialty as Specialty),
      priority: data.priority,
      status: "Open",
      createdAt: now,
      updatedAt: now,
      source: "marketplace",
      contact: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
      preferredProviderId: data.preferredProviderId,
      audience: data.audience,
    };
    pushRequest(forwarded);
    return { id, ok: true };
  });