export type UserRole = "admin" | "buyer";

export type UserProfile = {
  id: string;
  role: UserRole;
  created_at?: string;
};
