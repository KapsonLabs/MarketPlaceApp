import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import "lucide-react";
import "./input-D1RGD0cW.js";
import "react";
import "./button-BmLZMIt9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "./router-rAJgq2Yd.js";
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
const SplitNotFoundComponent = () => /* @__PURE__ */ jsx(AdminShell, { title: "Task not found", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
  "This task does not exist.",
  " ",
  /* @__PURE__ */ jsx(Link, { to: "/admin/tasks", className: "text-primary hover:underline", children: "Back to tasks" })
] }) });
export {
  SplitNotFoundComponent as notFoundComponent
};
