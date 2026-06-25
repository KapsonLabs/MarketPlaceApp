import { useEffect, useState } from "react";
import type { ApiUser } from "@/lib/admin-auth";
import {
  clearMarketplaceSession,
  getMarketplaceSession,
  useMarketplaceSession,
} from "@/lib/marketplace-auth";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  audience: "tenant" | "public";
  propertyCode?: string;
  unitNumber?: string;
}

const AUTH_EVENT = "casmara-marketplace-auth";

function apiUserToCurrentUser(user: ApiUser): CurrentUser {
  const name = `${user.first_name} ${user.last_name}`.trim() || user.username;
  return {
    id: user.id,
    name,
    email: user.email,
    phone: "",
    audience: "public",
  };
}

function readCurrentUser(): CurrentUser | null {
  const session = getMarketplaceSession();
  return session ? apiUserToCurrentUser(session.user) : null;
}

export function signOutUser() {
  clearMarketplaceSession();
}

export function useCurrentUser(): CurrentUser | null {
  const session = useMarketplaceSession();
  const [user, setUser] = useState<CurrentUser | null>(() => readCurrentUser());

  useEffect(() => {
    setUser(session ? apiUserToCurrentUser(session.user) : null);
  }, [session]);

  useEffect(() => {
    const sync = () => setUser(readCurrentUser());
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return user;
}
