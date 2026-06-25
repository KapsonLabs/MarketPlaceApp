import { jsx, jsxs } from "react/jsx-runtime";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, EyeOff, Eye, Loader2 } from "lucide-react";
import { B as Button } from "./button-BmLZMIt9.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DkWCRhLz.js";
import { f as Route, g as loginAdmin } from "./router-rAJgq2Yd.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@tanstack/react-query";
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
function AdminLoginPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin({
        username: username.trim(),
        password
      });
      router.navigate({
        to: search.redirect ?? "/admin"
      });
    } catch (err) {
      const axiosError = err;
      setError(axiosError.uiMessage ?? (err instanceof Error ? err.message : "Invalid username or password."));
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col items-center gap-3 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-md", children: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-7 w-7" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight text-foreground", children: "Casmara Systems" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Admin console" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border shadow-sm", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Sign in to your account" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Enter your admin credentials to continue." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
          /* @__PURE__ */ jsx(Input, { id: "username", type: "text", autoComplete: "username", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "admin@gmail.com", required: true, disabled: loading })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Input, { id: "password", type: showPassword ? "text" : "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: loading, className: "pr-10" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", tabIndex: -1, children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Sign in"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "This portal is restricted to authorised admin staff only." })
  ] }) });
}
export {
  AdminLoginPage as component
};
