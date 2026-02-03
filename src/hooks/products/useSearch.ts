"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiClient } from "@/lib";
import { Product } from "@/types";

/* --------------------------------------------------------------------------
   SEARCH PRODUCTS
--------------------------------------------------------------------------- */
export function useSearchProducts(query: string, nonce: number) {
  const trimmed = query.trim();

  return useQuery<Product[]>({
    queryKey: ["search", trimmed, nonce],
    enabled: trimmed.length >= 2,
    queryFn: async () => {
      const searchQuery = encodeURIComponent(trimmed);
      const res = await apiClient.get<Product[]>(`/search?q=${searchQuery}`);
      return res;
    },
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });
}

/* --------------------------------------------------------------------------
   SEARCH HISTORY
--------------------------------------------------------------------------- */
export function useSearchHistory() {
  return useQuery<{ id: string; query: string }[]>({
    queryKey: ["search-history"],
    queryFn: () => apiClient.get("/search/history"),
    staleTime: Infinity,
  });
}

/* --------------------------------------------------------------------------
   DELETE SEARCH HISTORY ITEM (Optimistic Update)
--------------------------------------------------------------------------- */
export function useDeleteSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/search/history/${id}`),

    // Optimistic update - remove from UI immediately
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["search-history"] });

      // Snapshot the previous value
      const previousHistory = queryClient.getQueryData<
        { id: string; query: string }[]
      >(["search-history"]);

      // Optimistically update to the new value
      queryClient.setQueryData<{ id: string; query: string }[]>(
        ["search-history"],
        (old) => old?.filter((item) => item.id !== deletedId) ?? [],
      );

      // Return context with snapshot
      return { previousHistory };
    },

    // If mutation fails, rollback to previous state
    onError: (err, deletedId, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(["search-history"], context.previousHistory);
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}
