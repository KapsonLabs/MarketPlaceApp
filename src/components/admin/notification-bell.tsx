import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useAppState,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/admin/store";
import type { AppNotification } from "@/lib/admin/mock-data";

function targetFor(
  n: AppNotification,
): { to: string; params: Record<string, string> } | null {
  if (!n.entityId) return null;
  if (n.entityId.startsWith("req-"))
    return { to: "/admin/requests/$requestId", params: { requestId: n.entityId } };
  if (n.entityId.startsWith("sp-"))
    return { to: "/admin/providers/$providerId", params: { providerId: n.entityId } };
  if (n.entityId.startsWith("tsk-"))
    return { to: "/admin/tasks/$taskId", params: { taskId: n.entityId } };
  if (n.entityId.startsWith("pay-"))
    return { to: "/admin/payments/$paymentId", params: { paymentId: n.entityId } };
  return null;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const { notifications } = useAppState();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  function open(n: AppNotification) {
    markNotificationRead(n.id);
    const t = targetFor(n);
    if (t) navigate({ to: t.to, params: t.params });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          )}
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => open(n)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-primary",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
