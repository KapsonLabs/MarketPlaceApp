import { api } from "@/lib/api";

export interface MarketplaceSettings {
  marketplace_fee_percent: number;
  deposit_percent: number;
  assessment_fee: string;
  currency: string;
}

export async function getMarketplaceSettings(): Promise<MarketplaceSettings> {
  const res = await api.get("/settings/");
  return (res.data?.data ?? res.data) as MarketplaceSettings;
}

export async function updateMarketplaceSettings(
  payload: Partial<MarketplaceSettings>,
): Promise<MarketplaceSettings> {
  const res = await api.patch("/settings/", payload);
  return (res.data?.data ?? res.data) as MarketplaceSettings;
}
