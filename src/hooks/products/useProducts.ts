"use client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, useMutationHelpers } from "@/lib";
import { Product, ProductColor, ProductSize, PRODUCT_STATUS } from "@/types";

export interface ProductFilterParams {
  category?: string;
  sizes?: string[];
  colorIds?: string[];
  types?: string[];
  stock?: "in" | "out";
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export interface FilterResponse {
  items: Product[];
  nextCursor: string | null;
}
/* ============================================
   GET ALL PRODUCTS
=============================================== */
export function useGetProducts(filters?: {
  admin?: "true" | "all"; // admin modes
  status?: PRODUCT_STATUS; // manual override
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      const params = new URLSearchParams();

      // Admin query behavior
      if (filters?.admin) {
        params.append("admin", filters.admin);
      }

      // Status filter (for admin or storefront overrides)
      if (filters?.status) {
        params.append("status", filters.status);
      }

      // Pagination
      if (filters?.limit) params.append("limit", String(filters.limit));
      if (filters?.offset) params.append("offset", String(filters.offset));

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : `/products`;

      return apiClient.get<Product[]>(url);
    },
  });
}
/* ============================================
   GET PRODUCTS BY CATEGORY
=============================================== */
export function useGetProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["products", "category", categorySlug],
    queryFn: () =>
      apiClient.get<Product[]>(`/products/category/${categorySlug}`),
    enabled: !!categorySlug,
  });
}

/* ============================================
   GET SINGLE PRODUCT
=============================================== */
export function useGetProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => apiClient.get<Product>(`/products/${productId}`),
    enabled: !!productId,
  });
}
/* ============================================
   GET  PRODUCT COLORS
=============================================== */
export function useGetProductColors() {
  return useQuery({
    queryKey: ["product-colors"],
    queryFn: () => apiClient.get<ProductColor[]>(`/products/colors`),
    staleTime: 1000 * 60 * 10,
  });
}
/* ============================================
   GET  PRODUCT SIZES
=============================================== */
export function useGetProductSizes() {
  return useQuery({
    queryKey: ["product-sizes"],
    queryFn: () => apiClient.get<ProductSize[]>(`/products/sizes`),
    staleTime: 1000 * 60 * 10,
  });
}
/* ============================================
   GET AVAILABLE COLORS FOR A PRODUCT
=============================================== */
export function useGetProductAvailableColors(productId: string) {
  return useQuery({
    queryKey: ["product-available-colors", productId],
    queryFn: () =>
      apiClient.get<ProductColor[]>(`/products/${productId}/colors`),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
/* ============================================
   GET AVAILABLE SIZES FOR A PRODUCT
=============================================== */
export function useGetProductAvailableSizes(productId: string) {
  return useQuery({
    queryKey: ["product-available-sizes", productId],
    queryFn: () => apiClient.get<ProductSize[]>(`/products/${productId}/sizes`),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
/* ============================================
   CREATE PRODUCT (multipart/form-data)
=============================================== */
export function useCreateProduct() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return apiClient.postForm("/products", formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      success("Product created successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to create product";
      error(msg);
    },
  });
}

/* ============================================
   UPDATE PRODUCT (multipart/form-data)
=============================================== */
export function useUpdateProduct() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return apiClient.patchForm(`/products/${id}`, formData);
    },

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["product", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      success("Product updated successfully!");
    },

    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update product";
      error(msg);
    },
  });
}

/* ============================================
   ARCHIVE PRODUCT
=============================================== */
/* ============================================
   ARCHIVE PRODUCT(S)
=============================================== */
export function useArchiveProducts() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      const payload = Array.isArray(ids) ? ids : [ids];

      return apiClient.delete("/products/archive", {
        body: JSON.stringify({ ids: payload }),
        headers: { "Content-Type": "application/json" },
      });
    },

    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      const count = Array.isArray(ids) ? ids.length : 1;
      success(`${count} product${count > 1 ? "s" : ""} archived`);
    },

    onError: () => {
      error("Failed to archive product(s)");
    },
  });
}

/* ============================================
   HARD DELETE PRODUCT(S)
=============================================== */
export function useHardDeleteProducts() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      const payload = Array.isArray(ids) ? ids : [ids];

      return apiClient.delete("/products/hard", {
        body: JSON.stringify({ ids: payload }),
        headers: { "Content-Type": "application/json" },
      });
    },

    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      const count = Array.isArray(ids) ? ids.length : 1;
      success(`${count} product${count > 1 ? "s" : ""} permanently deleted`);
    },

    onError: (err, ids) => {
      error(
        `Failed to permanently delete product${Array.isArray(ids) ? "s" : ""}\n${err?.message}`,
      );
    },
  });
}
export function useRestoreProducts() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      const payload = Array.isArray(ids) ? ids : [ids];

      return apiClient.post("/products/restore", { ids: payload });
    },

    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      const count = Array.isArray(ids) ? ids.length : 1;
      success(`${count} product${count > 1 ? "s" : ""} restored`);
    },

    onError: (_err, ids) => {
      error(`Failed to restore product${Array.isArray(ids) ? "s" : ""}`);
    },
  });
}
/* ============================================
   DELETE MULTIPLE IMAGES
=============================================== */
export function useDeleteProductImages() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async ({
      productId,
      imageIds,
    }: {
      productId: string;
      imageIds: string[];
    }) => {
      return apiClient.delete(`/products/${productId}/images`, {
        body: JSON.stringify({ imageIds }),
        headers: { "Content-Type": "application/json" },
      });
    },

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["product", vars.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      success("Images deleted successfully!");
    },

    onError: () => {
      error("Failed to delete images");
    },
  });
}

/* ============================================
   FILTERED PRODUCTS
=============================================== */

export function useFilteredProducts(filters: ProductFilterParams) {
  const query = useInfiniteQuery<FilterResponse, Error>({
    queryKey: ["filtered-products", JSON.stringify(filters)],

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.sizes?.length)
        params.append("sizes", filters.sizes.join(","));
      if (filters.colorIds?.length)
        params.append("colorIds", filters.colorIds.join(","));
      if (filters.types?.length)
        params.append("types", filters.types.join(","));

      if (filters.stock) params.append("stock", filters.stock);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.minPrice !== undefined)
        params.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined)
        params.append("maxPrice", String(filters.maxPrice));

      params.append("limit", String(filters.limit ?? 20));

      if (pageParam) params.append("cursor", pageParam as string);

      return apiClient.get<FilterResponse>(
        `/products/filter?${params.toString()}`,
      );
    },

    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ? lastPage.nextCursor : undefined,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    error: query.error,
  };
}
