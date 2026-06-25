import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiUser } from "@/lib/admin-auth";

export interface MarketplaceSession {
  access: string;
  refresh: string;
  user: ApiUser;
}

const STORAGE_KEY = "casmara.marketplaceAuth";
const AUTH_EVENT = "casmara-marketplace-auth";

export function getMarketplaceSession(): MarketplaceSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MarketplaceSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setMarketplaceSession(session: MarketplaceSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearMarketplaceSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useMarketplaceSession(): MarketplaceSession | null {
  const [session, setSession] = useState<MarketplaceSession | null>(() => getMarketplaceSession());

  useEffect(() => {
    const sync = () => setSession(getMarketplaceSession());
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return session;
}

interface LoginPayload {
  username: string;
  password: string;
}

/** Authenticate a marketplace client against the backend. */
export async function loginMarketplace(payload: LoginPayload): Promise<ApiUser> {
  const res = await api.post("/auth/login/", payload);
  const data = (res.data?.data ?? res.data) as MarketplaceSession;

  setMarketplaceSession({
    access: data.access,
    refresh: data.refresh,
    user: data.user,
  });
  return data.user;
}
