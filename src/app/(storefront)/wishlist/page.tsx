"use client";
import { Suspense } from "react";

import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import WishlistItemsClient from "@/components/storefront/wishlist/WishlistItemsClient";
import { useLanguageStore } from "@/stores";

export default function WishlistPage() {
  const { translate } = useLanguageStore();
  const breadcrumbItems = [
    { label: translate("navigation.primary.home"), href: "/" },
    { label: translate("wishlist.title") },
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <div className="max-w-7xl mx-auto">
        {/* BREADCRUMB */}
        <BreadCrumb items={breadcrumbItems} />

        {/* WISHLIST ITEMS */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            </div>
          }
        >
          <WishlistItemsClient />
        </Suspense>
      </div>
    </div>
  );
}
