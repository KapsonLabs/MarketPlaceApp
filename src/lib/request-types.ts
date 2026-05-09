export type RequestCategory =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Appliance"
  | "Structural"
  | "Other";

export type RequestStatus =
  | "Open"
  | "Triaged"
  | "Assigned"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export const REQUEST_STATUSES: RequestStatus[] = [
  "Open",
  "Triaged",
  "Assigned",
  "InProgress",
  "Completed",
  "Cancelled",
];

export interface RequestPhoto {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface RequestLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
}

export type RequestWizardStep = "job" | "location" | "review" | "submitted";

export const REQUEST_WIZARD_STEPS: RequestWizardStep[] = [
  "job",
  "location",
  "review",
  "submitted",
];

export interface RequestStepHistoryEntry {
  step: RequestWizardStep;
  at: string;
}

export interface PaymentRecord {
  id: string;
  requestId: string;
  amount: number;
  type: "deposit" | "final";
  paidAt: string;
}

export interface ForwardedMaintenanceRequest {
  id: string;
  propertyId: string | null;
  unitId: string | null;
  tenantId: string | null;
  title: string;
  description: string;
  category: RequestCategory;
  priority: "Low" | "Medium" | "High" | "Emergency";
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  source: "marketplace";
  userId: string;
  location: RequestLocation;
  preferredProviderId?: string;
  audience: "tenant" | "public";
  photos: RequestPhoto[];
  notes?: string;
  wizardStep: RequestWizardStep;
  stepHistory: RequestStepHistoryEntry[];
}
