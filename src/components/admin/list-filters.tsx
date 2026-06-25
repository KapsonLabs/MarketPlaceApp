import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterBar({
  children,
  compact = false,
  summary,
  className,
}: {
  children: React.ReactNode;
  compact?: boolean;
  summary?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact && "rounded-lg border border-border bg-muted/20 px-3 py-2",
        className,
      )}
    >
      {children}
      {summary ? (
        <div className="ml-auto text-xs text-muted-foreground">{summary}</div>
      ) : null}
    </div>
  );
}

export function CompactFilterBar({
  children,
  summary,
  className,
}: {
  children: React.ReactNode;
  summary?: React.ReactNode;
  className?: string;
}) {
  return (
    <FilterBar compact summary={summary} className={className}>
      {children}
    </FilterBar>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative min-w-[220px] flex-1 sm:max-w-sm",
        compact && "min-w-[180px] sm:max-w-xs",
        className,
      )}
    >
      <Search
        className={cn(
          "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground",
          compact ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-8", compact && "h-8 text-xs")}
      />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  width = "w-[150px]",
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  allLabel?: string;
  width?: string;
  compact?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(width, compact && "h-8 text-xs")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DateRangeFilter({
  from,
  to,
  onFrom,
  onTo,
  compact = false,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="date"
        aria-label="From date"
        value={from}
        max={to || undefined}
        onChange={(e) => onFrom(e.target.value)}
        className={cn("w-[150px]", compact && "h-8 text-xs")}
      />
      <span className="text-xs text-muted-foreground">to</span>
      <Input
        type="date"
        aria-label="To date"
        value={to}
        min={from || undefined}
        onChange={(e) => onTo(e.target.value)}
        className={cn("w-[150px]", compact && "h-8 text-xs")}
      />
    </div>
  );
}

export function AmountRangeFilter({
  min,
  max,
  onMin,
  onMax,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  compact = false,
}: {
  min: string;
  max: string;
  onMin: (v: string) => void;
  onMax: (v: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="number"
        min="0"
        inputMode="numeric"
        aria-label="Minimum amount"
        value={min}
        placeholder={minPlaceholder}
        onChange={(e) => onMin(e.target.value)}
        className={cn("w-[110px]", compact && "h-8 text-xs")}
      />
      <span className="text-xs text-muted-foreground">-</span>
      <Input
        type="number"
        min="0"
        inputMode="numeric"
        aria-label="Maximum amount"
        value={max}
        placeholder={maxPlaceholder}
        onChange={(e) => onMax(e.target.value)}
        className={cn("w-[110px]", compact && "h-8 text-xs")}
      />
    </div>
  );
}

export function ClearFiltersButton({
  active,
  onClear,
  compact = false,
}: {
  active: boolean;
  onClear: () => void;
  compact?: boolean;
}) {
  if (!active) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      className={cn(compact ? "h-8 px-2 text-xs" : "h-9")}
    >
      <X className="mr-1 h-3.5 w-3.5" /> Clear
    </Button>
  );
}

// ---------- Filter predicates ----------

export function inDateRange(iso: string | undefined, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (from && t < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && t > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}

export function inAmountRange(amount: number | undefined, min: string, max: string): boolean {
  if (!min && !max) return true;
  if (amount === undefined || amount === null) return false;
  if (min && amount < Number(min)) return false;
  if (max && amount > Number(max)) return false;
  return true;
}
