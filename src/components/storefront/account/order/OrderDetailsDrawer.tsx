"use client";

import { MapPin, Package, Clock, X, Loader2 } from "lucide-react";
import { useCancelOrder, useCustomerOrder, useRetryPayment } from "@/hooks";
import { STATUS_COLORS } from "@/constants";
import { useLockBodyScroll } from "@/hooks";
import Image from "next/image";
import { useLanguageStore } from "@/stores";
import { interpolate, localizeField } from "@/utils";
import OrderActionsFooter from "../../orders/actions/OrderActionsFooter";
import { Order } from "@/types";

interface OrderDetailsDrawerProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

const getOrderCurrency = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    ZAR: "R",
  };
  return symbols[currency] || currency;
};

export default function OrderDetailsDrawer({
  open,
  orderId,
  onClose,
}: OrderDetailsDrawerProps) {
  useLockBodyScroll(open);
  const { translate, language } = useLanguageStore();
  const retryPayment = useRetryPayment();
  const cancelOrder = useCancelOrder();
  const { data: order, isLoading } = useCustomerOrder(orderId!);

  /* ==========================================
      HANDLE RETRY PAYMENT → FLW POPUP
  ========================================== */
  const handleRetryPayment = async () => {
    if (!order) return;

    try {
      const res = await retryPayment.mutateAsync({
        orderId: order.id,
      });

      // CASE 1 — Using saved card (already charged)
      if (res.success) {
        window.location.href = `/order/success/${order.orderNumber}`;
        return;
      }

      // CASE 2 — New inline popup
      if (res.paymentConfig) {
        window.FlutterwaveCheckout({
          ...res.paymentConfig,

          callback: function () {
            window.location.href = `/order/success/${order.orderNumber}`;
          },

          onclose: function () {},
        });
      }
    } catch {}
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await cancelOrder.mutateAsync({ orderId: order.id });
      onClose();
    } catch {}
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* DRAWER PANEL */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-primary z-50 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between py-4 px-4 border-b border-primary/50">
            <h2 className="text-lg font-bold text-primary">
              {translate("profile.orders.order.orderDetails")}
            </h2>

            <button
              onClick={onClose}
              title="Close"
              className="p-2 rounded-full bg-primary shadow-md hover:shadow-xl hover:rotate-45 transition-all duration-300"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Loading */}
            {isLoading && (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="animate-spin rounded-full h-10 w-10 text-accent" />
              </div>
            )}

            {/* Not Found */}
            {!isLoading && !order && (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="w-12 h-12 text-tertiary mx-auto mb-3" />
                <p className="text-primary font-semibold mb-2">
                  {translate("profile.orders.empty.orderNotFound")}
                </p>
              </div>
            )}

            {/* ORDER DETAILS */}
            {!isLoading && order && (
              <>
                {/* Order Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-primary truncate">
                      {order.orderNumber}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-sm text-secondary">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-secondary/20 rounded-xl border border-primary/10 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-primary mb-4">
                    <Package className="w-4 h-4 text-accent" />
                    {interpolate(
                      translate(
                        order.items.length === 1
                          ? "profile.orders.order.items.one"
                          : "profile.orders.order.items.other",
                      ),
                      { count: order.items.length },
                    )}
                  </h4>

                  <div className="space-y-3">
                    {order.items.map((item) => {
                      const { variant } = item;
                      const selectedColor = variant.color;
                      const selectedSize = variant.size;

                      return (
                        <div
                          key={item.id}
                          className="flex justify-between gap-3 pb-3 border-b border-primary/10 last:border-0"
                        >
                          <div className="flex gap-2">
                            <Image
                              src={item.imageUrl ?? "/assets/placeholder.jpg"}
                              alt={translate("profile.orders.preview")}
                              width={50}
                              height={70}
                              className="object-cover rounded-lg"
                              sizes="100px"
                            />

                            <div className="min-w-0">
                              <p className="font-medium text-primary truncate">
                                {localizeField(item.product, "title", language)}
                              </p>

                              <p className="text-xs text-secondary">
                                {translate("common.quantity")}: {item.quantity}
                              </p>

                              {variant && (
                                <p className="text-xs text-tertiary">
                                  {translate("common.variant")}:{" "}
                                  {selectedColor?.label} /{" "}
                                  {selectedSize?.label.toUpperCase()}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="font-semibold text-primary tabular-nums">
                            {getOrderCurrency(order.currency)}
                            {(item.priceLocal * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-primary/10">
                    <span className="font-semibold text-primary">
                      {translate("common.total")}
                    </span>
                    <span className="text-xl font-bold text-accent tabular-nums">
                      {getOrderCurrency(order.currency)}
                      {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-secondary/20 rounded-xl border border-primary/10 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-primary mb-3">
                    <MapPin className="w-4 h-4 text-accent" />
                    {translate("profile.orders.shippingAddress")}
                  </h4>

                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-primary">
                      {order.shippingFullName}
                    </p>
                    <p className="text-secondary">{order.shippingStreet}</p>
                    <p className="text-secondary">
                      {order.shippingCity}
                      {order.shippingState && `, ${order.shippingState}`}
                      {order.shippingPostal && ` ${order.shippingPostal}`}
                    </p>
                    <p className="text-secondary">{order.shippingCountry}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-secondary/20 rounded-xl border border-primary/10 p-4">
                  <h4 className="flex items-center gap-2 font-semibold text-primary mb-4">
                    <Clock className="w-4 h-4 text-accent" />
                    {translate("profile.orders.orderTimeline")}
                  </h4>

                  <div className="space-y-4">
                    {order.orderTimelines.map((timeline, index) => (
                      <div key={timeline.id} className="relative pl-6">
                        {index !== order.orderTimelines.length - 1 && (
                          <div className="absolute left-2 top-5 bottom-0 w-px bg-primary/10" />
                        )}
                        <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-primary text-sm">
                            {timeline.status.replace(/_/g, " ")}
                          </p>
                          {timeline.note && (
                            <p className="text-xs text-secondary mt-1">
                              {timeline.note}
                            </p>
                          )}
                          <p className="text-xs text-tertiary mt-1">
                            {new Date(timeline.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <OrderActionsFooter
            order={order as Order}
            isTrackButttonVisible
            translate={translate}
            onRetryPayment={handleRetryPayment}
            retryLoading={retryPayment.isPending}
            onCancelOrder={handleCancelOrder}
            cancelLoading={cancelOrder.isPending}
          />
        </div>
      </aside>
    </>
  );
}
