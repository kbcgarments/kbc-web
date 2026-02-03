"use client";

import Link from "next/link";
import { useCopyToClipboard } from "@/hooks";
import { useLanguageStore } from "@/stores";

interface Props {
  orderNumber: string;
}

export default function OrderSuccessActions({ orderNumber }: Props) {
  const { translate, language } = useLanguageStore();
  const copy = useCopyToClipboard(language);

  const trackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/order/track/${orderNumber}`
      : "";

  return (
    <div className="space-y-4">
      {/* Copy buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => copy(orderNumber)}
          className="rounded-md border border-primary px-4 py-2 text-sm text-primary hover:bg-tertiary transition"
        >
          {translate("order.success.actions.copyOrderNumber")}
        </button>

        <button
          onClick={() => copy(trackUrl)}
          className="rounded-md border border-primary px-4 py-2 text-sm text-primary hover:bg-tertiary transition"
        >
          {translate("order.success.actions.copyTrackingLink")}
        </button>
      </div>

      {/* Primary actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          href={`/order/track/${orderNumber}`}
          className="inline-flex justify-center items-center rounded-md bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-dark transition"
        >
          {translate("order.success.actions.trackOrder")}
        </Link>

        <Link
          href="/collections"
          className="inline-flex justify-center items-center rounded-md border border-primary px-4 py-3 text-sm font-medium text-primary hover:bg-tertiary transition"
        >
          {translate("order.success.actions.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
