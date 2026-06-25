import { api } from "@/lib/api";
import type { Paginated } from "@/lib/providers.api";

export interface Notification {
  id: string;
  event: string;
  title: string;
  body: string;
  resource_type: string;
  resource_id: string | null;
  link: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

/** A single page of notification history (newest first). */
export async function listNotifications(
  page = 1,
): Promise<Paginated<Notification>> {
  const res = await api.get("/notifications/", { params: { page } });
  return (res.data?.data ?? res.data) as Paginated<Notification>;
}

/** Unread count for the bell badge. */
export async function unreadCount(): Promise<number> {
  const res = await api.get("/notifications/unread-count/");
  const data = (res.data?.data ?? res.data) as { count: number };
  return data.count;
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const res = await api.post(`/notifications/${id}/read/`);
  return (res.data?.data ?? res.data) as Notification;
}

export async function markAllNotificationsRead(): Promise<number> {
  const res = await api.post("/notifications/read-all/");
  const data = (res.data?.data ?? res.data) as { updated: number };
  return data.updated;
}
