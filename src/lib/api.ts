import axios, { AxiosError } from "axios";
import { getAdminSession, clearAdminSession } from "@/lib/admin-auth";
import { getMarketplaceSession, clearMarketplaceSession } from "@/lib/marketplace-auth";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

// const BASE_URL =
//   import.meta.env.VITE_API_URL ?? "https://marketplace.casmara.iolabz.ug/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
});

function getAccessToken(): string | undefined {
  return getAdminSession()?.access ?? getMarketplaceSession()?.access;
}

// Attach the access token to every request when a session exists.
api.interceptors.request.use((config) => {
  const access = getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

/** Pull a human-readable message out of a DRF-style error body. */
function extractErrorMessage(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.detail === "string") return obj.detail;
    if (typeof obj.message === "string") return obj.message;
    // First field error (e.g. { username: ["..."] } or { non_field_errors: [...] }).
    for (const value of Object.values(obj)) {
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }
  return "Something went wrong. Please try again.";
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Server error → dedicated error page.
    if (status && status >= 500) {
      if (typeof window !== "undefined") {
        window.location.assign("/server-error");
      }
      return Promise.reject(error);
    }

    // Expired/invalid session → clear and bounce to login.
    // If there is no session (e.g. bad credentials on the login call itself),
    // fall through so the caller can surface the error inline.
    if (status === 401) {
      if (getAdminSession()) {
        clearAdminSession();
        if (typeof window !== "undefined") {
          window.location.assign("/administrator/login");
        }
      } else if (getMarketplaceSession()) {
        clearMarketplaceSession();
        if (typeof window !== "undefined") {
          window.location.assign("/marketplace/sign-in");
        }
      }
      return Promise.reject(error);
    }

    // Validation/bad-request → surface a readable message to the caller.
    if (status === 400 || status === 401) {
      (error as AxiosError & { uiMessage?: string }).uiMessage =
        extractErrorMessage(error.response?.data);
    }

    return Promise.reject(error);
  },
);
