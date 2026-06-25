import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, EyeOff, Eye, Loader2, ArrowRight } from "lucide-react";
import { S as SiteHeader, a as SiteFooter } from "./site-header-DLcj2SGD.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent } from "./card-DkWCRhLz.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-qL8K6F2E.js";
import { R as Route, l as loginMarketplace } from "./router-rAJgq2Yd.js";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "axios";
import "zod";
import "./server-ChUyfcIq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./request-types-C9A69B28.js";
function SignInPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTo = search.redirect?.startsWith("/") ? search.redirect : "/marketplace/requests";
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  function handleModeChange(value) {
    setMode(value);
    setUsername("");
    setPassword("");
    setError(null);
  }
  async function onSubmit(e) {
    e.preventDefault();
    if (mode === "create") return;
    setError(null);
    setLoading(true);
    try {
      await loginMarketplace({
        username: username.trim(),
        password
      });
      const redirectUrl = new URL(redirectTo, window.location.origin);
      navigate({
        to: redirectUrl.pathname,
        search: Object.fromEntries(redirectUrl.searchParams)
      });
    } catch (err) {
      const axiosError = err;
      setError(axiosError.uiMessage ?? (err instanceof Error ? err.message : "Invalid username or password."));
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:py-16", children: [
      /* @__PURE__ */ jsx("section", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5 text-primary" }),
          "Member app and direct access"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl", children: "Sign in to request facility management services." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: "Use your marketplace account to track service requests, provider assignment and billing in one place." })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "border-border shadow-[var(--shadow-elegant)]", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxs(Tabs, { value: mode, onValueChange: (value) => handleModeChange(value), children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "login", children: "Log in" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "create", children: "Create account" })
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "login", className: "mt-6", children: /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Username", id: "username", children: /* @__PURE__ */ jsx(Input, { id: "username", type: "text", autoComplete: "username", required: true, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "client", disabled: loading }) }),
            /* @__PURE__ */ jsx(Field, { label: "Password", id: "password", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Input, { id: "password", type: showPassword ? "text" : "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), disabled: loading, className: "pr-10" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", tabIndex: -1, children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
            ] }) }),
            error && /* @__PURE__ */ jsx("p", { className: "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive", children: error }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", size: "lg", className: "w-full", disabled: loading, children: [
              loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Log in",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "create", className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Registration coming soon" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "New account signup is not available yet. Contact support if you need access." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-5 text-center text-xs text-muted-foreground", children: [
          "Providers can apply from",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/marketplace/for-providers", className: "font-medium text-primary", children: "For providers" }),
          "."
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
function Field({
  label,
  id,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, children: label }),
    children
  ] });
}
export {
  SignInPage as component
};
