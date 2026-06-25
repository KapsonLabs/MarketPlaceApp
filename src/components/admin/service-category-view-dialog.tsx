import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/provider-badges";
import { getServiceCategory } from "@/lib/service-categories.api";

export function ServiceCategoryViewDialog({
  categoryId,
  onClose,
}: {
  categoryId: string | null;
  onClose: () => void;
}) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["service-category", categoryId],
    queryFn: () => getServiceCategory(categoryId as string),
    enabled: !!categoryId,
  });

  return (
    <Dialog open={!!categoryId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Service category</DialogTitle>
        </DialogHeader>
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {(error as { uiMessage?: string; message?: string }).uiMessage ??
              (error as Error).message ??
              "Failed to load category."}
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            <Row label="Name">
              <span className="font-medium text-foreground">{data.name}</span>
            </Row>
            <Row label="Slug">
              <span className="font-mono text-xs text-muted-foreground">
                {data.slug || "—"}
              </span>
            </Row>
            <Row label="Description">
              <span className="text-foreground">{data.description || "—"}</span>
            </Row>
            <Row label="Icon">
              <span className="text-foreground">{data.icon || "—"}</span>
            </Row>
            <Row label="Status">
              <StatusBadge value={data.is_active ? "active" : "inactive"} />
            </Row>
            <Row label="Display order">
              <span className="text-foreground">{data.display_order}</span>
            </Row>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
