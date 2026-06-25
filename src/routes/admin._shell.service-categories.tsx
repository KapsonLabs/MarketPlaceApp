import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, ArrowUpRight } from "lucide-react";
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
import { ServiceCategoryCreateDialog } from "@/components/admin/service-category-create-dialog";
import { ServiceCategoryViewDialog } from "@/components/admin/service-category-view-dialog";
import { listServiceCategories } from "@/lib/service-categories.api";

export const Route = createFileRoute("/admin/_shell/service-categories")({
  head: () => ({ meta: [{ title: "Service categories — Casmara Admin" }] }),
  component: ServiceCategoriesPage,
});

function ServiceCategoriesPage() {
  const [viewId, setViewId] = useState<string | null>(null);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories,
  });

  const categories = data?.results ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Service categories
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isPending
              ? "Loading categories…"
              : `${data?.count ?? 0} categories`}
          </p>
        </div>
        <ServiceCategoryCreateDialog />
      </div>

      <Card className="mt-8 border-border">
        <CardContent className="p-0">
          {isError ? (
            <div className="flex items-center gap-2 p-8 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {(error as { uiMessage?: string; message?: string }).uiMessage ??
                (error as Error).message ??
                "Failed to load categories."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_c, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No categories yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-foreground">
                        {c.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.slug || "—"}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">
                        {c.description || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.icon || "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={c.is_active ? "active" : "inactive"} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.display_order}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewId(c.id)}
                        >
                          View <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ServiceCategoryViewDialog
        categoryId={viewId}
        onClose={() => setViewId(null)}
      />
    </div>
  );
}
