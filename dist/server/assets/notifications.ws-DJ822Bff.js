import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { c as cn, B as Button } from "./button-BmLZMIt9.js";
import * as React from "react";
import { useRef, useEffect } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { o as api, q as getAdminSession, k as getMarketplaceSession } from "./router-rAJgq2Yd.js";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
async function listNotifications(page = 1) {
  const res = await api.get("/notifications/", { params: { page } });
  return res.data?.data ?? res.data;
}
async function unreadCount() {
  const res = await api.get("/notifications/unread-count/");
  const data = res.data?.data ?? res.data;
  return data.count;
}
async function markNotificationRead(id) {
  const res = await api.post(`/notifications/${id}/read/`);
  return res.data?.data ?? res.data;
}
async function markAllNotificationsRead() {
  const res = await api.post("/notifications/read-all/");
  const data = res.data?.data ?? res.data;
  return data.updated;
}
function targetFor(n, variant) {
  if (!n.resource_id) return null;
  if (variant === "marketplace") {
    if (n.resource_type === "service_request")
      return { to: "/marketplace/requests/$requestId", params: { requestId: n.resource_id } };
    return null;
  }
  if (n.resource_type === "service_request")
    return { to: "/admin/requests/$requestId", params: { requestId: n.resource_id } };
  if (n.resource_type === "provider")
    return { to: "/admin/providers/$providerId", params: { providerId: n.resource_id } };
  return null;
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
function NotificationBell({ variant = "admin" } = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: page, isLoading } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => listNotifications(1)
  });
  const { data: unread = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: unreadCount
  });
  const notifications = page?.results ?? [];
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  const markOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate
  });
  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate
  });
  function open(n) {
    if (!n.is_read) markOne.mutate(n.id);
    const t = targetFor(n, variant);
    if (t) navigate({ to: t.to, params: t.params });
  }
  return /* @__PURE__ */ jsxs(Popover, { children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", "aria-label": "Notifications", className: "relative", children: [
      /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
      unread > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground", children: unread })
    ] }) }),
    /* @__PURE__ */ jsxs(PopoverContent, { align: "end", className: "w-80 p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Notifications" }),
        unread > 0 && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => markAll.mutate(),
            disabled: markAll.isPending,
            className: "inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
              " Mark all read"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ScrollArea, { className: "max-h-80", children: [
        isLoading && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          " Loading…"
        ] }),
        !isLoading && notifications.length === 0 && /* @__PURE__ */ jsx("p", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "You're all caught up." }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: notifications.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => open(n),
            className: cn(
              "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
              !n.is_read && "bg-primary/5"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    n.is_read ? "bg-transparent" : "bg-primary"
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: n.title }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: n.body }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-muted-foreground/70", children: timeAgo(n.created_at) })
              ] })
            ]
          }
        ) }, n.id)) })
      ] })
    ] })
  ] });
}
const BASE_URL = "http://127.0.0.1:8000/api/v1";
function notificationsSocketUrl(token) {
  const origin = BASE_URL.replace(/\/api\/v1\/?$/, "");
  const wsBase = origin.replace(/^http/, "ws");
  return `${wsBase}/ws/notifications/?token=${encodeURIComponent(token)}`;
}
function getAccessToken() {
  return getAdminSession()?.access ?? getMarketplaceSession()?.access;
}
function useNotificationSocket() {
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  const retryRef = useRef(0);
  const closedRef = useRef(false);
  useEffect(() => {
    closedRef.current = false;
    let reconnectTimer;
    function connect() {
      const token = getAccessToken();
      if (!token) return;
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
        }
      };
      ws.onclose = () => {
        if (closedRef.current) return;
        const delay = Math.min(1e3 * 2 ** retryRef.current, 3e4);
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
export {
  NotificationBell as N,
  useNotificationSocket as u
};
