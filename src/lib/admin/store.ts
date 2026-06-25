import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  requests as seedRequests,
  providers as seedProviders,
  tasks as seedTasks,
  payments as seedPayments,
  notifications as seedNotifications,
  getProvider,
  type ServiceRequest,
  type Provider,
  type Task,
  type Payment,
  type AppNotification,
  type RequestStatus,
  type ProviderStatus,
  type TaskStatus,
  type PaymentStatus,
  type NotificationType,
  taskTransitionError,
  assessmentTransitionError,
} from "@/lib/admin/mock-data";

interface AppState {
  requests: ServiceRequest[];
  providers: Provider[];
  tasks: Task[];
  payments: Payment[];
  notifications: AppNotification[];
}

const clone = <T,>(v: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));

let state: AppState = {
  requests: clone(seedRequests),
  providers: clone(seedProviders),
  tasks: clone(seedTasks),
  payments: clone(seedPayments),
  notifications: clone(seedNotifications),
};

const listeners = new Set<() => void>();

function setState(next: Partial<AppState>) {
  state = { ...state, ...next };
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

let notifCounter = 100;
function pushNotification(
  type: NotificationType,
  title: string,
  message: string,
  entityId?: string,
) {
  const n: AppNotification = {
    id: `ntf-${notifCounter++}`,
    type,
    title,
    message,
    entityId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  state = { ...state, notifications: [n, ...state.notifications] };
}

const now = () => new Date().toISOString();

// ---------- Request actions ----------
export function updateRequestStatus(id: string, status: RequestStatus) {
  const req = state.requests.find((r) => r.id === id);
  setState({
    requests: state.requests.map((r) =>
      r.id === id ? { ...r, status, updatedAt: now() } : r,
    ),
  });
  pushNotification(
    "request",
    "Request status updated",
    `${req?.title ?? id} is now ${status}.`,
    id,
  );
  toast.success(`Request marked ${status}`);
}

export function assignProvider(requestId: string, providerId: string) {
  const provider = getProvider(providerId);
  setState({
    requests: state.requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            assignedProviderId: providerId,
            status:
              r.status === "Open" || r.status === "Triaged" || r.status === "Assessing"
                ? "Assigned"
                : r.status,
            updatedAt: now(),
          }
        : r,
    ),
  });
  pushNotification(
    "request",
    "Provider assigned",
    `${provider?.company ?? providerId} assigned to request.`,
    requestId,
  );
  toast.success(`Assigned to ${provider?.company ?? "provider"}`);
}

export function setRequestQuote(requestId: string, amount: number) {
  setState({
    requests: state.requests.map((r) =>
      r.id === requestId ? { ...r, quotedAmount: amount, updatedAt: now() } : r,
    ),
  });
  toast.success("Quote updated");
}

// ---------- Assessment actions ----------
export function scheduleAssessment(
  requestId: string,
  data: { assessorId: string; scheduledFor: string },
): boolean {
  const req = state.requests.find((r) => r.id === requestId);
  if (!req) {
    toast.error("Request not found.");
    return false;
  }
  const error = assessmentTransitionError(req.assessment.status, "Scheduled");
  if (error) {
    toast.error(error);
    return false;
  }
  if (!data.assessorId) {
    toast.error("Choose an assessor before scheduling.");
    return false;
  }
  if (!data.scheduledFor || Number.isNaN(new Date(data.scheduledFor).getTime())) {
    toast.error("Pick a valid date and time for the assessment.");
    return false;
  }
  setState({
    requests: state.requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: r.status === "Open" || r.status === "Triaged" ? "Assessing" : r.status,
            updatedAt: now(),
            assessment: {
              ...r.assessment,
              status: "Scheduled",
              assessorId: data.assessorId,
              scheduledFor: data.scheduledFor,
            },
          }
        : r,
    ),
  });
  pushNotification(
    "assessment",
    "Assessment scheduled",
    `${req.title} assessment booked for ${new Date(data.scheduledFor).toLocaleString()}.`,
    requestId,
  );
  toast.success("Assessment scheduled");
  return true;
}

