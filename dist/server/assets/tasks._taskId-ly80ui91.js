import { jsx, jsxs } from "react/jsx-runtime";
import { notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ArrowLeft } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { u as useAppState, g as getProvider, a as getRequest, S as StatusBadge, b as updateTask, c as canTransitionTask, T as TASK_STATUS_LABEL, m as moveTask } from "./store-B0Ckyr1G.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-DkWCRhLz.js";
import { B as Button } from "./button-BmLZMIt9.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { T as Textarea } from "./textarea-DOyZGKZq.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
import { n as Route } from "./router-rAJgq2Yd.js";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@tanstack/react-query";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "./badge-BAnpIKa2.js";
import "class-variance-authority";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
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
const COLUMNS = ["Todo", "InProgress", "Blocked", "Done"];
function TaskDetailPage() {
  const {
    taskId
  } = Route.useParams();
  const {
    tasks
  } = useAppState();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw notFound();
  const provider = getProvider(task.providerId);
  const request = getRequest(task.requestId);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [dueDate, setDueDate] = useState(task.dueDate);
  return /* @__PURE__ */ jsx(AdminShell, { title: task.title, description: `${task.id} • ${request?.title ?? task.requestId}`, actions: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/tasks", children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
    " All tasks"
  ] }) }), children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-6 lg:col-span-2", children: /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(StatusBadge, { kind: "task", value: task.status }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(CalendarClock, { className: "h-3.5 w-3.5" }),
          "Due ",
          new Date(task.dueDate).toLocaleDateString()
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "dueDate", children: "Due date" }),
          /* @__PURE__ */ jsx(Input, { id: "dueDate", type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: "max-w-xs" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notes" }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", rows: 4, placeholder: "Add coordination notes…", value: notes, onChange: (e) => setNotes(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => updateTask(task.id, {
          notes,
          dueDate
        }), children: "Save changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Status" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Select, { value: task.status, onValueChange: (v) => moveTask(task.id, v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: COLUMNS.map((s) => {
              const allowed = canTransitionTask(task.status, s);
              return /* @__PURE__ */ jsxs(SelectItem, { value: s, disabled: !allowed, children: [
                TASK_STATUS_LABEL[s],
                !allowed && s !== task.status ? " — not allowed" : ""
              ] }, s);
            }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: task.status === "Done" ? "Completed tasks are locked and cannot be reopened." : `Allowed next: ${COLUMNS.filter((s) => s !== task.status && canTransitionTask(task.status, s)).map((s) => TASK_STATUS_LABEL[s]).join(", ") || "none"}.` })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Linked records" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          request && /* @__PURE__ */ jsxs(Link, { to: "/admin/requests/$requestId", params: {
            requestId: request.id
          }, className: "block rounded-md border border-border p-3 transition-colors hover:bg-accent/50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Request" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: request.title })
          ] }),
          provider && /* @__PURE__ */ jsxs(Link, { to: "/admin/providers/$providerId", params: {
            providerId: provider.id
          }, className: "block rounded-md border border-border p-3 transition-colors hover:bg-accent/50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Provider" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: provider.company }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: provider.name })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  TaskDetailPage as component
};
