"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  apiClient,
  interpretAddressError,
  resolveAddressSuccess,
  useMutationHelpers,
} from "@/lib";
import type { CustomerAddress } from "@/types";
import { useLanguageStore } from "@/stores";

/* ======================================================
   QUERY KEYS
====================================================== */

const ADDRESS_KEYS = {
  all: ["customer-addresses"] as const,
};

/* ======================================================
   LIST ADDRESSES
====================================================== */

export function useCustomerAddresses() {
  return useQuery({
    queryKey: ADDRESS_KEYS.all,
    queryFn: async () =>
      apiClient.get<CustomerAddress[]>("/customer/addresses"),
    staleTime: 1000 * 60 * 5,
  });
}

/* ======================================================
   CREATE ADDRESS
====================================================== */

export function useCreateCustomerAddress() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state?: string;
      postalCode?: string;
      country: string;
      isDefault?: boolean;
    }) => apiClient.post("/customer/addresses", payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAddressSuccess("create")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAddressError(err)));
    },
  });
}

/* ======================================================
   UPDATE ADDRESS
====================================================== */

export function useUpdateCustomerAddress() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      fullName?: string;
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
    }) => apiClient.patch(`/customer/addresses/${id}`, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAddressSuccess("update")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAddressError(err)));
    },
  });
}

/* ======================================================
   SET DEFAULT ADDRESS
====================================================== */

export function useSetDefaultCustomerAddress() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiClient.patch(`/customer/addresses/${addressId}/default`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAddressSuccess("setDefault")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAddressError(err)));
    },
  });
}

/* ======================================================
   DELETE ADDRESS
====================================================== */

export function useDeleteCustomerAddress() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiClient.delete(`/customer/addresses/${addressId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });

      const { translate } = useLanguageStore.getState();
      success(translate(resolveAddressSuccess("delete")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretAddressError(err)));
    },
  });
}
