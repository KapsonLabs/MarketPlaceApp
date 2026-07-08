import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";
import { pageFromNext } from "@/lib/api/pagination";
import type { WorkOrderProvider, WorkOrderServiceRequest } from "@/lib/api/work-orders.api";

export type InvoiceStatus = "pending" | "approved" | "paid" | "disputed" | string;

export interface Invoice {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  work_order: { id: string; service_request: WorkOrderServiceRequest };
  provider: WorkOrderProvider;
  materials_cost: string;
  labor_cost: string;
  amount: string;
  platform_fee: string;
  net_amount: string;
  method: string | null;
  operation_notes: string | null;
  invoiced_at: string;
  paid_at: string | null;
}

export const INVOICE_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  disputed: "Disputed",
};

export async function listAdminInvoices(
  page: number,
  params?: { status?: string; provider?: string },
): Promise<Paginated<Invoice>> {
  const res = await api.get("/invoices/admin/", { params: { page, ...params } });
  return (res.data?.data ?? res.data) as Paginated<Invoice>;
}

/** Fetch every page of invoices so the admin list can filter/search client-side. */
export async function listAllAdminInvoices(): Promise<Invoice[]> {
  const items: Invoice[] = [];
  let page = 1;

  while (true) {
    const batch = await listAdminInvoices(page);
    items.push(...batch.results);
    const next = pageFromNext(batch.next);
    if (next == null) break;
    page = next;
  }

  return items;
}

export async function getAdminInvoice(id: string): Promise<Invoice> {
  const res = await api.get(`/invoices/admin/${id}/`);
  return (res.data?.data ?? res.data) as Invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): Promise<Invoice> {
  const res = await api.patch(`/invoices/admin/${id}/`, { status });
  return (res.data?.data ?? res.data) as Invoice;
}

export async function releaseInvoicePayout(id: string): Promise<Invoice> {
  return updateInvoiceStatus(id, "paid");
}