export function recordAssessment(
  requestId: string,
  data: {
    findings: string;
    estimatedHours?: number;
    estimatedCost?: number;
    recommendation: string;
  },
): boolean {
  const req = state.requests.find((r) => r.id === requestId);
  if (!req) {
    toast.error("Request not found.");
    return false;
  }
  const error = assessmentTransitionError(req.assessment.status, "Completed");
  if (error) {
    toast.error(error);
    return false;
  }
  if (!data.findings.trim() || !data.recommendation.trim()) {
    toast.error("Findings and a recommendation are required to record an assessment.");
    return false;
  }
  if (data.estimatedHours !== undefined && data.estimatedHours < 0) {
    toast.error("Estimated hours cannot be negative.");
    return false;
  }
  if (data.estimatedCost !== undefined && data.estimatedCost < 0) {
    toast.error("Estimated cost cannot be negative.");
    return false;
  }
  setState({
    requests: state.requests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            updatedAt: now(),
            quotedAmount: data.estimatedCost ?? r.quotedAmount,
            assessment: {
              ...r.assessment,
              status: "Completed",
              findings: data.findings,
              estimatedHours: data.estimatedHours,
              estimatedCost: data.estimatedCost,
              recommendation: data.recommendation,
              completedAt: now(),
            },
          }
        : r,
    ),
  });
  pushNotification(
    "assessment",
    "Assessment completed",
    `${req.title} assessment recorded${data.estimatedCost ? ` — estimate ${data.estimatedCost.toLocaleString()} UGX.` : "."}`,
    requestId,
  );
  toast.success("Assessment recorded");
  return true;
}

// ---------- Provider actions ----------
export function setProviderStatus(id: string, status: ProviderStatus) {
  const provider = state.providers.find((p) => p.id === id);
  setState({
    providers: state.providers.map((p) =>
      p.id === id
        ? { ...p, status, verified: status === "Active" ? true : p.verified }
        : p,
    ),
  });
  pushNotification(
    "provider",
    "Provider updated",
    `${provider?.company ?? id} is now ${status}.`,
    id,
  );
  toast.success(`Provider ${status}`);
}

export function verifyProviderDoc(providerId: string, docName: string) {
  setState({
    providers: state.providers.map((p) =>
      p.id === providerId
        ? {
            ...p,
            documents: p.documents.map((d) =>
              d.name === docName ? { ...d, verified: true } : d,
            ),
          }
        : p,
    ),
  });
  toast.success(`${docName} verified`);
}

// ---------- Task actions ----------
export function moveTask(id: string, status: TaskStatus): boolean {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    toast.error("Task not found.");
    return false;
  }
  if (task.status === status) return false;
  const error = taskTransitionError(task.status, status);
  if (error) {
    toast.error(error);
    return false;
  }
  setState({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
  });
  pushNotification("task", "Task updated", `${task.title} moved to ${status}.`, id);
  toast.success(`Task moved to ${status}`);
  return true;
}

export function updateTask(id: string, patch: Partial<Task>) {
  setState({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  });
  toast.success("Task updated");
}

// ---------- Payment actions ----------
export function setPaymentStatus(id: string, status: PaymentStatus) {
  const pay = state.payments.find((p) => p.id === id);
  setState({
    payments: state.payments.map((p) =>
      p.id === id
        ? { ...p, status, paidAt: status === "Paid" ? now() : p.paidAt }
        : p,
    ),
  });
  pushNotification("payment", "Payment updated", `${pay?.id ?? id} is now ${status}.`, id);
  toast.success(`Payment ${status}`);
}

export function releasePayout(paymentId: string) {
  setPaymentStatus(paymentId, "Paid");
}

// ---------- Notification actions ----------
export function markNotificationRead(id: string) {
  setState({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  });
}

export function markAllNotificationsRead() {
  setState({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  });
}
