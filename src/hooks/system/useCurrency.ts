"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { CurrencyRate } from "@/types";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useMutationHelpers } from "@/lib";

/* ============================================
   GET ALL CURRENCY RATES
=============================================== */
export function useGetCurrencyRates() {
  const setRates = useCurrencyStore((state) => state.setRates);

  return useQuery({
    queryKey: ["currency-rates"],
    queryFn: async () => {
      const rates = await apiClient.get<CurrencyRate[]>("/currency-rates");

      // Update Zustand store with fetched rates
      setRates(rates);

      return rates;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/* ============================================
   UPDATE CURRENCY RATE
=============================================== */
export function useUpdateCurrencyRate() {
  const { queryClient, success, error } = useMutationHelpers();
  const setRates = useCurrencyStore((state) => state.setRates);

  return useMutation({
    mutationFn: async ({
      currency,
      rate,
    }: {
      currency: string;
      rate: number;
    }) => {
      return apiClient.patch<CurrencyRate>("/currency-rates", {
        currency,
        rate,
      });
    },

    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["currency-rates"] });

      // Manually fetch and update Zustand store immediately
      const updatedRates =
        await apiClient.get<CurrencyRate[]>("/currency-rates");
      setRates(updatedRates);

      success("Currency rate updated successfully!");
    },

    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update currency rate";
      error(errorMessage);
    },
  });
}

/* ============================================
   CREATE CURRENCY RATES (for seeding)
=============================================== */
export function useCreateCurrencyRates() {
  const { queryClient, success, error } = useMutationHelpers();
  const setRates = useCurrencyStore((state) => state.setRates);

  return useMutation({
    mutationFn: async (
      data:
        | { currency: string; rate: number }
        | { currency: string; rate: number }[],
    ) => {
      return apiClient.post("/currency-rates", data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currency-rates"] });

      // Update Zustand store
      const updatedRates =
        await apiClient.get<CurrencyRate[]>("/currency-rates");
      setRates(updatedRates);

      success("Currency rates created successfully!");
    },

    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create currency rates";
      error(errorMessage);
    },
  });
}
