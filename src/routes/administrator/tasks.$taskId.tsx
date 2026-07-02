import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarClock, Package, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { CustomDialog } from "@/components/admin/custom-dialog";
import { StatusUpdateForm } from "@/components/admin/status-update-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminSession } from "@/lib/admin-auth";
import {
  getWorkOrder,
  getAdminWorkOrder,
  addWorkOrderUpdate,
  addWorkOrderMaterial,
  deleteWorkOrderMaterial,
  WORK_ORDER_STATUS_LABEL,
  type WorkOrderStatus,
} from "@/lib/api/work-orders.api";

// ─── Constants ───────────────────────────────────────────────────────────────

const UNITS = ["pcs", "kg", "m", "L", "bag", "box", "roll", "set"] as const;

const TERMINAL_STATUSES: WorkOrderStatus[] = ["completed", "cancelled"];

const STATUS_ACTIONS: Record<
  string,
  Array<{
    label: string;
    toStatus: WorkOrderStatus;
    variant: "default" | "outline" | "destructive";
  }>
> = {
  pending: [
    { label: "Start Order", toStatus: "in_progress", variant: "default" },
    { label: "Cancel Order", toStatus: "cancelled", variant: "destructive" },
  ],
  in_progress: [
    { label: "Mark Complete", toStatus: "completed", variant: "default" },
    { label: "Put on Hold", toStatus: "on_hold", variant: "outline" },
    { label: "Cancel Order", toStatus: "cancelled", variant: "destructive" },
  ],
  on_hold: [
    { label: "Resume", toStatus: "in_progress", variant: "default" },
    { label: "Cancel Order", toStatus: "cancelled", variant: "destructive" },
  ],
};

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/administrator/tasks/$taskId")({
  head: () => ({ meta: [{ title: "Work order — Casmara Systems Admin" }] }),
  component: TaskDetailPage,
});

