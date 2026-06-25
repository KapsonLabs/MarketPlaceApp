import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FilterBar,
  SearchInput,
  FilterSelect,
  DateRangeFilter,
  AmountRangeFilter,
  ClearFiltersButton,
  inDateRange,
  inAmountRange,
} from "@/components/admin/list-filters";
import { useAppState } from "@/lib/admin/store";
import {
  getProvider,
  getRequest,
  formatCurrency,
  type PaymentStatus,
} from "@/lib/admin/mock-data";

export const Route = createFileRoute("/admin/payments/")({
  head: () => ({ meta: [{ title: "Payments — Casmara Systems Admin" }] }),
  component: PaymentsPage,
});

const STATUSES: PaymentStatus[] = ["Pending", "Approved", "Paid", "Disputed"];

function PaymentsPage() {
  const { payments, providers } = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const hasAdvanced =
    statusFilter !== "all" ||
    providerFilter !== "all" ||
    !!fromDate ||
    !!toDate ||
    !!minAmount ||
    !!maxAmount ||
    !!query;

  const clearAll = () => {
    setQuery("");
    setStatusFilter("all");
    setProviderFilter("all");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  const filtered = useMemo(
    () =>
      payments.filter((p) => {
        const r = getRequest(p.requestId);
        const sp = getProvider(p.providerId);
        const haystack = [p.id, p.requestId, sp?.company, sp?.name, r?.title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesQuery = !query || haystack.includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        const matchesProvider =
          providerFilter === "all" || p.providerId === providerFilter;
        const matchesDate = inDateRange(p.invoicedAt, fromDate, toDate);
        const matchesAmount = inAmountRange(p.amount, minAmount, maxAmount);
        return (
          matchesQuery &&
          matchesStatus &&
          matchesProvider &&
          matchesDate &&
          matchesAmount
        );
      }),
    [
      payments,
      query,
      statusFilter,
      providerFilter,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
    ]
  );


  const totalGross = payments.reduce((s, p) => s + p.amount, 0);
  const totalNet = payments.reduce((s, p) => s + p.net, 0);
  const totalFees = payments.reduce((s, p) => s + p.platformFee, 0);
  const pendingPayouts = payments
    .filter((p) => p.status === "Pending" || p.status === "Approved")
    .reduce((s, p) => s + p.net, 0);
  const disputed = payments.filter((p) => p.status === "Disputed").length;

  const remuneration = useMemo(() => {
    const map = new Map<string, { paid: number; pending: number; jobs: number }>();
    for (const p of payments) {
      const entry = map.get(p.providerId) ?? { paid: 0, pending: 0, jobs: 0 };
      entry.jobs += 1;
      if (p.status === "Paid") entry.paid += p.net;
      else if (p.status !== "Disputed") entry.pending += p.net;
      map.set(p.providerId, entry);
    }
    return Array.from(map.entries())
      .map(([providerId, v]) => ({ provider: getProvider(providerId)!, ...v }))
      .filter((r) => r.provider)
      .sort((a, b) => b.paid + b.pending - (a.paid + a.pending));
  }, [payments]);

  const stats = [
    { label: "Gross processed", value: formatCurrency(totalGross), icon: TrendingUp, hint: `${payments.length} transactions` },
    { label: "Platform fees", value: formatCurrency(totalFees), icon: Wallet, hint: "10% of gross" },
    { label: "Pending payouts", value: formatCurrency(pendingPayouts), icon: Wallet, hint: "Awaiting release" },
    { label: "Disputed", value: String(disputed), icon: AlertTriangle, hint: "Requires review" },
  ];

  return (
    <AdminShell
      title="Payments & remuneration"
      description="Track customer payments, platform fees, and provider payouts. Open a payment to update or release it."
      actions={
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="transactions" className="mt-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="remuneration">Provider remuneration</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="border-border">
            <CardContent className="space-y-4 p-4 md:p-6">
              <FilterBar>
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search by ID, provider, request…"
                />
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allLabel="All statuses"
                  options={STATUSES.map((s) => ({ value: s, label: s }))}
                />
                <FilterSelect
                  value={providerFilter}
                  onChange={setProviderFilter}
                  allLabel="All providers"
                  width="w-[190px]"
                  options={providers.map((p) => ({ value: p.id, label: p.company }))}
                />
                <DateRangeFilter
                  from={fromDate}
                  to={toDate}
                  onFrom={setFromDate}
                  onTo={setToDate}
                />
                <AmountRangeFilter
                  min={minAmount}
                  max={maxAmount}
                  onMin={setMinAmount}
                  onMax={setMaxAmount}
                  minPlaceholder="Gross min"
                  maxPlaceholder="Gross max"
                />
                <ClearFiltersButton active={hasAdvanced} onClear={clearAll} />
                <p className="ml-auto text-xs text-muted-foreground">
                  Net to providers: {formatCurrency(totalNet)}
                </p>
              </FilterBar>


              <div className="overflow-hidden rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Request</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => {
                      const sp = getProvider(p.providerId);
                      const r = getRequest(p.requestId);
                      return (
                        <TableRow
                          key={p.id}
                          className="cursor-pointer"
                          onClick={() =>
                            navigate({
                              to: "/admin/payments/$paymentId",
                              params: { paymentId: p.id },
                            })
                          }
                        >
                          <TableCell>
                            <p className="font-medium text-foreground">{p.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(p.invoicedAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            <p className="font-medium text-foreground">{sp?.company}</p>
                            <p className="text-xs text-muted-foreground">{sp?.name}</p>
                          </TableCell>
                          <TableCell className="text-sm">
                            <p>{r?.title}</p>
                            <p className="text-xs text-muted-foreground">{p.requestId}</p>
                          </TableCell>
                          <TableCell className="text-sm">{p.method}</TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCurrency(p.amount)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {formatCurrency(p.platformFee)}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {formatCurrency(p.net)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge kind="payment" value={p.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                          No payments match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remuneration">
          <Card className="border-border">
            <CardContent className="p-4 md:p-6">
              <div className="overflow-hidden rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead className="text-right">Jobs invoiced</TableHead>
                      <TableHead className="text-right">Paid out</TableHead>
                      <TableHead className="text-right">Pending payout</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remuneration.map((row) => (
                      <TableRow
                        key={row.provider.id}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate({
                            to: "/admin/providers/$providerId",
                            params: { providerId: row.provider.id },
                          })
                        }
                      >
                        <TableCell>
                          <p className="font-medium text-foreground">{row.provider.company}</p>
                          <p className="text-xs text-muted-foreground">{row.provider.name}</p>
                        </TableCell>
                        <TableCell className="text-sm">{row.provider.specialty}</TableCell>
                        <TableCell className="text-right text-sm">{row.jobs}</TableCell>
                        <TableCell className="text-right text-sm font-medium text-success">
                          {formatCurrency(row.paid)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(row.pending)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
