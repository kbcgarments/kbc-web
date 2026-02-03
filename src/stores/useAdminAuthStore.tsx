import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "STAFF" | "ADMIN" | "SUPER_ADMIN";
}

interface AdminAuthStore {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminUser | null) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,

      setAdmin: (admin: AdminUser | null) => {
        set({
          admin,
          isAuthenticated: admin !== null,
        });
      },

      logout: () => {
        set({
          admin: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "kbc-admin-auth",
    },
  ),
);