// ─── Page ────────────────────────────────────────────────────────────────────

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const session = useAdminSession();
  const queryClient = useQueryClient();
  const isAdmin = session?.user.role.slug === "admin";

  // ── Work order query ──────────────────────────────────────────────────────
  const { data: workOrder, isLoading, isError } = useQuery({
    queryKey: ["work-order", taskId],
    queryFn: () => (isAdmin ? getAdminWorkOrder(taskId) : getWorkOrder(taskId)),
    enabled: !!session,
  });

  // ── Status update ─────────────────────────────────────────────────────────
  const [modalView, setModalView] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<WorkOrderStatus | null>(null);

  const statusMutation = useMutation({
    mutationFn: (description: string) =>
      addWorkOrderUpdate(taskId, {
        update_type: "status_change",
        message: description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order", taskId] });
      setModalView(null);
      setPendingStatus(null);
    },
  });

  const handleOpenModal = (view: string, status?: WorkOrderStatus) => {
    if (status) setPendingStatus(status);
    setModalView(view);
  };

  const handleCloseModal = () => {
    setModalView(null);
    setPendingStatus(null);
  };

  // ── Materials ─────────────────────────────────────────────────────────────
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("1");
  const [newUnit, setNewUnit] = useState<string>("pcs");
  const [newPrice, setNewPrice] = useState("");

  const addMaterialMutation = useMutation({
    mutationFn: () =>
      addWorkOrderMaterial(
        taskId,
        {
          name: newName.trim(),
          quantity: Number(newQty),
          unit: newUnit,
          unit_cost: newPrice,
        },
        isAdmin,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order", taskId] });
      setNewName("");
      setNewQty("1");
      setNewPrice("");
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (materialId: string) =>
      deleteWorkOrderMaterial(taskId, materialId, isAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order", taskId] });
    },
  });

  function handleAddMaterial() {
    if (!newName.trim() || !Number(newQty) || !Number(newPrice)) return;
    addMaterialMutation.mutate();
  }

  // ── Guards ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AdminShell title="Work order">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AdminShell>
    );
  }

  if (isError || !workOrder) {
    return (
      <AdminShell title="Work order not found">
        <p className="text-sm text-muted-foreground">
          This work order could not be loaded.{" "}
          <Link to="/administrator/tasks" className="text-primary hover:underline">
            Back to work orders
          </Link>
        </p>
      </AdminShell>
    );
  }

  const actions = STATUS_ACTIONS[workOrder.status] ?? [];
  const materials = workOrder.materials ?? [];
  const materialsTotal = materials.reduce((sum, m) => sum + Number(m.total_cost), 0);

  const modalConfig: Record<string, { title: string; description: React.ReactNode }> = {
    statusUpdate: {
      title: "Confirm status change",
      description: pendingStatus ? (
        <StatusUpdateForm
          fromStatus={workOrder.status}
          toStatus={pendingStatus}
          onConfirm={(description) => statusMutation.mutate(description)}
          onCancel={handleCloseModal}
          isPending={statusMutation.isPending}
        />
      ) : null,
    },
  };

  return (
    <AdminShell
      title={workOrder.service_request.title}
      description={workOrder.id}
      actions={
        <Button asChild variant="outline">
          <Link to="/administrator/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" /> All work orders
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Timeline */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Scheduled start", value: workOrder.scheduled_start },
                { label: "Scheduled end", value: workOrder.scheduled_end },
                { label: "Actual start", value: workOrder.actual_start },
                { label: "Actual end", value: workOrder.actual_end },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  {value ? (
                    <p className="mt-0.5 inline-flex items-center gap-1 text-sm">
                      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(value).toLocaleString()}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted-foreground/50">—</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Materials */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Materials</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add material row */}
              <div className="grid grid-cols-[1fr_80px_90px_100px_auto] items-end gap-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Name</p>
                  <Input
                    placeholder="e.g. PVC pipe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMaterial()}
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Qty</p>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Unit</p>
                  <Select value={newUnit} onValueChange={setNewUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Unit price (UGX)</p>
                  <Input
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <Button
                  size="icon"
                  disabled={
                    !newName.trim() ||
                    !Number(newQty) ||
                    !Number(newPrice) ||
                    addMaterialMutation.isPending
                  }
                  onClick={handleAddMaterial}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Materials list */}
              {materials.length > 0 ? (
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                        <th className="px-3 py-2">Material</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit price</th>
                        <th className="px-3 py-2 text-right">Total</th>
                        <th className="px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {materials.map((m) => (
                        <tr key={m.id} className="bg-card">
                          <td className="px-3 py-2 font-medium">{m.name}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            {m.quantity} {m.unit}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            {Number(m.unit_cost).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium">
                            {Number(m.total_cost).toLocaleString()}
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              disabled={deleteMaterialMutation.isPending}
                              onClick={() => deleteMaterialMutation.mutate(m.id)}
                              className="text-muted-foreground/60 hover:text-destructive disabled:opacity-40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border bg-muted/40">
                        <td
                          colSpan={3}
                          className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Total
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-bold tabular-nums">
                          UGX {materialsTotal.toLocaleString()}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border bg-muted/20 py-8 text-center">
                  <Package className="mx-auto h-6 w-6 text-muted-foreground/40" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    No materials added yet. Use the form above to add items.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Updates */}
          {workOrder.updates.length > 0 && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workOrder.updates.map((update) => (
                  <div key={update.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-medium uppercase tracking-wider">
                        {update.update_type.replace(/_/g, " ")}
                      </span>
                      <span>{new Date(update.created_at).toLocaleString()}</span>
                    </div>
                    {update.message && <p className="mt-1">{update.message}</p>}
                    {update.percent_complete != null && update.percent_complete > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {update.percent_complete}% complete
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Status + actions */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge
                kind="work-order"
                value={workOrder.status}
                label={WORK_ORDER_STATUS_LABEL[workOrder.status] ?? workOrder.status}
              />

              {TERMINAL_STATUSES.includes(workOrder.status) ? (
                <p className="text-xs text-muted-foreground">
                  This work order is{" "}
                  {WORK_ORDER_STATUS_LABEL[workOrder.status]?.toLowerCase()} and cannot be
                  updated.
                </p>
              ) : actions.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {actions.map(({ label, toStatus, variant }) => (
                    <Button
                      key={toStatus}
                      variant={variant}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleOpenModal("statusUpdate", toStatus)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              ) : null}

              {workOrder.final_cost && (
                <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Final cost</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    UGX {Number(workOrder.final_cost).toLocaleString()}
                  </p>
                </div>
              )}

              {materials.length > 0 && (
                <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Materials total</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    UGX {materialsTotal.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linked records */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/administrator/requests/$requestId"
                params={{ requestId: workOrder.service_request.id }}
                className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Request
                </p>
                <p className="text-sm font-medium">{workOrder.service_request.title}</p>
              </Link>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Provider
                </p>
                <p className="text-sm font-medium">{workOrder.provider.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {modalView && modalConfig[modalView] && (
        <CustomDialog
          title={modalConfig[modalView].title}
          isOpen={!!modalView}
          handleClose={handleCloseModal}
          description={modalConfig[modalView].description}
        />
      )}
    </AdminShell>
  );
}
