import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface ApiRole {
  id: string;
  name: string;
  slug: string;
  description?: string;
  role_type?: string;
  organization?: string | null;
  permissions_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
}

export interface ApiUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: ApiRole;
  permissions: unknown[];
}

export interface AdminSession {
  access: string;
  refresh: string;
  user: ApiUser;
}

const STORAGE_KEY = "casmara.adminAuth";
const AUTH_EVENT = "casmara-admin-auth";

export const ALLOWED_ROLE_SLUGS = ["admin", "provider"] as const;

export function isAllowedRole(user: ApiUser | null | undefined): boolean {
  if (!user) return false;
  return ALLOWED_ROLE_SLUGS.includes(user.role?.slug as (typeof ALLOWED_ROLE_SLUGS)[number]);
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAdminSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAdminSession(): AdminSession | null {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession());

  useEffect(() => {
    const sync = () => setSession(getAdminSession());
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

/**
 * Authenticate an admin/provider against the backend.
 * Stores the session on success; throws if the account's role is not allowed.
 */
export async function loginAdmin(payload: LoginPayload): Promise<ApiUser> {
  const res = await api.post("/auth/login/", payload);
  // Response body is wrapped: { status, data: { access, refresh, user } }
  const data = (res.data?.data ?? res.data) as AdminSession;

  if (!isAllowedRole(data.user)) {
    throw new Error("This account is not authorized for the admin console.");
  }

  setAdminSession({ access: data.access, refresh: data.refresh, user: data.user });
  return data.user;
}
