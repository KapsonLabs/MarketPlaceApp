import { api } from "@/lib/api";

export interface ProviderEarningsSummary {
  total_earnings: string;
  pending_earnings: string;
  paid_earnings: string;
  jobs_completed: number;
  current_period_earnings?: string;
}

export async function getProviderEarnings(): Promise<ProviderEarningsSummary> {
  const res = await api.get("/provider/earnings/");
  return (res.data?.data ?? res.data) as ProviderEarningsSummary;
}
