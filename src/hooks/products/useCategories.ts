"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Category } from "@/types";
import { useMutationHelpers } from "@/lib";

/* ============================================
   GET ALL CATEGORIES
=============================================== */
export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      return apiClient.get<Category[]>("/categories");
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ============================================
   GET CATEGORY BY SLUG
=============================================== */
export function useGetCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async (): Promise<Category> => {
      return apiClient.get<Category>(`/categories/slug/${slug}`);
    },
    enabled: !!slug,
  });
}

/* ============================================
   CREATE CATEGORY  (multipart/form-data)
=============================================== */
export function useCreateCategory() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return apiClient.postForm("/categories", formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      success("Categories created successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to create categories";
      error(msg);
    },
  });
}

/* ============================================
   UPDATE CATEGORY  (multipart/form-data)
=============================================== */
export function useUpdateCategory() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData; // IMPORTANT — this now expects FormData
    }) => {
      return apiClient.patchForm(`/categories/${id}`, formData);
    },

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["category", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      success("Category updated successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update category";
      error(msg);
    },
  });
}

/* ============================================
   DELETE CATEGORY
=============================================== */
export function useDeleteCategory() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/categories/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      success("Category deleted successfully!");
    },

    onError: () => {
      error("Failed to delete category");
    },
  });
}
