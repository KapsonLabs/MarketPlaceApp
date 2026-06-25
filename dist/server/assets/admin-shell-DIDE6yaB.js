import { jsx, jsxs } from "react/jsx-runtime";
import { useRouter, Link } from "@tanstack/react-router";
import { LayoutDashboard, Inbox, Users, ListChecks, Wallet, LogOut, Search } from "lucide-react";
import { I as Input } from "./input-D1RGD0cW.js";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { c as cn, B as Button } from "./button-BmLZMIt9.js";
import { u as useNotificationSocket, N as NotificationBell } from "./notifications.ws-DJ822Bff.js";
import { t as useAdminSession, v as clearAdminSession } from "./router-rAJgq2Yd.js";
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/requests", label: "Requests", icon: Inbox },
  { to: "/admin/providers", label: "Providers", icon: Users },
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { to: "/admin/payments", label: "Payments", icon: Wallet }
];
function AdminShell({
  title,
  description,
  actions,
  children
}) {
  const router = useRouter();
  const session = useAdminSession();
  const user = session?.user;
  useNotificationSocket();
  const displayName = user && `${user.first_name} ${user.last_name}`.trim() ? `${user.first_name} ${user.last_name}`.trim() : user?.username ?? "Admin";
  function handleSignOut() {
    clearAdminSession();
    router.navigate({ to: "/admin/login" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center gap-2 border-b border-sidebar-border px-5", children: [
        /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold", children: "H" }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Casmara Systems" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-sidebar-foreground/70", children: "Admin console" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1 p-3", children: navItems.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            activeOptions: { exact: item.to === "/admin" },
            activeProps: {
              className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-sidebar-primary text-sidebar-primary-foreground font-medium"
            },
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-sidebar-border p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-md px-2 py-2", children: [
        /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-sidebar-primary text-sidebar-primary-foreground text-xs", children: displayName.slice(0, 2).toUpperCase() || "AO" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 leading-tight", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium", children: displayName }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-[11px] text-sidebar-foreground/60", children: user?.email })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: handleSignOut,
            className: "h-7 w-7 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground",
            title: "Sign out",
            children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search requests, providers, payments…",
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(NotificationBell, {}),
        /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 md:hidden", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs", children: "AO" }) })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight md:text-3xl", children: title }),
            description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })
          ] }),
          actions && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: actions })
        ] }),
        children
      ] })
    ] })
  ] });
}
export {
  AdminShell as A,
  Avatar as a,
  AvatarFallback as b,
  AvatarImage as c
};
