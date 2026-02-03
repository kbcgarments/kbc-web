"use client";

import { useLanguageStore } from "@/stores";
import OrderSuccessActions from "@/components/storefront/orders/actions/OrderSuccessActions";

export default function OrderSuccessClient({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const { translate } = useLanguageStore();

  return (
    <div className="min-h-[70vh] bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-secondary border border-primary rounded-xl p-8 text-center space-y-8">
        {/* Check icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent text-lg">
          ✓
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-semibold text-primary">
            {translate("order.success.title")}
          </h1>
          <p className="text-sm text-secondary">
            {translate("order.success.description")}
          </p>
        </div>

        {/* Order number block */}
        <div className="rounded-lg border border-primary bg-tertiary px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-tertiary mb-1">
            {translate("order.success.orderNumberLabel")}
          </p>
          <p className="font-mono text-lg font-medium text-accent">
            {orderNumber}
          </p>
        </div>

        {/* Client-side actions */}
        <OrderSuccessActions orderNumber={orderNumber} />

        {/* Footer note */}
        <p className="text-xs text-tertiary">
          {translate("order.success.emailNotice")}
        </p>
      </div>
    </div>
  );
}
