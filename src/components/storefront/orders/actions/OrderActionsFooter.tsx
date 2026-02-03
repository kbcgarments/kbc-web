"use client";

import { Order } from "@/types";
import { Clock, Loader2, Trash2, ReceiptText, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderActionsFooterProps {
  order: Order | null;
  translate: (key: string) => string;
  onRetryPayment: () => Promise<void>;
  onCancelOrder: () => Promise<void>;
  retryLoading: boolean;
  cancelLoading: boolean;
  isTrackButttonVisible?: boolean;
}

export default function OrderActionsFooter({
  order,
  translate,
  onRetryPayment,
  onCancelOrder,
  retryLoading,
  cancelLoading,
  isTrackButttonVisible = false,
}: OrderActionsFooterProps) {
  if (!order) return null;

  const isPaymentRetryable =
    (order.paymentStatus === "FAILED" || order.paymentStatus === "PENDING") &&
    order.status === "PENDING";

  const canCancelOrder =
    order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="flex flex-col gap-3 p-4 border-t border-primary/20">
      <div className="flex items-center justify-between gap-3">
        {/* Track Order Button */}
        {isTrackButttonVisible && (
          <Link
            href={`/order/track/${order.orderNumber}`}
            target="_blank"
            className="w-full py-3 bg-(--color-text-accent) text-white rounded-lg font-semibold
            hover:bg-accent-dark transition-all flex items-center justify-center gap-3"
          >
            <MapPin className="w-5 h-5" />
            {translate("profile.orders.actions.trackOrder")}
          </Link>
        )}
        {/* Receipt Button */}
        {!isPaymentRetryable && order.receiptUrl && (
          <Link
            href={order.receiptUrl}
            target="_blank"
            className="w-full py-3 bg-(--color-text-accent) text-white rounded-lg font-semibold
            hover:bg-accent-dark transition-all flex items-center justify-center gap-3"
          >
            <ReceiptText className="w-5 h-5" />
            {translate("profile.orders.actions.viewReceipt")}
          </Link>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        {/* Retry Payment Button */}
        {isPaymentRetryable && (
          <button
            onClick={onRetryPayment}
            disabled={retryLoading}
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-3
              bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700
              transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {retryLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Clock className="w-5 h-5" />
                {translate("profile.orders.actions.retryPayment")}
              </>
            )}
          </button>
        )}

        {/* Cancel Order Button */}
        {canCancelOrder && (
          <button
            onClick={onCancelOrder}
            disabled={cancelLoading}
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-3
              bg-red-600 text-white hover:bg-red-700 active:bg-red-800
              transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {cancelLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                {translate("profile.orders.actions.cancelOrder")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
