import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";

export interface ServiceRequestListItem {
  id: string;
  requester: string;
  requester_name: string;
  organization: string;
  service_category: string;
  priority: string;
  title: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  formatted_address: string;
  city: string;
  district: string;
  country: string;
  contact_person: string;
  contact_phone: string;
  contact_alternate_phone: string;
  contact_email: string;
  preferred_date: string | null;
  preferred_time: string | null;
  estimated_budget: string | null;
  estimated_cost: string | null;
  deposit_required: number | null;
  amount_paid: string;
  payment_status: string;
  cost_variance: string | null;
  assignment_type: string;
  preferred_provider: string | null;
  assigned_provider: string | null;
  status: string;
  status_changed_at: string;
  distance_km: number | null;
  created_at: string;
  updated_at: string;
}

export interface RequestPayment {
  id: string;
  service_request: string;
  amount: string;
  payment_type: string;
  paid_by: string;
  reference: string;
  created_at: string;
}

export interface RequestAssignment {
  id: string;
  service_request: string;
  provider: string;
  assignment_type: string;
  assigned_by: string;
  assignment_date: string;
  assignment_reason: string;
  acceptance_status: string;
  response_note: string;
  responded_at: string | null;
  superseded_at: string | null;
}

export interface RequestImage {
  id: string;
  image: string;
  caption?: string;
}

export interface ServiceRequestDetail extends ServiceRequestListItem {
  payments: RequestPayment[];
  assignments: RequestAssignment[];
  images: RequestImage[];
}

export interface CreateServiceRequestInput {
  service_category: string;
  priority: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  city: string;
  district: string;
  contact_person: string;
  contact_phone: string;
  contact_alternate_phone?: string;
  contact_email: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  estimated_budget?: string | null;
  assignment_type: "platform_assigned" | "customer_selected";
  preferred_provider?: string | null;
}

export interface RequestAttachment {
  id: string;
  image: string;
  caption: string;
  file_size: number;
  content_type: string;
  scan_status: string;
  created_at: string;
}

export async function uploadServiceRequestAttachment(
  requestId: string,
  file: File,
  caption: string,
): Promise<RequestAttachment> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);

  const res = await api.post(`/service-requests/${requestId}/attachments/`, formData);
  return (res.data?.data ?? res.data) as RequestAttachment;
}

export async function createServiceRequest(
  payload: CreateServiceRequestInput,
): Promise<ServiceRequestListItem> {
  const res = await api.post("/service-requests/", payload);
  return (res.data?.data ?? res.data) as ServiceRequestListItem;
}

export async function listMyServiceRequests(
  page: number,
): Promise<Paginated<ServiceRequestListItem>> {
  const res = await api.get("/service-requests/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<ServiceRequestListItem>;
}

/** Fetch every page of the authenticated user's service requests. */
export async function listAllMyServiceRequests(): Promise<ServiceRequestListItem[]> {
  const items: ServiceRequestListItem[] = [];
  let page = 1;

  while (true) {
    const batch = await listMyServiceRequests(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function listAdminServiceRequests(
  page: number,
): Promise<Paginated<ServiceRequestListItem>> {
  const res = await api.get("/service-requests/admin/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<ServiceRequestListItem>;
}

/** Fetch every page of admin service requests (DRF pagination). */
export async function listAllAdminServiceRequests(): Promise<ServiceRequestListItem[]> {
  const items: ServiceRequestListItem[] = [];
  let page = 1;

  while (true) {
    const batch = await listAdminServiceRequests(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function getAdminServiceRequest(
  id: string,
): Promise<ServiceRequestDetail> {
  const res = await api.get(`/service-requests/admin/${id}/`);
  return (res.data?.data ?? res.data) as ServiceRequestDetail;
}

/** Derive the next page number from a DRF `next` URL, or undefined when there is none. */
export function pageFromNext(next: string | null): number | undefined {
  if (!next) return undefined;
  try {
    const page = new URL(next).searchParams.get("page");
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}
