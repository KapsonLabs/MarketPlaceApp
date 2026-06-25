export type RequestStatus =
  | "Open"
  | "Triaged"
  | "Assessing"
  | "Assigned"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export const REQUEST_STATUSES: RequestStatus[] = [
  "Open",
  "Triaged",
  "Assessing",
  "Assigned",
  "InProgress",
  "Completed",
  "Cancelled",
];

export type AssessmentStatus = "NotStarted" | "Scheduled" | "Completed";

export const ASSESSMENT_STATUSES: AssessmentStatus[] = [
  "NotStarted",
  "Scheduled",
  "Completed",
];

export interface Assessment {
  status: AssessmentStatus;
  assessorId?: string;
  scheduledFor?: string;
  findings?: string;
  estimatedHours?: number;
  estimatedCost?: number;
  recommendation?: string;
  completedAt?: string;
}

export type Priority = "Low" | "Normal" | "High" | "Emergency";
export type Specialty =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Appliance"
  | "Structural"
  | "Cleaning"
  | "Painting"
  | "Landscaping";

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: Specialty;
  priority: Priority;
  status: RequestStatus;
  requester: string;
  requesterEmail: string;
  property: string;
  unit: string;
  city: string;
  assignedProviderId?: string;
  createdAt: string;
  updatedAt: string;
  quotedAmount?: number;
  assessment: Assessment;
}

export type ProviderStatus = "Pending" | "Active" | "Suspended";
export interface Provider {
  id: string;
  name: string;
  company: string;
  specialty: Specialty;
  city: string;
  email: string;
  phone: string;
  rating: number;
  jobsCompleted: number;
  hourlyRate: number;
  verified: boolean;
  status: ProviderStatus;
  joinedAt: string;
  documents: { name: string; verified: boolean }[];
}

export type TaskStatus = "Todo" | "InProgress" | "Blocked" | "Done";
export interface Task {
  id: string;
  requestId: string;
  providerId: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  notes?: string;
}

export type PaymentStatus = "Pending" | "Approved" | "Paid" | "Disputed";
export interface Payment {
  id: string;
  requestId: string;
  providerId: string;
  amount: number;
  platformFee: number;
  net: number;
  status: PaymentStatus;
  method: "M-Pesa" | "Bank Transfer" | "Card";
  invoicedAt: string;
  paidAt?: string;
}

export const providers: Provider[] = [
  { id: "sp-001", name: "James Otieno", company: "Otieno Plumbing Works", specialty: "Plumbing", city: "Kampala", email: "james@otieno.co", phone: "+256700111222", rating: 4.9, jobsCompleted: 410, hourlyRate: 1500, verified: true, status: "Active", joinedAt: "2024-03-12", documents: [{ name: "Trade License", verified: true }, { name: "ID", verified: true }] },
  { id: "sp-002", name: "Aisha Mwangi", company: "BrightSpark Electrical", specialty: "Electrical", city: "Mbarara", email: "aisha@brightspark.co", phone: "+256700222333", rating: 4.8, jobsCompleted: 287, hourlyRate: 1800, verified: true, status: "Active", joinedAt: "2024-06-02", documents: [{ name: "Electrical Cert", verified: true }] },
  { id: "sp-003", name: "Daniel Kiprono", company: "CoolAir HVAC", specialty: "HVAC", city: "Entebbe", email: "dan@coolair.co", phone: "+256700333444", rating: 4.7, jobsCompleted: 168, hourlyRate: 2200, verified: true, status: "Active", joinedAt: "2024-09-15", documents: [{ name: "HVAC License", verified: true }] },
  { id: "sp-004", name: "Grace Wambui", company: "Wambui Appliance Repair", specialty: "Appliance", city: "Wakiso", email: "grace@wambui.co", phone: "+256700444555", rating: 4.9, jobsCompleted: 502, hourlyRate: 1200, verified: true, status: "Active", joinedAt: "2023-11-20", documents: [{ name: "Trade License", verified: true }] },
  { id: "sp-005", name: "Peter Kamau", company: "Solid Build Co.", specialty: "Structural", city: "Kiambu", email: "peter@solidbuild.co", phone: "+256700555666", rating: 4.6, jobsCompleted: 134, hourlyRate: 2500, verified: true, status: "Active", joinedAt: "2024-01-08", documents: [{ name: "NCA Registration", verified: true }] },
  { id: "sp-006", name: "Mary Achieng", company: "SparkleHome Cleaning", specialty: "Cleaning", city: "Kampala", email: "mary@sparkle.co", phone: "+256700666777", rating: 4.8, jobsCompleted: 870, hourlyRate: 800, verified: true, status: "Active", joinedAt: "2023-08-19", documents: [{ name: "ID", verified: true }] },
  { id: "sp-007", name: "Brian Ndegwa", company: "FreshCoat Painters", specialty: "Painting", city: "Nakuru", email: "brian@freshcoat.co", phone: "+256700777888", rating: 4.4, jobsCompleted: 92, hourlyRate: 1000, verified: false, status: "Pending", joinedAt: "2026-05-04", documents: [{ name: "ID", verified: true }, { name: "Trade License", verified: false }] },
  { id: "sp-008", name: "Lucy Njeri", company: "GreenScape Gardens", specialty: "Landscaping", city: "Kampala", email: "lucy@greenscape.co", phone: "+256700888999", rating: 4.9, jobsCompleted: 145, hourlyRate: 1100, verified: true, status: "Active", joinedAt: "2024-04-22", documents: [{ name: "Trade License", verified: true }] },
  { id: "sp-009", name: "Samuel Otim", company: "Otim Electricals", specialty: "Electrical", city: "Gulu", email: "samuel@otim.co", phone: "+256700999000", rating: 0, jobsCompleted: 0, hourlyRate: 1600, verified: false, status: "Pending", joinedAt: "2026-05-15", documents: [{ name: "ID", verified: false }] },
];

