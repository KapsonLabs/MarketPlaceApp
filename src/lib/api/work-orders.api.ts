import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";
import { pageFromNext } from "@/lib/api/pagination";

export type WorkOrderStatus =
  | "pending"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled"
  | string;

export interface WorkOrderServiceRequest {
  id: string;
  title: string;
}

export interface WorkOrderProvider {
  id: string | number;
  name: string;
}

export interface WorkOrder {
  id: string;
  service_request: WorkOrderServiceRequest;
  provider: WorkOrderProvider;
  scheduled_start: string | null;
  scheduled_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  status: WorkOrderStatus;
  final_cost: string | null;
  updates: WorkOrderUpdate[];
}

export interface WorkOrderUpdate {
  id: string;
  work_order: string;
  update_type: string;
  message: string;
  percent_complete: number;
  photo: string | null;
  author: string;
  created_at: string;
}

export interface CreateWorkOrderUpdateInput {
  update_type: string;
  message?: string;
  percent_complete?: number;
  photo?: File;
}

export const WORK_ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  in_progress: "In progress",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const WORK_ORDER_STATUS_OPTIONS = Object.entries(WORK_ORDER_STATUS_LABEL).map(
  ([value, label]) => ({ value, label }),
);

// ---- Provider ---------------------------------------------------------

export async function listMyWorkOrders(
  page: number,
  params?: { status?: string; service_request?: string },
): Promise<Paginated<WorkOrder>> {
  const res = await api.get("/work-orders/", { params: { page, ...params } });
  return (res.data?.data ?? res.data) as Paginated<WorkOrder>;
}

/** Fetch every page of the authenticated provider's work orders. */
export async function listAllMyWorkOrders(): Promise<WorkOrder[]> {
  const items: WorkOrder[] = [];
  let page = 1;

  while (true) {
    const batch = await listMyWorkOrders(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function getWorkOrder(id: string): Promise<WorkOrder> {
  const res = await api.get(`/work-orders/${id}/`);
  return (res.data?.data ?? res.data) as WorkOrder;
}

export async function listWorkOrderUpdates(id: string): Promise<WorkOrderUpdate[]> {
  const res = await api.get(`/work-orders/${id}/updates/`);
  return (res.data?.data ?? res.data) as WorkOrderUpdate[];
}

/** Provider logs a progress update (note, status change, photo) against a work order. */
export async function addWorkOrderUpdate(
  id: string,
  payload: CreateWorkOrderUpdateInput,
): Promise<WorkOrderUpdate> {
  const formData = new FormData();
  formData.append("update_type", payload.update_type);
  if (payload.message) formData.append("message", payload.message);
  if (payload.percent_complete != null)
    formData.append("percent_complete", String(payload.percent_complete));
  if (payload.photo) formData.append("photo", payload.photo);

  const res = await api.post(`/work-orders/${id}/updates/`, formData);
  return (res.data?.data ?? res.data) as WorkOrderUpdate;
}

// ---- Admin --------------------------------------------------------------

export async function listAdminWorkOrders(
  page: number,
  params?: { provider?: string; status?: string },
): Promise<Paginated<WorkOrder>> {
  const res = await api.get("/work-orders/admin/", {
    params: { page, ...params },
  });
  return (res.data?.data ?? res.data) as Paginated<WorkOrder>;
}
