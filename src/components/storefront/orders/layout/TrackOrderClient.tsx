"use client";

import {
  Clock,
  Package,
  MapPin,
  Copy,
  CheckCircle,
  Truck,
  Check,
  LucideIcon,
} from "lucide-react";
import {
  useCancelOrder,
  useCopyToClipboard,
  useRetryPayment,
  useTrackOrder,
} from "@/hooks";
import { DEFAULT_STATUS_NOTES } from "@/constants";
import { useLanguageStore } from "@/stores";
import { Surface } from "../../checkout/layout/ui";
import Image from "next/image";
import { localizeField } from "@/utils";
import OrderActionsFooter from "../actions/OrderActionsFooter";
import { Order } from "@/types";

export function TrackOrderClient({ orderNumber }: { orderNumber: string }) {
  const { data: order, isLoading } = useTrackOrder(orderNumber);
  const { language, translate } = useLanguageStore();
  const retryPayment = useRetryPayment();
  const cancelOrder = useCancelOrder();

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
    } catch {}
  };
  const copy = useCopyToClipboard(language);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-accent/5 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-gray-600">{translate("order.track.loading")}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-accent/5 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {translate("order.track.notFound.title")}
          </h2>
          <p className="text-gray-600">
            {translate("order.track.notFound.description")}
          </p>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);
  const currentStep = getStatusStep(order.status);

  return (
    <Surface>
      <div className="max-w-8xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}
        <div className="bg-tertiary rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top colored bar */}
          <div className={`h-1.5 bg-linear-to-r ${statusColor.gradient}`} />

          <div className="p-4 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="min-w-full flex justify-between gap-6 mb-2">
                  <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
                    {translate("order.track.track.pageTitle")}
                  </h1>
                  <div
                    className={`p-2 md:px-4 py-2 rounded-lg ${statusColor.badge}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColor.dot} animate-pulse`}
                      />
                      <span className="text-sm font-semibold capitalize">
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2 ">
                  <span className="text-sm text-primary">
                    {translate("order.track.track.orderLabel")}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-900">
                    {order.orderNumber}
                  </span>
                  <button
                    onClick={() => copy(order.orderNumber)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title={translate("order.track.track.copyOrderNumber")}
                  >
                    <Copy className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`flex items-start gap-3 p-4 rounded-xl ${statusColor.bg}`}
            >
              <CheckCircle
                className={`w-5 h-5 mt-0.5 ${statusColor.text}`}
                strokeWidth={1.5}
              />
              <div>
                <p className={`font-semibold ${statusColor.text}`}>
                  {order.status.replaceAll("_", " ")}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {DEFAULT_STATUS_NOTES[order.status]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PROGRESS TRACKER ================= */}
        <div className="bg-tertiary rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-primary mb-6">
            {translate("order.track.track.deliveryProgress")}
          </h2>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className={`absolute top-5 left-0 h-0.5 bg-linear-to-r ${statusColor.gradient} transition-all duration-500`}
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />

            <div className="relative flex justify-between">
              <ProgressStep
                icon={Clock}
                label={translate("order.track.track.steps.orderPlaced")}
                active={currentStep >= 1}
                completed={currentStep > 1}
              />
              <ProgressStep
                icon={Package}
                label={translate("order.track.track.steps.processing")}
                active={currentStep >= 2}
                completed={currentStep > 2}
              />
              <ProgressStep
                icon={Truck}
                label={translate("order.track.track.steps.shipped")}
                active={currentStep >= 3}
                completed={currentStep > 3}
              />
              <ProgressStep
                icon={CheckCircle}
                label={translate("order.track.track.steps.delivered")}
                active={currentStep >= 4}
                completed={currentStep >= 4}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
              {translate("order.track.track.timeline")}
            </h3>
            <div className="space-y-4">
              {order.orderTimelines.map((t, i) => (
                <div key={t.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-accent" : "bg-gray-300"}`}
                    />
                    {i < order.orderTimelines.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-primarytext-sm capitalize">
                      {t.status.replaceAll("_", " ")}
                    </p>
                    <p className="text-sm text-tertiary mt-0.5">
                      {t.note ?? DEFAULT_STATUS_NOTES[t.status]}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ================= ITEMS ================= */}
          <div className="bg-tertiary rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-primary mb-4">
              {translate("order.track.track.items")}
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => {
                const { variant } = item;
                const selectedColor = variant.color;
                const selectedSize = variant.size;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <Image
                      src={item.imageUrl ?? "/assets/placeholder.jpg"}
                      alt="Image"
                      width={50}
                      height={70}
                      className="object-cover rounded-lg"
                      sizes="100px"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primarytext-sm truncate">
                        {localizeField(item.product, "title", language)}
                      </p>

                      {variant && (
                        <p className="text-xs text-tertiary">
                          {translate("order.track.track.variant")}:{" "}
                          {selectedColor?.label} /{" "}
                          {selectedSize?.label.toUpperCase()}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-tertiary">
                          {translate("order.track.track.qty")}: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {order.currency}{" "}
                          {(item.priceLocal * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <span className="font-semibold text-primary">
                {translate("order.track.track.total")}
              </span>
              <span className="text-xl font-bold text-accent">
                {order.currency} {order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ================= SHIPPING ================= */}
          <div className="bg-tertiary rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" strokeWidth={1.5} />
              <h2 className="text-lg font-bold text-primary">
                {translate("order.track.track.shipping")}
              </h2>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-semibold text-primary">
                {order.shippingFullName}
              </p>
              <p className="text-tertiary">{order.shippingStreet}</p>
              <p className="text-tertiary">
                {order.shippingCity}, {order.shippingState}{" "}
                {order.shippingPostal}
              </p>
              <p className="text-tertiary font-medium">
                {order.shippingCountry}
              </p>
            </div>

            {/* Contact */}
            {order.shippingPhone && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-primary uppercase tracking-wide mb-2">
                  {translate("order.track.track.contact")}
                </p>
                <p className="text-sm text-tertiary">{order.shippingPhone}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <OrderActionsFooter
          order={order as Order}
          translate={translate}
          onRetryPayment={handleRetryPayment}
          retryLoading={retryPayment.isPending}
          onCancelOrder={handleCancelOrder}
          cancelLoading={cancelOrder.isPending}
        />
      </div>
    </Surface>
  );
}

/* ================= HELPERS ================= */

function ProgressStep({
  icon: Icon,
  label,
  active,
  completed,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
          ${
            completed
              ? "bg-accent text-white shadow-md"
              : active
                ? "bg-accent/10 text-accent border-2 border-accent"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          }
        `}
      >
        {completed ? (
          <Check className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        )}
      </div>
      <span className="text-xs font-medium text-center text-tertiary">
        {label}
      </span>
    </div>
  );
}

function getStatusColor(status: string) {
  const statusLower = status.toLowerCase();

  if (statusLower.includes("delivered")) {
    return {
      gradient: "from-emerald-500 to-green-500",
      badge: "bg-emerald-50 border border-emerald-200 text-emerald-700",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-600",
    };
  }

  if (statusLower.includes("shipped") || statusLower.includes("transit")) {
    return {
      gradient: "from-blue-500 to-cyan-500",
      badge: "bg-blue-50 border border-blue-200 text-blue-700",
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-600",
    };
  }

  if (statusLower.includes("processing") || statusLower.includes("confirmed")) {
    return {
      gradient: "from-amber-500 to-orange-500",
      badge: "bg-amber-50 border border-amber-200 text-amber-700",
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-600",
    };
  }

  if (statusLower.includes("cancelled")) {
    return {
      gradient: "from-red-500 to-rose-500",
      badge: "bg-red-50 border border-red-200 text-red-700",
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-600",
    };
  }

  return {
    gradient: "from-gray-500 to-gray-600",
    badge: "bg-gray-50 border border-gray-200 text-gray-700",
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-600",
  };
}

function getStatusStep(status: string): number {
  const statusLower = status.toLowerCase();

  if (statusLower.includes("delivered")) return 4;
  if (statusLower.includes("shipped") || statusLower.includes("transit"))
    return 3;
  if (statusLower.includes("processing") || statusLower.includes("confirmed"))
    return 2;
  return 1;
}
