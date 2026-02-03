"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ReceiptText, Copy } from "lucide-react";
import type { Currency, NormalizedOrder } from "@/types";
import { STATUS_COLORS } from "@/constants";
import { useUIStore, useLanguageStore } from "@/stores";
import { getOrderCurrency, interpolate } from "@/utils";
import { useCopyToClipboard } from "@/hooks";

interface OrderCardProps {
  order: NormalizedOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const { openOrderDetails } = useUIStore();
  const { language, translate } = useLanguageStore();
  /** ----------------------------------------
   * SAFE IMAGE RESOLUTION (NO RUNTIME ERRORS)
   * ---------------------------------------- */

  const previewImage = order._ui.previewImage;
  const itemCount = order._ui.itemCount;
  /** ----------------------------------------
   * COPY ORDER NUMBER
   * ---------------------------------------- */
  const handleCopy = useCopyToClipboard(language);

  return (
    <div className="bg-secondary/20 rounded-xl border border-primary/10 hover:border-accent/40 hover:shadow-md transition-all p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          {/* IMAGE */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src={previewImage}
              alt={translate("profile.orders.preview")}
              width={50}
              height={70}
              className="object-cover w-full h-full rounded-lg"
              style={{ width: "auto", height: "auto" }}
              sizes="100px 100px"
            />
          </div>

          {/* DETAILS */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-semibold text-primary text-sm sm:text-base truncate">
                {order.orderNumber}
              </h3>

              {/* COPY */}
              <button
                onClick={() => handleCopy(order.orderNumber)}
                title={translate("profile.orders.actions.copyOrderNumber")}
                className="p-1 scale-110 rounded-md hover:bg-secondary text-tertiary hover:text-accent transition-color duration-300 active:scale-90 active:text-accent"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* STATUS */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-medium border ${STATUS_COLORS[order.status]}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* META */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <span className="w-1 h-1 rounded-full bg-tertiary" />
              <span>
                {interpolate(
                  translate(
                    itemCount === 1
                      ? "profile.orders.order.items.one"
                      : "profile.orders.order.items.other",
                  ),
                  { count: itemCount },
                )}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6">
          {/* TOTAL */}
          <div className="text-left lg:text-right">
            <div className="text-lg sm:text-xl font-bold text-accent tabular-nums">
              {getOrderCurrency(order.currency as Currency)}
              {order?.totalAmount?.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-tertiary">
              {translate("profile.orders.order.orderTotal")}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openOrderDetails(order.id)}
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              title={translate("profile.orders.actions.viewDetails")}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>

            {typeof order.receiptUrl === "string" && (
              <Link
                href={order.receiptUrl}
                target="_blank"
                title={translate("profile.orders.actions.viewReceipt")}
                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-primary border border-primary/20 text-secondary hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <ReceiptText className="w-4 h-4" strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
