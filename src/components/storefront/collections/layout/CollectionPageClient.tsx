"use client";

import { useMemo } from "react";
import { useGetCategories, useFilteredProducts } from "@/hooks";
import CollectionHeader from "../header/CollectionHeader";
import CollectionFiltersSidebar from "../filters/CollectionFiltersSidebar";
import CollectionMobileFilters from "../filters/CollectionMobileFilters";
import CollectionHeroBanner from "./CollectionHeroBanner";
import { useCollectionFilters, useUIStore } from "@/stores";
import ProductCollectionView from "../products/ProductCollectionView";

export default function CollectionPageClient({ slug }: { slug: string }) {
  const mobileFiltersOpen = useUIStore((s) => s.mobileFiltersOpen);
  const closeFilters = useUIStore((s) => s.closeFilters);
  const { data: allCategories = [] } = useGetCategories();
  const activeCategory = useMemo(
    () => allCategories.find((c) => c.slug === slug) ?? null,
    [allCategories, slug],
  );
  const { sizes, colorIds, types, stock, minPrice, maxPrice, sort } =
    useCollectionFilters();
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredProducts({
    category: slug,
    limit: 20,
    sizes,
    colorIds,
    types,
    stock,
    minPrice,
    maxPrice,
    sort,
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  return (
    <div className="min-h-screen bg-primary">
      <CollectionHeroBanner category={activeCategory} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-6">
        <CollectionHeader totalItems={products.length} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <CollectionFiltersSidebar categories={allCategories} />
          </div>
        </aside>

        <main className="lg:col-span-3">
          <ProductCollectionView
            products={products}
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoadingMore={isFetchingNextPage}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </main>
      </div>

      <CollectionMobileFilters
        categories={allCategories}
        open={mobileFiltersOpen}
        onClose={closeFilters}
      />
    </div>
  );
}
