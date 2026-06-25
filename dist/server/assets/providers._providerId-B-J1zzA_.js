import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { B as Button } from "./button-BmLZMIt9.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-20 text-center", children: [
  /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Provider not found" }),
  /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsx(Link, { to: "/marketplace/providers", children: "Back to providers" }) })
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
