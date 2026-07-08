import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { listAllAdminInvoices, INVOICE_STATUS_LABEL } from "@/lib/api/invoices.api";
import { listAllProviders } from "@/lib/providers.api";

export const Route = createFileRoute("/administrator/payments/")({
  head: () => ({ meta: [{ title: "Invoices & Payments — Casmara Systems Admin" }] }),
  component: PaymentsPage,
});

const STATUSES = Object.keys(INVOICE_STATUS_LABEL);

function formatCurrency(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

function PaymentsPage() {
  const navigate = useNavigate();
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: listAllAdminInvoices,
  });
  const { data: providers = [] } = useQuery({
    queryKey: ["providers", "all"],
    queryFn: listAllProviders,
  });

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
      invoices.filter((inv) => {
        const haystack = [
          inv.id,
          inv.invoice_number,
          inv.provider?.name,
          inv.work_order?.service_request?.title,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesQuery = !query || haystack.includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
        const matchesProvider =
          providerFilter === "all" || String(inv.provider?.id) === providerFilter;
        const matchesDate = inDateRange(inv.invoiced_at, fromDate, toDate);
        const matchesAmount = inAmountRange(Number(inv.amount), minAmount, maxAmount);
        return (
          matchesQuery && matchesStatus && matchesProvider && matchesDate && matchesAmount
        );
      }),
    [invoices, query, statusFilter, providerFilter, fromDate, toDate, minAmount, maxAmount],
  );

  const totalGross = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const totalNet = invoices.reduce((s, i) => s + Number(i.net_amount), 0);
  const totalFees = invoices.reduce((s, i) => s + Number(i.platform_fee), 0);
  const pendingPayouts = invoices
    .filter((i) => i.status === "pending" || i.status === "approved")
    .reduce((s, i) => s + Number(i.net_amount), 0);
  const disputed = invoices.filter((i) => i.status === "disputed").length;

  const remuneration = useMemo(() => {
    const map = new Map<
      string,
      { paid: number; pending: number; jobs: number; name: string }
    >();
    for (const inv of invoices) {
      const key = String(inv.provider?.id ?? "unknown");
      const entry = map.get(key) ?? { paid: 0, pending: 0, jobs: 0, name: inv.provider?.name ?? "—" };
      entry.jobs += 1;
      if (inv.status === "paid") entry.paid += Number(inv.net_amount);
      else if (inv.status !== "disputed") entry.pending += Number(inv.net_amount);
      map.set(key, entry);
    }
    return Array.from(map.entries())
      .map(([providerId, v]) => ({ providerId, ...v }))
      .sort((a, b) => b.paid + b.pending - (a.paid + a.pending));
  }, [invoices]);

  const stats = [
    { label: "Gross processed", value: formatCurrency(totalGross), icon: TrendingUp, hint: `${invoices.length} invoices` },
    { label: "Platform fees", value: formatCurrency(totalFees), icon: Wallet, hint: "Marketplace fee" },
    { label: "Pending payouts", value: formatCurrency(pendingPayouts), icon: Wallet, hint: "Awaiting release" },
    { label: "Disputed", value: String(disputed), icon: AlertTriangle, hint: "Requires review" },
  ];

  return (
    <AdminShell
      title="Invoices & Payments"
      description="Track invoices generated from closed work orders, customer payments, platform fees, and provider payouts."
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
          <TabsTrigger value="transactions">Invoices</TabsTrigger>
          <TabsTrigger value="remuneration">Provider remuneration</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="border-border">
            <CardContent className="space-y-4 p-4 md:p-6">
              <FilterBar>
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search by invoice #, provider, request…"
                />
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allLabel="All statuses"
                  options={STATUSES.map((s) => ({ value: s, label: INVOICE_STATUS_LABEL[s] }))}
                />
                <FilterSelect
                  value={providerFilter}
                  onChange={setProviderFilter}
                  allLabel="All providers"
                  width="w-[190px]"
                  options={providers.map((p) => ({ value: p.id, label: p.business_name }))}
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
                      <TableHead>Invoice</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Request</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((inv) => (
                      <TableRow
                        key={inv.id}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate({
                            to: "/administrator/payments/$paymentId",
                            params: { paymentId: inv.id },
                          })
                        }
                      >
                        <TableCell>
                          <p className="font-medium text-foreground">{inv.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(inv.invoiced_at).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          <p className="font-medium text-foreground">{inv.provider?.name}</p>
                        </TableCell>
                        <TableCell className="text-sm">
                          <p>{inv.work_order?.service_request?.title}</p>
                          <p className="text-xs text-muted-foreground">{inv.work_order?.id}</p>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(Number(inv.amount))}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {formatCurrency(Number(inv.platform_fee))}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          {formatCurrency(Number(inv.net_amount))}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            kind="invoice"
                            value={inv.status}
                            label={INVOICE_STATUS_LABEL[inv.status] ?? inv.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {!isLoading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                          No invoices match your filters.
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
                      <TableHead className="text-right">Jobs invoiced</TableHead>
                      <TableHead className="text-right">Paid out</TableHead>
                      <TableHead className="text-right">Pending payout</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remuneration.map((row) => (
                      <TableRow key={row.providerId}>
                        <TableCell>
                          <p className="font-medium text-foreground">{row.name}</p>
                        </TableCell>
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
