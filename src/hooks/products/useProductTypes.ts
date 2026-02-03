"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useMutationHelpers } from "@/lib";
import type { ProductType } from "@/types";

/* ============================================
   GET PRODUCT TYPES (PUBLIC / STOREFRONT)
   GET /product-types
=============================================== */
export function useGetProductTypes() {
  return useQuery({
    queryKey: ["product-types", "public"],
    queryFn: async (): Promise<ProductType[]> => {
      return apiClient.get<ProductType[]>("/product-types");
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ============================================
   GET PRODUCT TYPES (ADMIN)
   GET /product-types/admin/all
=============================================== */
export function useGetProductTypesAdmin() {
  return useQuery({
    queryKey: ["product-types", "admin"],
    queryFn: async (): Promise<ProductType[]> => {
      return apiClient.get<ProductType[]>("/product-types/admin/all");
    },
    staleTime: 60 * 1000,
  });
}

/* ============================================
   CREATE PRODUCT TYPE
   POST /product-types
=============================================== */
export function useCreateProductType() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (payload: {
      key: string;
      label_en: string;
      isActive?: boolean;
      order?: number;
    }) => {
      return apiClient.post("/product-types", payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
      success("Product type created successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to create product type";
      error(msg);
    },
  });
}

/* ============================================
   UPDATE PRODUCT TYPE
   PATCH /product-types/:id
=============================================== */
export function useUpdateProductType() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<{
        key: string;
        label_en: string;
        isActive: boolean;
        order: number;
      }>;
    }) => {
      return apiClient.patch(`/product-types/${id}`, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
      queryClient.invalidateQueries({
        queryKey: ["product-types", "admin"],
      });
      success("Product type updated successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update product type";
      error(msg);
    },
  });
}

/* ============================================
   DELETE PRODUCT TYPE
   DELETE /product-types/:id
=============================================== */
export function useDeleteProductType() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/product-types/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
      success("Product type deleted successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to delete product type";
      error(msg);
    },
  });
}
