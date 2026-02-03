"use client";

import { SectionHeader } from "@/components/ui/layout/SectionHeader";
import { useLanguageStore } from "@/stores";
import { ProductGrid } from "../product/cards/ProductGrid";
import { useMemo } from "react";
import { Product } from "@/types";

export default function NewArrivals({
  newArrivals,
  isLoading,
}: {
  newArrivals: Product[];
  isLoading: boolean;
}) {
  const { translate } = useLanguageStore();
  const newArrivalsMemo = useMemo(() => {
    return Array.isArray(newArrivals) ? newArrivals.slice(0, 6) : [];
  }, [newArrivals]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={translate("sections.newArrivals")} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-secondary rounded-xl mb-4" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 md:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-12">
        <SectionHeader title={translate("sections.newArrivals.title")} />

        {/* Product Grid (clean, pure, no callbacks) */}
        <ProductGrid
          products={newArrivalsMemo}
          isLoading={isLoading}
          maxItems={6}
        />
      </div>
    </section>
  );
}
