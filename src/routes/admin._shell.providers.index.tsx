import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { AlertCircle, ArrowUpRight, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/provider-badges";
import {
  listProviders,
  nextPageParam,
  type ProviderListItem,
} from "@/lib/providers.api";

export const Route = createFileRoute("/admin/_shell/providers/")({
  head: () => ({ meta: [{ title: "Providers — Casmara Admin" }] }),
  component: ProvidersListPage,
});

const columnHelper = createColumnHelper<ProviderListItem>();

const columns = [
  columnHelper.accessor("business_name", {
    header: "Provider",
    cell: (info) => (
      <div className="flex flex-col">
        <Link
          to="/admin/providers/$providerId"
          params={{ providerId: info.row.original.id }}
          className="font-medium text-foreground hover:text-primary hover:underline"
        >
          {info.getValue()}
        </Link>
        <span className="text-xs capitalize text-muted-foreground">
          {info.row.original.provider_type}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("average_rating", {
    header: "Rating",
    cell: (info) => (
      <div className="flex items-center gap-1 text-sm">
        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
        <span className="font-medium text-foreground">{info.getValue()}</span>
        <span className="text-xs text-muted-foreground">
          ({info.row.original.rating_count})
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("jobs_completed", {
    header: "Jobs",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("verification_status", {
    header: "Verification",
    cell: (info) => <StatusBadge value={info.getValue()} />,
  }),
  columnHelper.accessor("availability_status", {
    header: "Availability",
    cell: (info) => <StatusBadge value={info.getValue()} />,
  }),
  columnHelper.display({
    id: "location",
    header: "Location",
    cell: (info) => {
      const { city, country } = info.row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {[city, country].filter(Boolean).join(", ") || "—"}
        </span>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Joined",
    cell: (info) => (
      <span className="text-xs text-muted-foreground">
        {new Date(info.getValue()).toLocaleDateString()}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <Button asChild size="sm" variant="ghost">
        <Link
          to="/admin/providers/$providerId"
          params={{ providerId: info.row.original.id }}
        >
          View <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </Button>
    ),
  }),
];

function ProvidersListPage() {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["providers"],
    queryFn: ({ pageParam }) => listProviders(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
  });

  const rows = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );
  const total = data?.pages[0]?.count ?? 0;

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Providers
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isPending ? "Loading providers…" : `${total} registered providers`}
          </p>
        </div>
      </div>

      <Card className="mt-8 border-border">
        <CardContent className="p-0">
          {isError ? (
            <div className="flex items-center gap-2 p-8 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {(error as { uiMessage?: string; message?: string }).uiMessage ??
                (error as Error).message ??
                "Failed to load providers."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isPending ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_c, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No providers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
