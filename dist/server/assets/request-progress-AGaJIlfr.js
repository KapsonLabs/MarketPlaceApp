import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./button-BmLZMIt9.js";
function parseAmount(value) {
  if (!value) return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}
function formatMoney(amount, compact = false) {
  const n = typeof amount === "number" ? amount : parseAmount(amount);
  if (compact && n >= 1e6) return `USh ${(n / 1e6).toFixed(1)}M`;
  if (compact && n >= 1e5) return `USh ${Math.round(n / 1e3)}K`;
  return `USh ${Math.round(n).toLocaleString()}`;
}
function requestTotal(request) {
  const cost = parseAmount(request.estimated_cost);
  if (cost > 0) return cost;
  return parseAmount(request.estimated_budget);
}
function requestBalance(request) {
  const total = requestTotal(request);
  const paid = parseAmount(request.amount_paid);
  if (request.payment_status === "paid") return 0;
  return Math.max(total - paid, 0);
}
function prettify(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function formatTime(value) {
  if (!value) return "—";
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  return value;
}
const PROGRESS_STEPS = [
  { key: "submitted", label: "Submitted", short: "Sent" },
  { key: "approved", label: "Approved", short: "Approved" },
  { key: "awaiting_assignment", label: "Deposit & queue", short: "Deposit" },
  { key: "assigned", label: "Assigned", short: "Match" },
  { key: "in_progress", label: "In progress", short: "Work" },
  { key: "completed", label: "Completed", short: "Done" }
];
const STATUS_ORDER = {
  submitted: 0,
  approved: 1,
  awaiting_assignment: 2,
  assigned: 3,
  accepted: 3,
  in_progress: 4,
  on_hold: 4,
  completed: 5,
  rejected: -1,
  cancelled: -1
};
function isTerminalStatus(status) {
  return status === "rejected" || status === "cancelled";
}
function RequestProgress({ status }) {
  if (isTerminalStatus(status)) {
    return /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "This request was ",
      status.replace(/_/g, " "),
      " and is closed."
    ] });
  }
  const currentIndex = STATUS_ORDER[status] ?? 0;
  const currentStep = PROGRESS_STEPS[currentIndex] ?? PROGRESS_STEPS[0];
  const progressPct = currentIndex / (PROGRESS_STEPS.length - 1) * 100;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: currentStep.label }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        "Step ",
        currentIndex + 1,
        " of ",
        PROGRESS_STEPS.length
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-y-0 left-0 rounded-full bg-primary transition-all",
        style: { width: `${Math.max(progressPct, 8)}%` }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-between gap-1", children: PROGRESS_STEPS.map((step, index) => {
      const done = currentIndex > index;
      const current = currentIndex === index;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex min-w-0 flex-1 flex-col items-center gap-1 text-center",
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "flex h-2 w-2 rounded-full",
                  done && "bg-primary",
                  current && "bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                  !done && !current && "bg-muted-foreground/30"
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "hidden text-[10px] leading-tight sm:block",
                  current ? "font-medium text-foreground" : "text-muted-foreground"
                ),
                children: step.short
              }
            )
          ]
        },
        step.key
      );
    }) })
  ] });
}
export {
  RequestProgress as R,
  requestTotal as a,
  formatDate as b,
  formatTime as c,
  formatMoney as f,
  isTerminalStatus as i,
  prettify as p,
  requestBalance as r
};
