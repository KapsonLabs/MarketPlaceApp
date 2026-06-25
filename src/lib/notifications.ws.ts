import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminSession } from "@/lib/admin-auth";
import { getMarketplaceSession } from "@/lib/marketplace-auth";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

/** Derive ws(s)://<host>/ws/notifications/ from the HTTP API base URL. */
function notificationsSocketUrl(token: string): string {
  const origin = BASE_URL.replace(/\/api\/v1\/?$/, "");
  const wsBase = origin.replace(/^http/, "ws"); // http→ws, https→wss
  return `${wsBase}/ws/notifications/?token=${encodeURIComponent(token)}`;
}

function getAccessToken(): string | undefined {
  return getAdminSession()?.access ?? getMarketplaceSession()?.access;
}

/**
 * Keep the in-app notification cache fresh in real time.
 *
 * Connects to the backend notifications websocket (JWT in the query string,
 * matching `apps/core/ws/auth.py`) and, on each `notification.created` frame,
 * invalidates the React Query notification keys so the bell re-fetches.
 * Reconnects with backoff and tears the socket down on unmount.
 */
export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    closedRef.current = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    function connect() {
      const token = getAccessToken();
      if (!token) return; // not signed in — nothing to listen for

      const ws = new WebSocket(notificationsSocketUrl(token));
      socketRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === "notification.created") {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        } catch {
          // ignore malformed frames
        }
      };

      ws.onclose = () => {
        if (closedRef.current) return;
        // Exponential backoff, capped at 30s.
        const delay = Math.min(1000 * 2 ** retryRef.current, 30_000);
        retryRef.current += 1;
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      closedRef.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [queryClient]);
}
