import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parent: string | null;
  is_active: boolean;
  display_order: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
}

export async function listServiceCategories(
  page = 1,
): Promise<Paginated<ServiceCategory>> {
  const res = await api.get("/service-categories/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<ServiceCategory>;
}

/** Fetch every page of active service categories. */
export async function listAllServiceCategories(): Promise<ServiceCategory[]> {
  const items: ServiceCategory[] = [];
  let page = 1;

  while (true) {
    const batch = await listServiceCategories(page);
    items.push(...batch.results.filter((c) => c.is_active));
    if (!batch.next) break;
    page += 1;
  }

  return items.sort((a, b) => a.display_order - b.display_order);
}

export async function getServiceCategory(id: string): Promise<ServiceCategory> {
  const res = await api.get(`/service-categories/${id}/`);
  return (res.data?.data ?? res.data) as ServiceCategory;
}

export async function createServiceCategory(
  payload: CreateCategoryInput,
): Promise<ServiceCategory> {
  const res = await api.post("/service-categories/", payload);
  return (res.data?.data ?? res.data) as ServiceCategory;
}
