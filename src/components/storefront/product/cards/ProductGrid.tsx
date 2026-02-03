"use client";

import { Product } from "@/types";
import SkeletonBlock from "@/components/ui/skeletons/SkeletonBlock";
import ProductCard from "./ProductCard";
import { useLanguageStore } from "@/stores";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  maxItems?: number;
}

export function ProductGrid({
  products = [],
  isLoading,
  maxItems,
}: ProductGridProps) {
  const { translate } = useLanguageStore();
  const displayedProducts = maxItems ? products.slice(0, maxItems) : products;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {Array.from({ length: maxItems ?? 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <SkeletonBlock className="aspect-3/4 rounded-xl" />
            <SkeletonBlock className="h-4 w-3/4 mx-auto" />
            <SkeletonBlock className="h-4 w-1/2 mx-auto" />
            <div className="flex gap-2 justify-center">
              {[1, 2, 3].map((j) => (
                <SkeletonBlock key={j} className="w-6 h-6 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sand-600 dark:text-sand-400">
          {translate("products.empty.noProductsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