export const requests: ServiceRequest[] = [
  { id: "req-1001", title: "Kitchen sink leak", description: "Water pooling under the sink, suspect U-bend joint failure.", category: "Plumbing", priority: "High", status: "Assigned", requester: "Sarah Nakato", requesterEmail: "sarah@example.com", property: "Kololo Heights", unit: "Apt 4B", city: "Kampala", assignedProviderId: "sp-001", createdAt: "2026-05-18T08:21:00Z", updatedAt: "2026-05-18T10:00:00Z", quotedAmount: 45000, assessment: { status: "Completed", assessorId: "sp-001", scheduledFor: "2026-05-18T13:00:00Z", findings: "U-bend cracked, washer perished. No cabinet damage.", estimatedHours: 2, estimatedCost: 45000, recommendation: "Replace U-bend joint and seal.", completedAt: "2026-05-18T14:00:00Z" } },
  { id: "req-1002", title: "Bedroom AC not cooling", description: "Unit blows warm air, filter recently cleaned.", category: "HVAC", priority: "Normal", status: "InProgress", requester: "Linda Mukasa", requesterEmail: "linda@example.com", property: "Lakeview Apartments", unit: "Apt 12", city: "Entebbe", assignedProviderId: "sp-003", createdAt: "2026-05-17T14:02:00Z", updatedAt: "2026-05-19T09:00:00Z", quotedAmount: 78000, assessment: { status: "Completed", assessorId: "sp-003", scheduledFor: "2026-05-18T10:00:00Z", findings: "Low refrigerant, suspected slow leak at coil joint.", estimatedHours: 3, estimatedCost: 78000, recommendation: "Pressure test, repair leak, recharge gas.", completedAt: "2026-05-18T12:30:00Z" } },
  { id: "req-1003", title: "Distribution board trip", description: "Power keeps tripping when geyser switches on.", category: "Electrical", priority: "Emergency", status: "Open", requester: "Moses Akena", requesterEmail: "moses@example.com", property: "Ntinda Greens", unit: "House 3", city: "Kampala", createdAt: "2026-05-20T05:42:00Z", updatedAt: "2026-05-20T05:42:00Z", assessment: { status: "NotStarted" } },
  { id: "req-1004", title: "Fridge not cooling", description: "Refrigerator compartment warm, freezer still works.", category: "Appliance", priority: "Normal", status: "Completed", requester: "Janet Owino", requesterEmail: "janet@example.com", property: "Wakiso Villas", unit: "Unit 7", city: "Wakiso", assignedProviderId: "sp-004", createdAt: "2026-05-10T12:00:00Z", updatedAt: "2026-05-12T15:00:00Z", quotedAmount: 32000, assessment: { status: "Completed", assessorId: "sp-004", scheduledFor: "2026-05-11T09:00:00Z", findings: "Faulty thermostat, compressor healthy.", estimatedHours: 1, estimatedCost: 32000, recommendation: "Replace thermostat.", completedAt: "2026-05-11T10:00:00Z" } },
  { id: "req-1005", title: "End-of-tenancy deep clean", description: "Three-bedroom apartment, includes carpet shampoo.", category: "Cleaning", priority: "Low", status: "Assessing", requester: "Kampala Lettings", requesterEmail: "ops@kampala-lets.com", property: "Bugolobi Towers", unit: "Apt 9C", city: "Kampala", createdAt: "2026-05-19T16:10:00Z", updatedAt: "2026-05-19T17:00:00Z", assessment: { status: "Scheduled", assessorId: "sp-006", scheduledFor: "2026-05-22T09:00:00Z" } },
  { id: "req-1006", title: "Roof leak above bathroom", description: "Water staining ceiling after recent rains.", category: "Structural", priority: "High", status: "Assigned", requester: "Peter Wanjiku", requesterEmail: "peter.w@example.com", property: "Kiambu Estates", unit: "House 14", city: "Kiambu", assignedProviderId: "sp-005", createdAt: "2026-05-16T09:30:00Z", updatedAt: "2026-05-18T11:00:00Z", quotedAmount: 120000, assessment: { status: "Completed", assessorId: "sp-005", scheduledFor: "2026-05-17T11:00:00Z", findings: "Cracked flashing and two damaged tiles; minor ceiling rot.", estimatedHours: 6, estimatedCost: 120000, recommendation: "Replace flashing, tiles and treat affected ceiling area.", completedAt: "2026-05-17T13:00:00Z" } },
  { id: "req-1007", title: "Living room repaint", description: "Two coats, off-white, includes minor crack filling.", category: "Painting", priority: "Low", status: "Open", requester: "Immaculate R.", requesterEmail: "imma@example.com", property: "Nakuru Heights", unit: "Apt 2", city: "Nakuru", createdAt: "2026-05-20T07:00:00Z", updatedAt: "2026-05-20T07:00:00Z", assessment: { status: "NotStarted" } },
  { id: "req-1008", title: "Garden cleanup and trimming", description: "Hedge trimming and lawn mow for monthly upkeep.", category: "Landscaping", priority: "Normal", status: "Completed", requester: "Daniel K.", requesterEmail: "danielk@example.com", property: "Munyonyo Gardens", unit: "Villa 3", city: "Kampala", assignedProviderId: "sp-008", createdAt: "2026-05-08T08:00:00Z", updatedAt: "2026-05-11T13:00:00Z", quotedAmount: 28000, assessment: { status: "Completed", assessorId: "sp-008", scheduledFor: "2026-05-09T08:00:00Z", findings: "Overgrown hedges and lawn; no irrigation issues.", estimatedHours: 4, estimatedCost: 28000, recommendation: "Standard monthly upkeep package.", completedAt: "2026-05-09T09:00:00Z" } },
  { id: "req-1009", title: "Washing machine repair", description: "Drum not spinning, error code E-04.", category: "Appliance", priority: "Normal", status: "Cancelled", requester: "Samuel T.", requesterEmail: "samuel@example.com", property: "Najjera Apartments", unit: "Apt 6", city: "Wakiso", createdAt: "2026-05-14T11:00:00Z", updatedAt: "2026-05-15T09:00:00Z", assessment: { status: "NotStarted" } },
];

