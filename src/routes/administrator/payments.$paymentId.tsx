import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, Receipt, CreditCard, ArrowLeft, ClipboardList, Package } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAdminInvoice,
  updateInvoiceStatus,
  releaseInvoicePayout,
  INVOICE_STATUS_LABEL,
  type InvoiceStatus,
} from "@/lib/api/invoices.api";

export const Route = createFileRoute("/administrator/payments/$paymentId")({
  head: () => ({ meta: [{ title: "Invoice detail — Casmara Systems Admin" }] }),
  component: PaymentDetailPage,
});

const STATUSES = Object.keys(INVOICE_STATUS_LABEL);

function formatCurrency(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

function PaymentDetailPage() {
  const { paymentId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: invoice, isLoading, isError } = useQuery({
    queryKey: ["invoice", paymentId],
    queryFn: () => getAdminInvoice(paymentId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: InvoiceStatus) => updateInvoiceStatus(paymentId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoice", paymentId] }),
  });

  const releaseMutation = useMutation({
    mutationFn: () => releaseInvoicePayout(paymentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoice", paymentId] }),
  });

  if (isLoading) {
    return (
      <AdminShell title="Invoice">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AdminShell>
    );
  }

  if (isError || !invoice) {
    return (
      <AdminShell title="Invoice not found">
        <p className="text-sm text-muted-foreground">
          This invoice does not exist.{" "}
          <Link to="/administrator/payments" className="text-primary hover:underline">
            Back to invoices
          </Link>
        </p>
      </AdminShell>
    );
  }

  const releasable = invoice.status === "pending" || invoice.status === "approved";

  return (
    <AdminShell
      title={invoice.invoice_number}
      description={`Invoiced ${new Date(invoice.invoiced_at).toLocaleString()}${invoice.paid_at ? ` • paid ${new Date(invoice.paid_at).toLocaleDateString()}` : ""}`}
      actions={
        <Button asChild variant="outline">
          <Link to="/administrator/payments">
            <ArrowLeft className="mr-2 h-4 w-4" /> All invoices
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge
                  kind="invoice"
                  value={invoice.status}
                  label={INVOICE_STATUS_LABEL[invoice.status] ?? invoice.status}
                />
                {invoice.method && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" /> {invoice.method}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Amount icon={Receipt} label="Gross" value={formatCurrency(Number(invoice.amount))} />
              <Amount
                icon={Wallet}
                label="Platform fee"
                value={formatCurrency(Number(invoice.platform_fee))}
                muted
              />
              <Amount
                icon={Wallet}
                label="Net to provider"
                value={formatCurrency(Number(invoice.net_amount))}
                accent
              />
            </CardContent>
          </Card>

          {(Number(invoice.materials_cost) > 0 || Number(invoice.labor_cost) > 0) && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Cost breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Materials</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {formatCurrency(Number(invoice.materials_cost))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Labor</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {formatCurrency(Number(invoice.labor_cost))}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {invoice.operation_notes && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Operation notes / issues experienced</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {invoice.operation_notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {invoice.work_order?.service_request && (
                <Link
                  to="/administrator/requests/$requestId"
                  params={{ requestId: invoice.work_order.service_request.id }}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Request
                  </p>
                  <p className="text-sm font-medium">{invoice.work_order.service_request.title}</p>
                </Link>
              )}
              {invoice.work_order && (
                <Link
                  to="/administrator/tasks/$taskId"
                  params={{ taskId: invoice.work_order.id }}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Work order
                  </p>
                  <p className="text-sm font-medium">{invoice.work_order.id}</p>
                </Link>
              )}
              {invoice.provider && (
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Provider
                  </p>
                  <p className="text-sm font-medium">{invoice.provider.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={invoice.status}
                onValueChange={(v) => statusMutation.mutate(v as InvoiceStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {INVOICE_STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={!releasable || releaseMutation.isPending}
                onClick={() => releaseMutation.mutate()}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {invoice.status === "paid" ? "Payout released" : "Release payout"}
              </Button>
              {invoice.status === "disputed" && (
                <p className="text-xs text-destructive">
                  This invoice is disputed. Resolve before releasing.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Amount({
  icon: Icon,
  label,
  value,
  muted,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md border border-border p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={
          accent
            ? "mt-1 text-xl font-bold text-success"
            : muted
              ? "mt-1 text-xl font-bold text-muted-foreground"
              : "mt-1 text-xl font-bold text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}
