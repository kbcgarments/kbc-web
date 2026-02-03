"use client";

import { useLanguageStore } from "@/stores/useLanguageStore";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "../product/cards/ProductCard";
import { SectionHeader } from "@/components/ui/layout/SectionHeader";
import { Product } from "@/types";

export default function BestSellersSection({
  bestSellers,
  isLoading,
}: {
  bestSellers: Product[];
  isLoading: boolean;
}) {
  const { translate } = useLanguageStore();

  const bestSellersMemo = useMemo(() => {
    return Array.isArray(bestSellers) ? bestSellers.slice(0, 8) : [];
  }, [bestSellers]);
  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader title={translate("sections.bestSellers")} />
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

  if (!bestSellers.length) return null;

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          title={translate("sections.bestSellers.title")}
          subtitle={translate("sections.bestSellers.description")}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestSellersMemo.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/collections"
            className="inline-flex w-full max-w-100  min-h-14 justify-center items-center gap-4  border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:scale-110 transition-all duration-500"
          >
            {translate("common.viewAll")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
