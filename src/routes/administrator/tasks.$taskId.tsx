import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarClock, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { CustomDialog } from "@/components/admin/custom-dialog";
import { StatusUpdateForm } from "@/components/admin/status-update-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getWorkOrder,
  addWorkOrderUpdate,
  WORK_ORDER_STATUS_LABEL,
  type WorkOrderStatus,
} from "@/lib/api/work-orders.api";

const TERMINAL_STATUSES: WorkOrderStatus[] = ["completed", "cancelled"];

const ALLOWED_TRANSITIONS: Record<string, WorkOrderStatus[]> = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["on_hold", "completed"],
  on_hold: ["in_progress", "cancelled"],
  completed: [],
  cancelled: [],
};

export const Route = createFileRoute("/administrator/tasks/$taskId")({
  head: () => ({ meta: [{ title: "Work order — Casmara Systems Admin" }] }),
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: workOrder, isLoading, isError } = useQuery({
    queryKey: ["work-order", taskId],
    queryFn: () => getWorkOrder(taskId),
  });

  const [modalView, setModalView] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<WorkOrderStatus | null>(null);

  const statusMutation = useMutation({
    mutationFn: (vars: { description: string }) =>
      addWorkOrderUpdate(taskId, {
        update_type: "status_change",
        message: vars.description,
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

  const allowedTransitions = ALLOWED_TRANSITIONS[workOrder.status] ?? [];

  const modalConfig: Record<string, { title: string; description: React.ReactNode }> = {
    statusUpdate: {
      title: "Update work order status",
      description: pendingStatus ? (
        <StatusUpdateForm
          fromStatus={workOrder.status}
          toStatus={pendingStatus}
          onConfirm={(description) => statusMutation.mutate({ description })}
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
        <div className="space-y-6 lg:col-span-2">
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

          {workOrder.final_cost && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Final cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="inline-flex items-center gap-1 text-lg font-semibold">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {Number(workOrder.final_cost).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}

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

        <div className="space-y-6">
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
                  This work order is {WORK_ORDER_STATUS_LABEL[workOrder.status]?.toLowerCase()} and
                  cannot be updated.
                </p>
              ) : allowedTransitions.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <p className="text-xs text-muted-foreground">Move to:</p>
                  {allowedTransitions.map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleOpenModal("statusUpdate", s)}
                    >
                      {WORK_ORDER_STATUS_LABEL[s] ?? s}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No transitions available.</p>
              )}
            </CardContent>
          </Card>

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
