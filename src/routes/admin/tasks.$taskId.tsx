import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/lib/admin/store";
import { moveTask, updateTask } from "@/lib/admin/store";
import {
  getProvider,
  getRequest,
  canTransitionTask,
  TASK_STATUS_LABEL,
  type TaskStatus,
} from "@/lib/admin/mock-data";

export const Route = createFileRoute("/admin/tasks/$taskId")({
  head: () => ({ meta: [{ title: "Task detail — Casmara Systems Admin" }] }),
  component: TaskDetailPage,
  notFoundComponent: () => (
    <AdminShell title="Task not found">
      <p className="text-sm text-muted-foreground">
        This task does not exist.{" "}
        <Link to="/admin/tasks" className="text-primary hover:underline">
          Back to tasks
        </Link>
      </p>
    </AdminShell>
  ),
});

const COLUMNS: TaskStatus[] = ["Todo", "InProgress", "Blocked", "Done"];

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const { tasks } = useAppState();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) throw notFound();

  const provider = getProvider(task.providerId);
  const request = getRequest(task.requestId);

  const [notes, setNotes] = useState(task.notes ?? "");
  const [dueDate, setDueDate] = useState(task.dueDate);

  return (
    <AdminShell
      title={task.title}
      description={`${task.id} • ${request?.title ?? task.requestId}`}
      actions={
        <Button asChild variant="outline">
          <Link to="/admin/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" /> All tasks
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge kind="task" value={task.status} />
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Add coordination notes…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                onClick={() => updateTask(task.id, { notes, dueDate })}
              >
                Save changes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select
                value={task.status}
                onValueChange={(v) => moveTask(task.id, v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map((s) => {
                    const allowed = canTransitionTask(task.status, s);
                    return (
                      <SelectItem key={s} value={s} disabled={!allowed}>
                        {TASK_STATUS_LABEL[s]}
                        {!allowed && s !== task.status ? " — not allowed" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {task.status === "Done"
                  ? "Completed tasks are locked and cannot be reopened."
                  : `Allowed next: ${
                      COLUMNS.filter(
                        (s) => s !== task.status && canTransitionTask(task.status, s)
                      )
                        .map((s) => TASK_STATUS_LABEL[s])
                        .join(", ") || "none"
                    }.`}
              </p>
            </CardContent>
          </Card>


          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Linked records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {request && (
                <Link
                  to="/admin/requests/$requestId"
                  params={{ requestId: request.id }}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Request
                  </p>
                  <p className="text-sm font-medium">{request.title}</p>
                </Link>
              )}
              {provider && (
                <Link
                  to="/admin/providers/$providerId"
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
      </div>
    </AdminShell>
  );
}
