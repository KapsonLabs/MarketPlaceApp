import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/provider-badges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { listAllProviders } from "@/lib/providers.api";
import { listServiceCategories } from "@/lib/service-categories.api";
import {
  approveServiceRequest,
  assignServiceRequest,
  getAdminServiceRequest,
  setEstimatedCost,
  type RequestPayment,
  type ServiceRequestDetail,
} from "@/lib/service-requests.api";

export const Route = createFileRoute("/administrator/requests/$requestId")({
  head: () => ({ meta: [{ title: "Request detail — Casmara Systems Admin" }] }),
  component: RequestDetailPage,
  notFoundComponent: () => (
    <AdminShell title="Request not found">
      <p className="text-sm text-muted-foreground">
        This request does not exist.{" "}
        <Link to="/administrator/requests" className="text-primary hover:underline">
          Back to requests
        </Link>
      </p>
    </AdminShell>
  ),
});

function RequestDetailPage() {
  const { requestId } = Route.useParams();
  const queryClient = useQueryClient();

  const requestQuery = useQuery({
    queryKey: ["admin-service-request", requestId],
    queryFn: () => getAdminServiceRequest(requestId),
  });

  const [approveOpen, setApproveOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [estimatedCostInput, setEstimatedCostInput] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignProviderId, setAssignProviderId] = useState("");
  const [assignReason, setAssignReason] = useState("");

  const approveMutation = useMutation({
    mutationFn: () => approveServiceRequest(requestId),
    onSuccess: (data) => {
      setApproveOpen(false);
      queryClient.setQueryData(["admin-service-request", requestId], data);
      queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
    },
  });

  const costMutation = useMutation({
    mutationFn: (cost: string) => setEstimatedCost(requestId, cost),
    onSuccess: (data) => {
      setCostOpen(false);
      setEstimatedCostInput("");
      queryClient.setQueryData(["admin-service-request", requestId], data);
      queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: () =>
      assignServiceRequest(requestId, {
        provider_id: assignProviderId,
        reason: assignReason,
      }),
    onSuccess: () => {
      setAssignOpen(false);
      setAssignProviderId("");
      setAssignReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-service-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
    },
  });

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: listAllProviders,
  });

  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories,
  });

  const providerNames = useMemo(
    () => new Map((providersQuery.data ?? []).map((p) => [p.id, p.business_name])),
    [providersQuery.data],
  );

  const categoryNames = useMemo(
    () => new Map((categoriesQuery.data?.results ?? []).map((c) => [c.id, c.name])),
    [categoriesQuery.data],
  );

  if (requestQuery.isPending) {
    return (
      <AdminShell title="Request">
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading request...
        </div>
      </AdminShell>
    );
  }

  if (requestQuery.isError) {
    return (
      <AdminShell title="Request">
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {(requestQuery.error as { uiMessage?: string; message?: string }).uiMessage ??
            (requestQuery.error as Error).message ??
            "Failed to load request."}
        </div>
      </AdminShell>
    );
  }

  const request = requestQuery.data;
  const categoryName =
    categoryNames.get(request.service_category) ?? request.service_category;

  return (
    <AdminShell
      title={request.title}
      description={`${request.id.slice(0, 8)}... · submitted ${new Date(request.created_at).toLocaleString()}`}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/administrator/requests">
            <ArrowLeft className="mr-2 h-4 w-4" /> All requests
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="border-border">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={request.status} />
                <StatusBadge value={request.priority} />
                <StatusBadge value={request.payment_status} />
              </div>
              {request.status === "submitted" && (
                <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
                  <AlertDialogTrigger asChild>
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Request
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve this request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will approve the service request "{request.title}" and
                        move it to the assignment stage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {approveMutation.isError && (
                      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {(approveMutation.error as { uiMessage?: string }).uiMessage ??
                          (approveMutation.error as Error).message ??
                          "Failed to approve request."}
                      </div>
                    )}
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={approveMutation.isPending}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={approveMutation.isPending}
                        onClick={(e) => {
                          e.preventDefault();
                          approveMutation.mutate();
                        }}
                      >
                        {approveMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {request.status === "approved" && !request.estimated_cost && (
                <Dialog open={costOpen} onOpenChange={setCostOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Estimated Cost
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Estimated Cost</DialogTitle>
                      <DialogDescription>
                        Set the estimated cost for "{request.title}". A deposit of
                        75% will be calculated automatically.
                      </DialogDescription>
                    </DialogHeader>
                    {costMutation.isError && (
                      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {(costMutation.error as { uiMessage?: string }).uiMessage ??
                          (costMutation.error as Error).message ??
                          "Failed to set estimated cost."}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="estimated-cost">Estimated cost (USh)</Label>
                      <Input
                        id="estimated-cost"
                        type="number"
                        min="0"
                        placeholder="e.g. 150000"
                        value={estimatedCostInput}
                        onChange={(e) => setEstimatedCostInput(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCostOpen(false)}
                        disabled={costMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!estimatedCostInput || costMutation.isPending}
                        onClick={() => costMutation.mutate(estimatedCostInput)}
                      >
                        {costMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {request.status === "awaiting_assignment" && (
                <Dialog
                  open={assignOpen}
                  onOpenChange={(open) => {
                    setAssignOpen(open);
                    if (!open) assignMutation.reset();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Assign to Provider
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign to Provider</DialogTitle>
                      <DialogDescription>
                        Select a provider and optionally add a reason for the
                        assignment.
                      </DialogDescription>
                    </DialogHeader>
                    {assignMutation.isError && (
                      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {(assignMutation.error as { uiMessage?: string }).uiMessage ??
                          (assignMutation.error as Error).message ??
                          "Failed to assign provider."}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="assign-provider">Provider</Label>
                        <Select
                          value={assignProviderId}
                          onValueChange={setAssignProviderId}
                        >
                          <SelectTrigger id="assign-provider">
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {(providersQuery.data ?? []).map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.business_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assign-reason">Reason</Label>
                        <Textarea
                          id="assign-reason"
                          placeholder="e.g. Best rated plumber in area"
                          value={assignReason}
                          onChange={(e) => setAssignReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setAssignOpen(false)}
                        disabled={assignMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!assignProviderId || assignMutation.isPending}
                        onClick={() => assignMutation.mutate()}
                      >
                        {assignMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Assign
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <p className="text-sm leading-6 text-foreground/90">{request.description}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {categoryName}
                {(request.city || request.district) && (
                  <> · {[request.city, request.district].filter(Boolean).join(", ")}</>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 capitalize">
                <Users className="h-4 w-4" />
                {prettify(request.assignment_type)}
              </span>
              {request.assigned_provider && (
                <span className="inline-flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4" />
                  <Link
                    to="/administrator/providers/$providerId"
                    params={{ providerId: request.assigned_provider }}
                    className="font-medium text-primary hover:underline"
                  >
                    {providerNames.get(request.assigned_provider) ?? "Assigned provider"}
                  </Link>
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Estimated cost" value={formatMoney(request.estimated_cost)} />
              <Metric label="Amount paid" value={formatMoney(request.amount_paid)} />
              <Metric
                label="Deposit required"
                value={
                  request.deposit_required != null
                    ? formatMoney(String(request.deposit_required))
                    : "-"
                }
              />
              <Metric label="Cost variance" value={formatMoney(request.cost_variance)} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <AssignmentsTimeline request={request} providerNames={providerNames} />
            <PaymentsSection request={request} />
            {request.images.length > 0 && <ImagesSection request={request} />}
          </div>

          <aside className="space-y-6">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Requester & contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DetailItem
                  icon={User}
                  label="Requester"
                  value={displayName(request.requester_name, "Unknown requester")}
                />
                <DetailItem icon={Mail} label="Email" value={display(request.contact_email)} />
                <DetailItem icon={Phone} label="Phone" value={display(request.contact_phone)} />
                <DetailItem
                  icon={Phone}
                  label="Alternate phone"
                  value={display(request.contact_alternate_phone)}
                />
                <DetailItem
                  icon={User}
                  label="Contact person"
                  value={display(request.contact_person)}
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Preferred date"
                  value={formatDate(request.preferred_date)}
                />
                <DetailItem
                  icon={Clock}
                  label="Preferred time"
                  value={display(request.preferred_time)}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}

function AssignmentsTimeline({
  request,
  providerNames,
}: {
  request: ServiceRequestDetail;
  providerNames: Map<string, string>;
}) {
  const assignments = [...request.assignments].sort(
    (a, b) =>
      new Date(b.assignment_date).getTime() - new Date(a.assignment_date).getTime(),
  );

  if (assignments.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-semibold text-foreground">No assignments yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {request.preferred_provider ? (
            <>
              Customer preferred{" "}
              <Link
                to="/administrator/providers/$providerId"
                params={{ providerId: request.preferred_provider }}
                className="font-medium text-primary hover:underline"
              >
                {providerNames.get(request.preferred_provider) ?? "a provider"}
              </Link>
              . Awaiting assignment.
            </>
          ) : (
            "This request has not been assigned to a provider."
          )}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Assignment history</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          How providers were matched, accepted, or superseded on this request.
        </p>
      </div>

      <ol className="relative space-y-0 border-l border-border pl-6">
        {assignments.map((assignment, index) => {
          const isLatest = index === 0;
          const providerName =
            providerNames.get(assignment.provider) ?? assignment.provider.slice(0, 8);

          return (
            <li key={assignment.id} className="relative pb-6 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[1.625rem] top-1 flex h-3 w-3 rounded-full ring-4 ring-background",
                  isLatest ? "bg-primary" : "bg-muted-foreground/40",
                )}
              />
              <div
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  isLatest
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card/50",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      to="/administrator/providers/$providerId"
                      params={{ providerId: assignment.provider }}
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {providerName}
                    </Link>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {assignment.assignment_type.replace(/_/g, " ")} ·{" "}
                      {new Date(assignment.assignment_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={assignment.acceptance_status} />
                    {assignment.superseded_at && (
                      <StatusBadge value="inactive" className="opacity-80" />
                    )}
                  </div>
                </div>

                {assignment.assignment_reason && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {assignment.assignment_reason}
                  </p>
                )}

                {assignment.response_note && (
                  <p className="mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-foreground">
                    Provider note: {assignment.response_note}
                  </p>
                )}

                {assignment.responded_at && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Responded {new Date(assignment.responded_at).toLocaleString()}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function PaymentsSection({ request }: { request: ServiceRequestDetail }) {
  const columns = useMemo<ColumnDef<RequestPayment>[]>(
    () => [
      {
        accessorKey: "payment_type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-sm capitalize">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="text-sm">{formatMoney(String(getValue()))}</span>
        ),
        meta: { align: "right" },
      },
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ getValue }) => <span className="text-sm">{String(getValue() || "-")}</span>,
      },
      {
        accessorKey: "created_at",
        header: "Paid at",
        cell: ({ getValue }) => (
          <span className="text-sm">{new Date(String(getValue())).toLocaleString()}</span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Payments</h3>
          <p className="text-xs text-muted-foreground">Deposit and final payments recorded.</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={request.payments}
        emptyMessage="No payments recorded."
      />
    </section>
  );
}

function ImagesSection({ request }: { request: ServiceRequestDetail }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">Images</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {request.images.map((image) => (
          <a
            key={image.id}
            href={image.image}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-lg border border-border"
          >
            <img
              src={image.image}
              alt={image.caption ?? "Request image"}
              className="aspect-[4/3] w-full object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatMoney(value: string | null | undefined) {
  if (!value) return "-";
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return value;
  return `USh ${amount.toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function display(value: string | null | undefined) {
  if (!value?.trim()) return "-";
  return value;
}

function displayName(name: string | null | undefined, fallback: string) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}

function prettify(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
