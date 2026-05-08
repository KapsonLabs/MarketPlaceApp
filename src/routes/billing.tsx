import { createFileRoute, Link } from "@tanstack/react-router";
import { startTransition, useEffect, useState } from "react";
import { ArrowRight, CreditCard, Loader2, ReceiptText, Wallet } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { useCurrentUser } from "@/lib/current-user";
import { listUserBilling, recordPayment } from "@/lib/requests.functions";
import type { BillingRecord, BillingStatus } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Casmara Systems" },
      {
        name: "description",
        content: "Review estimates, outstanding balances and paid invoices for marketplace jobs.",
      },
    ],
  }),
  component: BillingPage,
});

const billingTone: Record<BillingStatus, string> = {
  Estimate: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  PartiallyPaid: "bg-primary/10 text-primary border-primary/30",
  Paid: "bg-success/15 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

function BillingPage() {
  const user = useCurrentUser();
  const [invoices, setInvoices] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);

  function reload() {
    if (!user) return;
    startTransition(() => {
      listUserBilling({ data: { userId: user.id } }).then((result) =>
        setInvoices(result.invoices),
      );
    });
  }

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    startTransition(() => {
      listUserBilling({ data: { userId: user.id } })
        .then((result) => setInvoices(result.invoices))
        .finally(() => setLoading(false));
    });
  }, [user]);

  async function handlePay(invoice: BillingRecord) {
    const isDeposit = invoice.status === "Pending";
    const amount = isDeposit ? Math.round(invoice.total * 0.4) : invoice.balance;
    const type = isDeposit ? "deposit" : "final";
    setPaying(invoice.id);
    try {
      await recordPayment({ data: { requestId: invoice.requestId, amount, type } });
      reload();
    } finally {
      setPaying(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing</h1>
              <p className="mt-2 text-muted-foreground">
                Review service estimates, balances due and completed payments for your jobs.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/requests">
                My requests <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!user ? (
            <GuestState />
          ) : loading ? (
            <LoadingState />
          ) : invoices.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <SummaryCard
                  icon={ReceiptText}
                  label="Open balance"
                  value={`USh ${invoices.reduce((sum, invoice) => sum + invoice.balance, 0).toLocaleString()}`}
                />
                <SummaryCard
                  icon={Wallet}
                  label="Paid so far"
                  value={`USh ${invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0).toLocaleString()}`}
                />
                <SummaryCard
                  icon={CreditCard}
                  label="Invoices"
                  value={invoices.length.toString()}
                />
              </div>

              <div className="mt-8 space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold text-foreground">
                              {invoice.title}
                            </h2>
                            <Badge variant="outline" className={billingTone[invoice.status]}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs font-mono text-muted-foreground">
                            {invoice.id}
                          </p>
                          <Link
                            to="/requests"
                            className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                          >
                            View request {invoice.requestId} →
                          </Link>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Issued {new Date(invoice.issuedAt).toLocaleDateString()} • Due{" "}
                            {new Date(invoice.dueAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4 text-right">
                          <p className="text-xs text-muted-foreground">Outstanding</p>
                          <p className="mt-1 text-2xl font-semibold text-foreground">
                            USh {invoice.balance.toLocaleString()}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Paid: USh {invoice.paidAmount.toLocaleString()} of USh{" "}
                            {invoice.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {invoice.lineItems.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm"
                          >
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">
                              USh {item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {(invoice.status === "Pending" || invoice.status === "PartiallyPaid") && (
                        <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {invoice.status === "Pending"
                                ? "Pay deposit to confirm job start"
                                : "Pay remaining balance to close job"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Amount due: USh {invoice.balance.toLocaleString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={paying === invoice.id}
                            onClick={() => handlePay(invoice)}
                          >
                            {paying === invoice.id ? (
                              <>
                                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                Processing…
                              </>
                            ) : invoice.status === "Pending" ? (
                              "Pay deposit"
                            ) : (
                              "Pay in full"
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-primary" />
        <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function GuestState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <ReceiptText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to view billing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your estimates, invoices and outstanding balances are saved to your marketplace account.
          </p>
        </div>
        <Button asChild>
          <Link to="/sign-in" search={{ redirect: "/billing" } as never}>
            Sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex items-center gap-3 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your billing records...
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <Wallet className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">No billing records yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Billing items appear here once you submit a request and it enters the service workflow.
          </p>
        </div>
        <Button asChild>
          <Link to="/request">Request service</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
