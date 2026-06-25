import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { Home, LogOut } from "lucide-react";
import { B as Button } from "./button-BmLZMIt9.js";
import { u as useNotificationSocket, N as NotificationBell } from "./notifications.ws-DJ822Bff.js";
import { useState, useEffect } from "react";
import { u as useMarketplaceSession, k as getMarketplaceSession, m as clearMarketplaceSession } from "./router-rAJgq2Yd.js";
const AUTH_EVENT = "casmara-marketplace-auth";
function apiUserToCurrentUser(user) {
  const name = `${user.first_name} ${user.last_name}`.trim() || user.username;
  return {
    id: user.id,
    name,
    email: user.email,
    phone: "",
    audience: "public"
  };
}
function readCurrentUser() {
  const session = getMarketplaceSession();
  return session ? apiUserToCurrentUser(session.user) : null;
}
function signOutUser() {
  clearMarketplaceSession();
}
function useCurrentUser() {
  const session = useMarketplaceSession();
  const [user, setUser] = useState(() => readCurrentUser());
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
function SiteHeader() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  useNotificationSocket();
  function onSignOut() {
    signOutUser();
    navigate({ to: "/marketplace" });
  }
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/marketplace", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(Home, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Casmara Systems" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Service marketplace" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-6 md:flex", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace/providers",
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-sm font-medium text-foreground" },
          children: "Browse providers"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace/requests",
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-sm font-medium text-foreground" },
          children: "My requests"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace/billing",
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-sm font-medium text-foreground" },
          children: "Billing"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace/how-it-works",
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-sm font-medium text-foreground" },
          children: "How it works"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace/for-providers",
          className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
          activeProps: { className: "text-sm font-medium text-foreground" },
          children: "For providers"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      user ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NotificationBell, { variant: "marketplace" }),
        /* @__PURE__ */ jsx("span", { className: "hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline", children: user.name }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "hidden sm:inline-flex",
            onClick: onSignOut,
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "mr-1 h-4 w-4" }),
              "Sign out"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/sign-in", children: "Sign in" }) }),
      /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/request", children: "Request service" }) })
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Casmara Systems."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/marketplace/how-it-works", className: "hover:text-foreground", children: "How it works" }),
      /* @__PURE__ */ jsx(Link, { to: "/marketplace/for-providers", className: "hover:text-foreground", children: "For providers" }),
      /* @__PURE__ */ jsx(Link, { to: "/marketplace/requests", className: "hover:text-foreground", children: "My requests" }),
      /* @__PURE__ */ jsx(Link, { to: "/marketplace/billing", className: "hover:text-foreground", children: "Billing" })
    ] })
  ] }) });
}
export {
  SiteHeader as S,
  SiteFooter as a,
  useCurrentUser as u
};
