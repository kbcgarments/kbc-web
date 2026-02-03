"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useRouter } from "next/navigation";
import { useMutationHelpers } from "@/lib";
export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}
interface LoginCredentials {
  email: string;
  password: string;
}
export enum AdminRole {
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
}
export function useCreateAdmin() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (payload: CreateAdminPayload) => {
      return apiClient.post<AdminUser>("/admin/create", payload);
    },

    /**
     * Optimistic-friendly (but safe):
     * We don’t inject into cache blindly because
     * admin lists may be paginated / restricted.
     */
    onSuccess: (admin) => {
      // If you later add an admin list query, this is ready
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      success(`Admin ${admin.email} created successfully`);
    },

    onError: (err: unknown) => {
      error(
        err instanceof Error ? err.message : "Failed to create admin account",
      );
    },
  });
}
export function useAdminLogin() {
  const setAdmin = useAdminAuthStore((state) => state.setAdmin);
  const { success, error } = useToastStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<{
        admin: AdminUser;
        accessToken: string;
      }>("/admin/login", credentials);

      return response;
    },

    onSuccess: (data) => {
      // Save admin user
      setAdmin(data.admin);
      localStorage.setItem("kbc_admin_token", data.accessToken);

      success("Login successful!");
      router.push("/admin/dashboard");
    },

    onError: () => {
      error("Invalid email or password");
    },
  });
}

export function useAdminLogout() {
  const logout = useAdminAuthStore((state) => state.logout);
  const router = useRouter();

  return () => {
    logout();
    router.push("/admin/login");
  };
}