export const tasks: Task[] = [
  { id: "tsk-01", requestId: "req-1001", providerId: "sp-001", title: "Replace U-bend joint", status: "InProgress", dueDate: "2026-05-21", notes: "Tenant available after 4pm." },
  { id: "tsk-02", requestId: "req-1002", providerId: "sp-003", title: "Diagnose refrigerant leak", status: "InProgress", dueDate: "2026-05-21" },
  { id: "tsk-03", requestId: "req-1006", providerId: "sp-005", title: "Roof patch + waterproofing", status: "Todo", dueDate: "2026-05-23" },
  { id: "tsk-04", requestId: "req-1004", providerId: "sp-004", title: "Replace thermostat", status: "Done", dueDate: "2026-05-12" },
  { id: "tsk-05", requestId: "req-1008", providerId: "sp-008", title: "Monthly garden upkeep", status: "Done", dueDate: "2026-05-11" },
  { id: "tsk-06", requestId: "req-1005", providerId: "sp-006", title: "Site visit + quote", status: "Todo", dueDate: "2026-05-22" },
];

export const payments: Payment[] = [
  { id: "pay-9001", requestId: "req-1004", providerId: "sp-004", amount: 32000, platformFee: 3200, net: 28800, status: "Paid", method: "M-Pesa", invoicedAt: "2026-05-12T15:30:00Z", paidAt: "2026-05-13T10:00:00Z" },
  { id: "pay-9002", requestId: "req-1008", providerId: "sp-008", amount: 28000, platformFee: 2800, net: 25200, status: "Approved", method: "M-Pesa", invoicedAt: "2026-05-11T13:30:00Z" },
  { id: "pay-9003", requestId: "req-1001", providerId: "sp-001", amount: 45000, platformFee: 4500, net: 40500, status: "Pending", method: "Bank Transfer", invoicedAt: "2026-05-19T09:00:00Z" },
  { id: "pay-9004", requestId: "req-1002", providerId: "sp-003", amount: 78000, platformFee: 7800, net: 70200, status: "Pending", method: "Card", invoicedAt: "2026-05-19T12:00:00Z" },
  { id: "pay-9005", requestId: "req-1006", providerId: "sp-005", amount: 120000, platformFee: 12000, net: 108000, status: "Disputed", method: "Bank Transfer", invoicedAt: "2026-05-18T14:00:00Z" },
];

