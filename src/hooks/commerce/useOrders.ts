"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  interpretOrderError,
  resolveOrderSuccess,
  useMutationHelpers,
} from "@/lib";
import { useLanguageStore, useToastStore } from "@/stores";
import type {
  CheckoutResponse,
  Order,
  OrderPayload,
  OrderStatus,
  UpdateOrderShippingPayload,
  UpdateOrderStatusPayload,
} from "@/types";

export function useCheckoutOrder(cartId: string) {
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (payload: OrderPayload) =>
      apiClient.post<CheckoutResponse>(`/orders/checkout/${cartId}`, payload),

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveOrderSuccess("checkout")));
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      // error(translate(interpretOrderError(err)));
      error(err.message);
    },
  });
}

/* ======================================================
   PUBLIC — TRACK ORDER
   GET /orders/track/{orderNumber}
====================================================== */

export function useTrackOrder(orderNumber: string) {
  return useQuery({
    queryKey: ["track-order", orderNumber],
    queryFn: () => apiClient.get<Order>(`/orders/track/${orderNumber}`),
    enabled: !!orderNumber,
  });
}

/* ======================================================
   CUSTOMER — CANCEL ORDER (Logged-in or Guest)
   POST /orders/{id}/cancel
====================================================== */

export function useCancelOrder() {
  const { success, error } = useToastStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { orderId: string; deviceId?: string }) => {
      return apiClient.post(`/orders/${payload.orderId}/cancel`, {
        deviceId: payload.deviceId,
      });
    },

    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate("order.success.cancelSuccessfully"));

      // refresh customer order lists + order detail views
      qc.invalidateQueries({ queryKey: ["customer-orders"] });
      qc.invalidateQueries({ queryKey: ["customer-order"] });
      qc.invalidateQueries({ queryKey: ["track-order"] });
    },

    onError: (err) => {
      const { translate } = useLanguageStore.getState();
      error(translate(interpretOrderError(err)));
    },
  });
}

/* ======================================================
   ADMIN — LIST ORDERS
   GET /orders/admin
====================================================== */

export function useAdminOrders(filters?: { status?: OrderStatus }) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);

      const qs = params.toString();
      return apiClient.get<Order[]>(qs ? `/orders/?${qs}` : "/orders");
    },
  });
}

/* ======================================================
   ADMIN — SINGLE ORDER
   GET /orders/{id}
====================================================== */

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      try {
        return await apiClient.get<Order>(`/orders/${orderId}`);
      } catch (e) {
        throw e;
      }
    },
    enabled: !!orderId,
  });
}

/* ======================================================
   ADMIN — UPDATE ORDER STATUS
   PATCH /orders/{id}/status
====================================================== */

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (payload: {
      orderId: string;
      data: UpdateOrderStatusPayload;
    }) => apiClient.patch(`/orders/${payload.orderId}/status`, payload.data),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["order", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      success("Order status updated");
    },

    onError: () => {
      error("Failed to update order status");
    },
  });
}

export function useUpdateOrderShipping() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: async ({ orderId, ...payload }: UpdateOrderShippingPayload) =>
      apiClient.patch(`/orders/${orderId}/shipping`, payload),

    onSuccess: (_, vars) => {
      success("Shipping details updated");
      queryClient.invalidateQueries({ queryKey: ["order", vars.orderId] });
    },

    onError: (err: Error) => {
      error(err.message || "Failed to update shipping");
    },
  });
}
/* ======================================================
   CUSTOMER — LIST MY ORDERS
   GET /orders/my
====================================================== */

export function useCustomerOrders() {
  return useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => apiClient.get<Order[]>("/orders/my"),
  });
}
/* ======================================================
   CUSTOMER — SINGLE ORDER
   GET /orders/my/{id}
====================================================== */

export function useCustomerOrder(orderId: string) {
  return useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => apiClient.get<Order>(`/orders/my/${orderId}`),
    enabled: !!orderId,
  });
}
export function useGetCustomerOrderByOrderNumber(orderNumber: string) {
  return useQuery({
    queryKey: ["customer-order", orderNumber],
    queryFn: () => apiClient.get<Order>(`/orders/${orderNumber}`),
    enabled: !!orderNumber,
  });
}
