import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  audience: "tenant" | "public";
  propertyCode?: string;
  unitNumber?: string;
}

const STORAGE_KEY = "casmara.currentUser";

export const demoUser: CurrentUser = {
  id: "user-demo-001",
  name: "Demo Customer",
  email: "customer@casmara.test",
  phone: "+256700000000",
  audience: "public",
};

function readStoredUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function signInUser(user: CurrentUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("casmara-auth"));
}

export function signOutUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("casmara-auth"));
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(() => readStoredUser());

  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    window.addEventListener("storage", sync);
    window.addEventListener("casmara-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("casmara-auth", sync);
    };
  }, []);

  return user;
}
