import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";
import { pageFromNext } from "@/lib/api/pagination";

export type AssignmentAcceptanceStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "clarification_requested"
  | string;

export interface Assignment {
  id: string;
  service_request: string;
  service_request_title?: string;
  provider: string;
  provider_name?: string;
  assignment_type: string;
  assigned_by: string;
  assignment_date: string;
  assignment_reason: string;
  acceptance_status: AssignmentAcceptanceStatus;
  response_note: string;
  responded_at: string | null;
  superseded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentResponseInput {
  response_note?: string;
}

export interface AssignmentRejectInput {
  response_note: string;
}

export interface AssignmentClarifyInput {
  response_note: string;
}

// ---- Provider ---------------------------------------------------------

export async function listMyAssignments(
  page: number,
): Promise<Paginated<Assignment>> {
  const res = await api.get("/assignments/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<Assignment>;
}

/** Fetch every page of the authenticated provider's assignments. */
export async function listAllMyAssignments(): Promise<Assignment[]> {
  const items: Assignment[] = [];
  let page = 1;

  while (true) {
    const batch = await listMyAssignments(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function getAssignment(id: string): Promise<Assignment> {
  const res = await api.get(`/assignments/${id}/`);
  return (res.data?.data ?? res.data) as Assignment;
}

/** Provider accepts an assignment, starting the job. */
export async function acceptAssignment(
  id: string,
  payload?: AssignmentResponseInput,
): Promise<Assignment> {
  const res = await api.post(`/assignments/${id}/accept/`, payload ?? {});
  return (res.data?.data ?? res.data) as Assignment;
}

/** Provider declines an assignment with a reason. */
export async function rejectAssignment(
  id: string,
  payload: AssignmentRejectInput,
): Promise<Assignment> {
  const res = await api.post(`/assignments/${id}/reject/`, payload);
  return (res.data?.data ?? res.data) as Assignment;
}

/** Provider asks for more information before accepting/rejecting. */
export async function clarifyAssignment(
  id: string,
  payload: AssignmentClarifyInput,
): Promise<Assignment> {
  const res = await api.post(`/assignments/${id}/clarify/`, payload);
  return (res.data?.data ?? res.data) as Assignment;
}

// ---- Admin --------------------------------------------------------------

export async function listAdminAssignments(
  page: number,
): Promise<Paginated<Assignment>> {
  const res = await api.get("/assignments/admin/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<Assignment>;
}

/** Fetch every page of assignments across the marketplace (admin view). */
export async function listAllAdminAssignments(): Promise<Assignment[]> {
  const items: Assignment[] = [];
  let page = 1;

  while (true) {
    const batch = await listAdminAssignments(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function adminAcceptAssignment(
  id: string,
  payload?: AssignmentResponseInput,
): Promise<Assignment> {
  const res = await api.post(`/assignments/admin/${id}/accept/`, payload ?? {});
  return (res.data?.data ?? res.data) as Assignment;
}

export async function adminRejectAssignment(
  id: string,
  payload: AssignmentRejectInput,
): Promise<Assignment> {
  const res = await api.post(`/assignments/admin/${id}/reject/`, payload);
  return (res.data?.data ?? res.data) as Assignment;
}
