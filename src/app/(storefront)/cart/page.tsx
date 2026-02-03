"use client";
import { Suspense } from "react";

import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import CartItemsClient from "@/components/storefront/cart/CartItemsClient";

export default function CartPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shopping Cart" },
  ];

  return (
    <div className="min-h-fit bg-primary pb-20">
      <div className="max-w-7xl mx-auto px-2 flex flex-col space-y-8">
        {/* BREADCRUMB */}
        <BreadCrumb items={breadcrumbItems} />

        {/* CART ITEMS */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            </div>
          }
        >
          <CartItemsClient />
        </Suspense>
      </div>
    </div>
  );
}
