import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Wallet, Receipt, CreditCard } from "lucide-react";
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
import { useAppState } from "@/lib/admin/store";
import { setPaymentStatus, releasePayout } from "@/lib/admin/store";
import {
  getProvider,
  getRequest,
  formatCurrency,
  type PaymentStatus,
} from "@/lib/admin/mock-data";

export const Route = createFileRoute("/administrator/payments/$paymentId")({
  head: () => ({ meta: [{ title: "Payment detail — Casmara Systems Admin" }] }),
  component: PaymentDetailPage,
  notFoundComponent: () => (
    <AdminShell title="Payment not found">
      <p className="text-sm text-muted-foreground">
        This payment does not exist.{" "}
        <Link to="/administrator/payments" className="text-primary hover:underline">
          Back to payments
        </Link>
      </p>
    </AdminShell>
  ),
});

const STATUSES: PaymentStatus[] = ["Pending", "Approved", "Paid", "Disputed"];

function PaymentDetailPage() {
  const { paymentId } = Route.useParams();
  const { payments } = useAppState();
  const payment = payments.find((p) => p.id === paymentId);

  if (!payment) throw notFound();

  const provider = getProvider(payment.providerId);
  const request = getRequest(payment.requestId);
  const releasable = payment.status === "Pending" || payment.status === "Approved";

  return (
    <AdminShell
      title={`Payment ${payment.id}`}
      description={`Invoiced ${new Date(payment.invoicedAt).toLocaleString()}${payment.paidAt ? ` • paid ${new Date(payment.paidAt).toLocaleDateString()}` : ""}`}
      actions={
        <Button asChild variant="outline">
          <Link to="/administrator/payments">
            <ArrowLeft className="mr-2 h-4 w-4" /> All payments
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge kind="payment" value={payment.status} />
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" /> {payment.method}
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Amount icon={Receipt} label="Gross" value={formatCurrency(payment.amount)} />
              <Amount icon={Wallet} label="Platform fee" value={formatCurrency(payment.platformFee)} muted />
              <Amount icon={Wallet} label="Net to provider" value={formatCurrency(payment.net)} accent />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {request && (
                <Link
                  to="/administrator/requests/$requestId"
                  params={{ requestId: request.id }}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Request
                  </p>
                  <p className="text-sm font-medium">{request.title}</p>
                  <p className="text-xs text-muted-foreground">{request.id}</p>
                </Link>
              )}
              {provider && (
                <Link
                  to="/administrator/providers/$providerId"
                  params={{ providerId: provider.id }}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Provider
                  </p>
                  <p className="text-sm font-medium">{provider.company}</p>
                  <p className="text-xs text-muted-foreground">{provider.name}</p>
                </Link>
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
                value={payment.status}
                onValueChange={(v) => setPaymentStatus(payment.id, v as PaymentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={!releasable}
                onClick={() => releasePayout(payment.id)}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {payment.status === "Paid" ? "Payout released" : "Release payout"}
              </Button>
              {payment.status === "Disputed" && (
                <p className="text-xs text-destructive">
                  This payment is disputed. Resolve before releasing.
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