export type NotificationType =
  | "request"
  | "provider"
  | "task"
  | "payment"
  | "assessment";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId?: string;
  read: boolean;
  createdAt: string;
}

export const notifications: AppNotification[] = [
  { id: "ntf-01", type: "request", title: "New emergency request", message: "Distribution board trip reported at Ntinda Greens.", entityId: "req-1003", read: false, createdAt: "2026-05-20T05:42:00Z" },
  { id: "ntf-02", type: "assessment", title: "Assessment scheduled", message: "Site visit booked for End-of-tenancy deep clean.", entityId: "req-1005", read: false, createdAt: "2026-05-19T17:05:00Z" },
  { id: "ntf-03", type: "provider", title: "Provider awaiting review", message: "Brian Ndegwa (FreshCoat Painters) submitted documents.", entityId: "sp-007", read: false, createdAt: "2026-05-19T12:00:00Z" },
  { id: "ntf-04", type: "payment", title: "Payment disputed", message: "Roof leak payout flagged for review.", entityId: "pay-9005", read: true, createdAt: "2026-05-18T14:10:00Z" },
  { id: "ntf-05", type: "task", title: "Task due soon", message: "Roof patch + waterproofing due 23 May.", entityId: "tsk-03", read: true, createdAt: "2026-05-18T11:05:00Z" },
];

export function getProvider(id?: string) {
  return providers.find((p) => p.id === id);
}
export function getRequest(id?: string) {
  return requests.find((r) => r.id === id);
}
export function getTask(id?: string) {
  return tasks.find((t) => t.id === id);
}
export function getPayment(id?: string) {
  return payments.find((p) => p.id === id);
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(n);
}

// ---------- Status transition rules ----------

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  Todo: "To do",
  InProgress: "In progress",
  Blocked: "Blocked",
  Done: "Done",
};

export const ASSESSMENT_STATUS_LABEL: Record<AssessmentStatus, string> = {
  NotStarted: "Not started",
  Scheduled: "Scheduled",
  Completed: "Completed",
};

// Allowed forward/back transitions for tasks.
export const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo: ["InProgress", "Blocked"],
  InProgress: ["Blocked", "Done"],
  Blocked: ["Todo", "InProgress"],
  Done: [],
};

// Allowed transitions for assessments.
export const ASSESSMENT_TRANSITIONS: Record<AssessmentStatus, AssessmentStatus[]> = {
  NotStarted: ["Scheduled"],
  Scheduled: ["NotStarted", "Completed"],
  Completed: [],
};

export function canTransitionTask(from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) return true;
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}

export function taskTransitionError(from: TaskStatus, to: TaskStatus): string | null {
  if (canTransitionTask(from, to)) return null;
  if (from === "Done") {
    return "Completed tasks are locked and cannot be reopened.";
  }
  return `A task cannot move directly from "${TASK_STATUS_LABEL[from]}" to "${TASK_STATUS_LABEL[to]}".`;
}

export function canTransitionAssessment(
  from: AssessmentStatus,
  to: AssessmentStatus
): boolean {
  if (from === to) return true;
  return ASSESSMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assessmentTransitionError(
  from: AssessmentStatus,
  to: AssessmentStatus
): string | null {
  if (canTransitionAssessment(from, to)) return null;
  if (from === "Completed") {
    return "This assessment is already completed and can no longer be changed.";
  }
  if (to === "Completed" && from === "NotStarted") {
    return "Schedule the assessment before recording findings.";
  }
  return `An assessment cannot move from "${ASSESSMENT_STATUS_LABEL[from]}" to "${ASSESSMENT_STATUS_LABEL[to]}".`;
}
