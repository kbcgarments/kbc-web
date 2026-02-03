export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "STAFF" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}
