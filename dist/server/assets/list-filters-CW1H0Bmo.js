import { jsxs, jsx } from "react/jsx-runtime";
import { Search, X } from "lucide-react";
import { I as Input } from "./input-D1RGD0cW.js";
import { c as cn, B as Button } from "./button-BmLZMIt9.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
function FilterBar({
  children,
  compact = false,
  summary,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-wrap items-center gap-2",
        compact && "rounded-lg border border-border bg-muted/20 px-3 py-2",
        className
      ),
      children: [
        children,
        summary ? /* @__PURE__ */ jsx("div", { className: "ml-auto text-xs text-muted-foreground", children: summary }) : null
      ]
    }
  );
}
function CompactFilterBar({
  children,
  summary,
  className
}) {
  return /* @__PURE__ */ jsx(FilterBar, { compact: true, summary, className, children });
}
function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  compact = false
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative min-w-[220px] flex-1 sm:max-w-sm",
        compact && "min-w-[180px] sm:max-w-xs",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          Search,
          {
            className: cn(
              "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground",
              compact ? "h-3.5 w-3.5" : "h-4 w-4"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            value,
            onChange: (e) => onChange(e.target.value),
            placeholder,
            className: cn("pl-8", compact && "h-8 text-xs")
          }
        )
      ]
    }
  );
}
function FilterSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  width = "w-[150px]",
  compact = false
}) {
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange: onChange, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: cn(width, compact && "h-8 text-xs"), children: /* @__PURE__ */ jsx(SelectValue, {}) }),
    /* @__PURE__ */ jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsx(SelectItem, { value: "all", children: allLabel }),
      options.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value))
    ] })
  ] });
}
function DateRangeFilter({
  from,
  to,
  onFrom,
  onTo,
  compact = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "date",
        "aria-label": "From date",
        value: from,
        max: to || void 0,
        onChange: (e) => onFrom(e.target.value),
        className: cn("w-[150px]", compact && "h-8 text-xs")
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "to" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "date",
        "aria-label": "To date",
        value: to,
        min: from || void 0,
        onChange: (e) => onTo(e.target.value),
        className: cn("w-[150px]", compact && "h-8 text-xs")
      }
    )
  ] });
}
function AmountRangeFilter({
  min,
  max,
  onMin,
  onMax,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  compact = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        min: "0",
        inputMode: "numeric",
        "aria-label": "Minimum amount",
        value: min,
        placeholder: minPlaceholder,
        onChange: (e) => onMin(e.target.value),
        className: cn("w-[110px]", compact && "h-8 text-xs")
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "-" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        min: "0",
        inputMode: "numeric",
        "aria-label": "Maximum amount",
        value: max,
        placeholder: maxPlaceholder,
        onChange: (e) => onMax(e.target.value),
        className: cn("w-[110px]", compact && "h-8 text-xs")
      }
    )
  ] });
}
function ClearFiltersButton({
  active,
  onClear,
  compact = false
}) {
  if (!active) return null;
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      size: "sm",
      onClick: onClear,
      className: cn(compact ? "h-8 px-2 text-xs" : "h-9"),
      children: [
        /* @__PURE__ */ jsx(X, { className: "mr-1 h-3.5 w-3.5" }),
        " Clear"
      ]
    }
  );
}
function inDateRange(iso, from, to) {
  if (!from && !to) return true;
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (from && t < (/* @__PURE__ */ new Date(`${from}T00:00:00`)).getTime()) return false;
  if (to && t > (/* @__PURE__ */ new Date(`${to}T23:59:59`)).getTime()) return false;
  return true;
}
function inAmountRange(amount, min, max) {
  if (!min && !max) return true;
  if (amount === void 0 || amount === null) return false;
  if (min && amount < Number(min)) return false;
  if (max && amount > Number(max)) return false;
  return true;
}
export {
  AmountRangeFilter as A,
  ClearFiltersButton as C,
  DateRangeFilter as D,
  FilterBar as F,
  SearchInput as S,
  FilterSelect as a,
  CompactFilterBar as b,
  inAmountRange as c,
  inDateRange as i
};
