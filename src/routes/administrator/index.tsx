import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Inbox,
  Users,
  ListChecks,
  Wallet,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppState } from "@/lib/admin/store";
import { getProvider, formatCurrency } from "@/lib/admin/mock-data";

export const Route = createFileRoute("/administrator/")({
  head: () => ({
    meta: [{ title: "Dashboard — Casmara Systems Admin" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { requests, providers, tasks, payments } = useAppState();
  const navigate = useNavigate();

  const openRequests = requests.filter(
    (r) => r.status === "Open" || r.status === "Triaged"
  ).length;
  const activeProviders = providers.filter((p) => p.status === "Active").length;
  const pendingOnboarding = providers.filter((p) => p.status === "Pending").length;
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const pendingPayouts = payments
    .filter((p) => p.status === "Pending" || p.status === "Approved")
    .reduce((sum, p) => sum + p.net, 0);
  const monthGross = payments.reduce((sum, p) => sum + p.amount, 0);

  const recentRequests = [...requests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: "Open requests",
      value: openRequests,
      icon: Inbox,
      hint: "Awaiting triage or assignment",
    },
    {
      label: "Active providers",
      value: activeProviders,
      icon: Users,
      hint: `${pendingOnboarding} pending onboarding`,
    },
    {
      label: "Tasks in flight",
      value: openTasks,
      icon: ListChecks,
      hint: `${tasks.length} total tracked`,
    },
    {
      label: "Pending payouts",
      value: formatCurrency(pendingPayouts),
      icon: Wallet,
      hint: `${formatCurrency(monthGross)} processed this period`,
    },
  ];

  return (
    <AdminShell
      title="Operations dashboard"
      description="Live snapshot of marketplace activity across requests, providers, and remuneration."
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/administrator/providers">Onboard provider</Link>
          </Button>
          <Button asChild>
            <Link to="/administrator/requests">Triage requests</Link>
          </Button>
        </>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent requests</CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest 5 submissions from tenants & landlords
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/administrator/requests">
                View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((r) => {
                  const provider = getProvider(r.assignedProviderId);
                  return (
                    <TableRow
                      key={r.id}
                      className="cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: "/administrator/requests/$requestId",
                          params: { requestId: r.id },
                        })
                      }
                    >
                      <TableCell>
                        <p className="font-medium text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.id} • {r.requester}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">{r.category}</TableCell>
                      <TableCell>
                        <StatusBadge kind="priority" value={r.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge kind="request" value={r.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {provider ? provider.company : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Provider onboarding queue</CardTitle>
              <p className="text-xs text-muted-foreground">
                Awaiting verification & approval
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers
                .filter((p) => p.status === "Pending")
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.company} • {p.specialty}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/administrator/providers/$providerId" params={{ providerId: p.id }}>
                        Review
                      </Link>
                    </Button>
                  </div>
                ))}
              {providers.filter((p) => p.status === "Pending").length === 0 && (
                <p className="text-sm text-muted-foreground">All caught up.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Marketplace health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Avg. response time" value="48 min" icon={Clock} />
              <Row label="On-time completion" value="92%" />
              <Row label="Avg. provider rating" value="4.8 / 5" />
              <Row label="Disputed payments" value="1" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
