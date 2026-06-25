import { useEffect, useState } from "react";

export interface AdminUser {
  email: string;
  name: string;
}

const STORAGE_KEY = "abja.admin.session";

const ADMIN_CREDENTIALS = {
  email: "ops@casmarasystems.app",
  password: "admin2024",
};

export function signInAdmin(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const user: AdminUser = { email: email.trim().toLowerCase(), name: "Admin Ops" };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("abja-admin-auth"));
    return true;
  }
  return false;
}

export function signOutAdmin() {
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("abja-admin-auth"));
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function useAdminUser(): AdminUser | null {
  const [user, setUser] = useState<AdminUser | null>(() => getAdminUser());

  useEffect(() => {
    const sync = () => setUser(getAdminUser());
    window.addEventListener("abja-admin-auth", sync);
    return () => window.removeEventListener("abja-admin-auth", sync);
  }, []);

  return user;
}
