"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib";
import { useToastStore } from "@/stores";
import type { PaymentMethod, UpdatePaymentMethodPayload } from "@/types";

/* ============================================================================
   1. START PAYMENT WITH NEW CARD
   POST /payments/orders/:orderId/pay
   Returns → { paymentConfig }
============================================================================ */
export function useStartPayment() {
  return useMutation<
    { paymentConfig: Record<string, unknown> },
    Error,
    { orderId: string }
  >({
    mutationFn: ({ orderId }) =>
      apiClient.post(`/payments/orders/${orderId}/pay`),
  });
}

/* ============================================================================
   2. PAY WITH SAVED CARD (TOKENIZED)
   POST /payments/orders/:orderId/pay-with-saved
============================================================================ */
export function usePayWithSaved() {
  return useMutation<
    { success: boolean },
    Error,
    { orderId: string; paymentMethodId: string }
  >({
    mutationFn: ({ orderId, paymentMethodId }) =>
      apiClient.post(`/payments/orders/${orderId}/pay-with-saved`, {
        paymentMethodId,
      }),
  });
}

/* ============================================================================
   3. RETRY PAYMENT
   POST /payments/orders/:orderId/retry
   - If paymentMethodId is passed → saved card flow
   - Otherwise → new inline popup flow
============================================================================ */
export function useRetryPayment() {
  const { error } = useToastStore();

  return useMutation<
    { paymentConfig?: Record<string, unknown>; success?: boolean },
    Error,
    { orderId: string; paymentMethodId?: string }
  >({
    mutationFn: ({ orderId, paymentMethodId }) =>
      apiClient.post(`/payments/orders/${orderId}/retry`, {
        paymentMethodId,
      }),

    onError: (err) => {
      error(err.message || "Unable to retry payment");
    },
  });
}

/* ============================================================================
   4. LIST SAVED PAYMENT METHODS (CARDS)
   GET /payments/methods
============================================================================ */
export function useCustomerPaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => apiClient.get<PaymentMethod[]>("/payments/methods"),
  });
}

/* ============================================================================
   5. UPDATE SAVED PAYMENT METHOD
   PATCH /payments/methods/:id
============================================================================ */
export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: ({
      paymentMethodId,
      ...payload
    }: UpdatePaymentMethodPayload & { paymentMethodId: string }) =>
      apiClient.patch(`/payments/methods/${paymentMethodId}`, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment-methods"] });
      success("Payment method updated");
    },

    onError: (err: Error) => {
      error(err.message || "Failed to update payment method");
    },
  });
}

/* ============================================================================
   6. DELETE SAVED PAYMENT METHOD
   DELETE /payments/methods/:id
============================================================================ */
export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (methodId: string) =>
      apiClient.delete(`/payments/methods/${methodId}`),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment-methods"] });
      success("Payment method deleted");
    },

    onError: (err: Error) => {
      error(err.message || "Failed to delete payment method");
    },
  });
}
