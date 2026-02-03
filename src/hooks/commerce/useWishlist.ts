"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useWishlistStore } from "@/stores/useWishlistStore";
import {
  interpretWishlistError,
  resolveWishlistSuccess,
  useMutationHelpers,
} from "@/lib";
import { Product } from "@/types";
import { useLanguageStore } from "@/stores";

/* -----------------------------------------------------------------------------
   GET WISHLIST (backend uses deviceId cookie automatically)
----------------------------------------------------------------------------- */

export function useGetWishlist() {
  return useQuery<Product[]>({
    queryKey: ["wishlist"],
    queryFn: () => apiClient.get("/wishlist"),
    staleTime: 30_000,
  });
}

/* -----------------------------------------------------------------------------
   TOGGLE WITH OPTIMISTIC UPDATE
----------------------------------------------------------------------------- */
export function useToggleWishlist() {
  const setItems = useWishlistStore((s) => s.setItems);
  const { queryClient, error, success } = useMutationHelpers();

  return useMutation<Product[], Error, Product, { previous: Product[] }>({
    mutationFn: (product) =>
      apiClient.post<Product[]>("/wishlist/toggle", {
        productId: product.id,
      }),

    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previous = queryClient.getQueryData<Product[]>(["wishlist"]) ?? [];

      const exists = previous.some((p) => p.id === product.id);

      const optimistic = exists
        ? previous.filter((p) => p.id !== product.id)
        : [product, ...previous];

      queryClient.setQueryData(["wishlist"], optimistic);
      setItems(optimistic);

      return { previous };
    },

    onError: (err, _product, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["wishlist"], ctx.previous);
        setItems(ctx.previous);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretWishlistError(err)));
    },

    onSuccess: (products) => {
      queryClient.setQueryData(["wishlist"], products);
      setItems(products);

      const { translate } = useLanguageStore.getState();
      success(translate(resolveWishlistSuccess("toggle")));
    },
  });
}

/* -----------------------------------------------------------------------------
   REMOVE ITEM (explicit)
----------------------------------------------------------------------------- */
export function useRemoveWishlistItem() {
  const { items, setItems } = useWishlistStore();
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation<
    { product: Product }[],
    Error,
    string,
    { previous: Product[] }
  >({
    mutationFn: (productId) =>
      apiClient.delete<{ product: Product }[]>(`/wishlist/${productId}`),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previous = queryClient.getQueryData<Product[]>(["wishlist"]) ?? [];

      // Remove immediately
      const optimistic = items.filter((p) => p.id !== productId);

      queryClient.setQueryData(["wishlist"], optimistic);
      setItems(optimistic);

      return { previous };
    },

    onSuccess: (rows) => {
      const products = rows.map((r) => r.product);
      queryClient.setQueryData(["wishlist"], products);
      setItems(products);

      const { translate } = useLanguageStore.getState();
      success(translate(resolveWishlistSuccess("remove")));
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["wishlist"], ctx.previous);
        setItems(ctx.previous);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretWishlistError(err)));
    },
  });
}

/* -----------------------------------------------------------------------------
   CLEAR WISHLIST (ALL ITEMS)
----------------------------------------------------------------------------- */
export function useClearWishlist() {
  const setItems = useWishlistStore((s) => s.setItems);
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation<Product[], Error, void, { previous: Product[] }>({
    mutationFn: () => apiClient.delete<Product[]>("/wishlist"),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previous = queryClient.getQueryData<Product[]>(["wishlist"]) ?? [];

      // Clear immediately
      queryClient.setQueryData(["wishlist"], []);
      setItems([]);

      return { previous };
    },

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveWishlistSuccess("clear")));
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["wishlist"], ctx.previous);
        setItems(ctx.previous);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretWishlistError(err)));
    },
  });
}
