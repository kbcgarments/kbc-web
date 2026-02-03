"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  apiClient,
  interpretProfileError,
  resolveProfileSuccess,
  useMutationHelpers,
} from "@/lib";
import { useAuthStore, useLanguageStore } from "@/stores";

/* ======================================================
   TYPES
====================================================== */

export interface CustomerProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  createdAt: string;
}

export interface UpdateCustomerProfilePayload {
  name?: string;
  phone?: string;
}

/* ======================================================
   UPDATE CUSTOMER PROFILE (OPTIMISTIC)
====================================================== */

export function useUpdateCustomerProfile() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: UpdateCustomerProfilePayload) =>
      apiClient.patch("/customer/profile", payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["customer", "profile"] });

      const previous = queryClient.getQueryData<CustomerProfile>([
        "customer",
        "profile",
      ]);

      queryClient.setQueryData<CustomerProfile>(
        ["customer", "profile"],
        (old) => ({
          ...old!,
          ...payload,
        }),
      );

      return { previous };
    },

    onError: (err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["customer", "profile"], context.previous);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretProfileError(err)));
    },

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveProfileSuccess("update")));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer", "profile"],
      });
    },
  });
}

/* ======================================================
   DEACTIVATE OWN ACCOUNT (OPTIMISTIC → LOGOUT)
====================================================== */

export function useDeactivateCustomerAccount() {
  const router = useRouter();
  const { logout, setUser } = useAuthStore();
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: () => apiClient.patch("/customer/profile/deactivate"),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customer", "profile"] });

      const previous = queryClient.getQueryData<CustomerProfile>([
        "customer",
        "profile",
      ]);

      // Optimistically remove customer from cache
      queryClient.removeQueries({ queryKey: ["customer", "profile"] });

      // Optimistically log out
      setUser(null);
      logout();

      return { previous };
    },

    onError: (err, _vars, context) => {
      // Rollback if server fails
      if (context?.previous) {
        queryClient.setQueryData(["customer", "profile"], context.previous);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretProfileError(err)));
    },

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveProfileSuccess("deactivate")));
      router.push("/account/login");
    },
  });
}
