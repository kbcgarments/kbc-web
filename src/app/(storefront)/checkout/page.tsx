"use client";

import CheckoutClient from "@/components/storefront/checkout/layout/CheckoutClient";
import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import { useCartStore, useLanguageStore } from "@/stores";

export default function CheckoutPage() {
  const cartId = useCartStore((s) => s.id);
  const { translate } = useLanguageStore();
  if (!cartId) {
    return (
      <div className="bg-primary py-20 text-center text-secondary">
        <p>{translate("cart.empty.title")}</p>
        <p>{translate("cart.empty.description")}</p>
      </div>
    );
  }
  const breadCrumbItems = [
    { label: translate("navigation.primary.home"), href: "/" },
    { label: translate("checkout.title") },
  ];

  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto">
        <BreadCrumb items={breadCrumbItems} />
        <CheckoutClient />
      </div>
    </div>
  );
}
