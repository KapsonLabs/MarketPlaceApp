import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaginatedDataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  totalCount: number;
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  onRowClick?: (row: TData) => void;
  className?: string;
}

export function PaginatedDataTable<TData>({
  columns,
  data,
  totalCount,
  page,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  isLoading = false,
  isError = false,
  emptyMessage = "No results.",
  errorMessage = "Failed to load. Please try again.",
  onRowClick,
  className,
}: PaginatedDataTableProps<TData>) {
  const empty = isLoading ? "Loading…" : isError ? errorMessage : emptyMessage;

  return (
    <Card className="border-border overflow-hidden">
      <DataTable
        columns={columns}
        data={isLoading || isError ? [] : data}
        emptyMessage={empty}
        onRowClick={onRowClick}
        className={className}
      />
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Page {page} · {totalCount} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev || isLoading}
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext || isLoading}
            onClick={onNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
