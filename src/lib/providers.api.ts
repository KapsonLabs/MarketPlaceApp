import { api } from "@/lib/api";

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProviderListItem {
  id: string;
  owner: string;
  organization: string;
  provider_type: string;
  business_name: string;
  profile_image: string | null;
  cover_image: string | null;
  description: string;
  verification_status: string;
  approval_status: string;
  availability_status: string;
  average_rating: string;
  rating_count: number;
  jobs_completed: number;
  is_active: boolean;
  distance_km: number | null;
  city: string;
  district: string;
  country: string;
  created_at: string;
}

export interface ProviderService {
  id: string;
  category: string;
  category_name: string;
  years_of_experience: number;
  skill_level: string;
  certification_status: string;
  hourly_rate: string | null;
}

export interface ProviderStatistics {
  jobs_completed: number;
  jobs_in_progress: number;
  jobs_cancelled: number;
  acceptance_rate: string;
  avg_response_minutes: number;
  total_reviews: number;
  rating_breakdown: Record<string, number>;
  last_active_at: string | null;
}

export interface ProviderDocument {
  id: string;
  document_type: string;
  title: string;
  document_file: string;
  issue_date: string | null;
  expiry_date: string | null;
  verification_status: string;
  created_at: string;
}

export interface ProviderDetail extends ProviderListItem {
  registration_number: string;
  tax_identification_number: string;
  years_of_experience: number;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  website: string;
  latitude: number | null;
  longitude: number | null;
  formatted_address: string;
  service_radius_km: number;
  services: ProviderService[];
  statistics: ProviderStatistics;
  documents: ProviderDocument[];
  updated_at: string;
}

export async function listProviders(
  page: number,
): Promise<Paginated<ProviderListItem>> {
  const res = await api.get("/providers/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<ProviderListItem>;
}

export async function getProvider(id: string): Promise<ProviderDetail> {
  const res = await api.get(`/providers/${id}/`);
  return (res.data?.data ?? res.data) as ProviderDetail;
}

export const SKILL_LEVELS = ["beginner", "intermediate", "expert"] as const;
export const CERTIFICATION_STATUSES = ["none", "claimed", "verified"] as const;

export interface ProviderServiceInput {
  category: string;
  years_of_experience: number;
  skill_level: string;
  certification_status: string;
  hourly_rate: string;
}

export async function createProviderService(
  providerId: string,
  payload: ProviderServiceInput,
): Promise<ProviderService> {
  const res = await api.post(`/providers/${providerId}/services/`, payload);
  return (res.data?.data ?? res.data) as ProviderService;
}

/** Derive the next page number from a DRF `next` URL, or undefined when there is none. */
export function nextPageParam(
  lastPage: Paginated<ProviderListItem>,
): number | undefined {
  if (!lastPage.next) return undefined;
  try {
    const url = new URL(lastPage.next);
    const page = url.searchParams.get("page");
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}
