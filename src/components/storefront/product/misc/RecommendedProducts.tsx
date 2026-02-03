"use client";

import { Product } from "@/types";
import { useState } from "react";
import { useLanguageStore } from "@/stores";
import { QuickAddToCartModal } from "@/components/storefront/product/actions/QuickAddToCartModal";
import { ProductGrid } from "../cards/ProductGrid";
import { ProductQuickView } from "../actions/ProductQuickView";

export default function RecommendedProducts({
  isLoading,
  products,
}: {
  isLoading: boolean;
  products: Product[];
}) {
  const { translate } = useLanguageStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  return (
    <div className="mt-20">
      <h2 className="text-2xl font-display font-bold mb-8">
        {translate("product.labels.recommended")}
      </h2>

      <ProductGrid products={products} isLoading={isLoading} maxItems={6} />
      {quickAdd && (
        <QuickAddToCartModal
          product={quickAdd}
          onClose={() => setQuickAdd(null)}
        />
      )}

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
