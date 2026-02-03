"use client";

import Link from "next/link";
import { useLanguageStore } from "@/stores";
import { useMemo } from "react";
import ProductCard from "../product/cards/ProductCard";
import { SectionHeader } from "@/components/ui/layout/SectionHeader";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types";

export default function FeaturedProductsSection({
  featuredProducts,
  isLoading,
}: {
  featuredProducts: Product[];
  isLoading: boolean;
}) {
  const { translate } = useLanguageStore();

  const editorsPicks = useMemo(() => {
    return Array.isArray(featuredProducts) ? featuredProducts.slice(0, 6) : [];
  }, [featuredProducts]);

  if (isLoading) {
    return (
      <section className="bg-secondary">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            title={translate("sections.handpicked")}
            subtitle={translate("sections.editorsPicksDesc")}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-tertiary rounded-xl mb-4" />
                <div className="h-4 bg-tertiary rounded w-3/4 mb-2" />
                <div className="h-4 bg-tertiary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!editorsPicks.length) return null;

  return (
    <section className="py-10 bg-secondary min-h-225">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <SectionHeader
          title={translate("sections.editorsPicks.title")}
          subtitle={translate("sections.editorsPicks.description")}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {editorsPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/collections"
            className="inline-flex w-full max-w-100 min-h-14 justify-center items-center gap-4  border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:scale-110 transition-all duration-500"
          >
            {translate("common.exploreAll")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
