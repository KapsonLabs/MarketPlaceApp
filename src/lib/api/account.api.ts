import { api } from "@/lib/api";

export interface UpdatePasswordInput {
  current_password: string;
  new_password: string;
}

export async function updatePassword(payload: UpdatePasswordInput): Promise<void> {
  await api.post("/auth/me/change-password/", payload);
}
