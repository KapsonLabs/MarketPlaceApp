// Stubbed signed-in user. Replace with real auth (Supabase) later.
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  audience: "tenant" | "public";
  propertyCode?: string;
  unitNumber?: string;
}

export const currentUser: CurrentUser = {
  id: "user-demo-001",
  name: "Demo Tenant",
  email: "demo.tenant@casmara.test",
  phone: "+254700000000",
  audience: "tenant",
  propertyCode: "PROP-002",
  unitNumber: "B-12",
};

export function useCurrentUser(): CurrentUser {
  return currentUser;
}