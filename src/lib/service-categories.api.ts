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

export async function listServiceCategories(): Promise<
  Paginated<ServiceCategory>
> {
  const res = await api.get("/service-categories/");
  return (res.data?.data ?? res.data) as Paginated<ServiceCategory>;
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
