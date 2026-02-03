"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient, useMutationHelpers } from "@/lib";
import { Customer } from "@/types";

/* ======================================================
   TYPES
====================================================== */

export interface AdminCustomer {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  createdAt: string;
}
const ADMIN_CUSTOMERS_KEY = ["admin", "customers"];

/* ======================================================
   GET ACTIVE CUSTOMERS
====================================================== */

export function useAdminCustomers() {
  return useQuery({
    queryKey: ["admin", "customers", "active"],
    queryFn: async () => apiClient.get<Customer[]>("/customer/profile/active"),
    staleTime: 1000 * 60 * 5,
  });
}
/* ======================================================
   DEACTIVATE CUSTOMER (OPTIMISTIC, ADMIN)
====================================================== */

export function useAdminDeactivateCustomer() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (customerId: string) =>
      apiClient.patch(`/customer/profile/${customerId}/deactivate`),

    onMutate: async (customerId) => {
      await queryClient.cancelQueries({
        queryKey: [...ADMIN_CUSTOMERS_KEY],
      });

      const previous = queryClient.getQueryData<AdminCustomer[]>([
        "admin",
        "customers",
        "active",
      ]);

      // Optimistically remove customer from list
      queryClient.setQueryData<AdminCustomer[]>(
        ["admin", "customers", "active"],
        (old = []) => old.filter((c) => c.id !== customerId),
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["admin", "customers", "active"],
          context.previous,
        );
      }

      error("Failed to deactivate customer");
    },

    onSuccess: () => {
      success("Customer deactivated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "customers", "active"],
      });
    },
  });
}

/* ======================================================
   REACTIVATE CUSTOMER (ADMIN — OPTIMISTIC)
====================================================== */

export function useAdminReactivateCustomer() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (customerId: string) =>
      apiClient.patch(`/customer/profile/${customerId}/reactivate`),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [...ADMIN_CUSTOMERS_KEY],
      });
    },

    onError: () => {
      error("Failed to reactivate customer");
    },

    onSuccess: () => {
      success("Customer reactivated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_CUSTOMERS_KEY],
      });
    },
  });
}
