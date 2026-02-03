"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  LucideIcon,
  Loader2,
  Package,
} from "lucide-react";

import { useCurrencyStore, useLanguageStore } from "@/stores";

import { useCustomerOrder } from "@/hooks";
import { interpolate, localizeField } from "@/utils";
import { Surface } from "../layout/ui";

/* ======================================================
   ORDER SUMMARY
====================================================== */
export default function OrderSummary({ orderId }: { orderId: string }) {
  const { getCurrencySymbol } = useCurrencyStore();
  const { language, translate } = useLanguageStore();
  const { data: order, isLoading } = useCustomerOrder(orderId);
  if (!order) return null;
  return (
    <Surface className="w-full pb-0 px-0 max-h-fit">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-primary">
          {translate("order.track.orderSummary.title")}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {interpolate(
            translate(
              order.items.length === 1
                ? "order.track.orderSummary.items.one"
                : "order.track.orderSummary.items.other",
            ),
            {
              count: order?.items.length,
            },
          )}
        </p>
      </div>

      {/* ITEMS */}
      <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
        {/* ---------- Loading ---------- */}
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="animate-spin rounded-full h-10 w-10 text-accent" />
          </div>
        )}

        {/* ---------- Not Found ---------- */}
        {!isLoading && !order && (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="w-12 h-12 text-tertiary mx-auto mb-3" />
            <p className="text-primary font-semibold mb-2">
              {translate("order.errors.notFound")}
            </p>
          </div>
        )}
        {order?.items.map((item) => {
          const variant =
            item.variantId &&
            item.product.variants?.find((v) => v.id === item.variantId);
          return (
            <div key={item.id} className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <Image
                  src={item.imageUrl || "/assets/placeholder.jpg"}
                  alt={localizeField(item.product, "title", language)}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
                {/* Quantity Badge */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {item.quantity}
                </div>
              </div>
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary line-clamp-2 mb-1">
                  {localizeField(item.product, "title", language)}
                </p>
                {variant && (
                  <p className="text-xs text-tertiary">
                    {translate("common.variant")} {variant.color?.label} /{" "}
                    {variant.size?.key.toUpperCase()}
                  </p>
                )}
                <p className="text-sm font-bold text-accent">
                  {getCurrencySymbol()} {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTALS */}
      <div className="p-6 border-t border-gray-100 space-y-3">
        <Row
          label={translate("order.labels.subtotal")}
          value={getCurrencySymbol() + order.subtotalAmount.toFixed(2)}
        />
        <Row
          label={translate("order.labels.shipping")}
          value={
            order.shippingAmount === 0
              ? translate("order.labels.free")
              : getCurrencySymbol() + order.shippingAmount.toFixed(2)
          }
          accent={order.shippingAmount === 0}
        />

        {/* Total */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <span className="text-base font-semibold text-primary">
            {translate("order.track.orderSummary.total")}
          </span>
          <span className="text-2xl font-bold text-accent">
            {getCurrencySymbol()}
            {order.totalAmount}
          </span>
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className=" ">
        <div className="bg-secondary  p-4 space-y-3 ">
          <Trust
            icon={ShieldCheck}
            text={translate("order.labels.secureCheckout")}
            color="text-blue-600"
          />
          <Trust
            icon={Truck}
            text={translate("order.labels.freeReturns")}
            color="text-green-600"
          />
          <Trust
            icon={HeadphonesIcon}
            text={translate("order.labels.247Support")}
            color="text-purple-600"
          />
        </div>
      </div>
    </Surface>
  );
}

/* ======================================================
   HELPERS
====================================================== */

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span
        className={
          accent ? "text-green-600 font-bold" : "font-semibold text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}

function Trust({
  icon: Icon,
  text,
  color,
}: {
  icon: LucideIcon;
  text: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-linear-to-br from-blue-50 to-(--color-bg-brown)/50 rounded-lg flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
      </div>
      <span className="text-xs text-primary font-medium">{text}</span>
    </div>
  );
}
