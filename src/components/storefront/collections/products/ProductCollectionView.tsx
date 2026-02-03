// ProductCollectionView.tsx
"use client";

import { Loader } from "lucide-react";
import { Product } from "@/types";
import { useCollectionFilters } from "@/stores/useCollectionFilters";

import { ProductGrid } from "../../product/cards/ProductGrid";
import ProductListCard from "../../product/cards/ProductListCard";
import CollectionEmptyState from "../empty/CollectionEmptyState";
import { LoadMoreTrigger } from "./LoadMoreTrigger";

interface Props {
  products: Product[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
}

export default function ProductCollectionView({
  products,
  onLoadMore,
  hasMore,
  isLoadingMore,
  isLoading,
  isFetching,
}: Props) {
  const { view } = useCollectionFilters();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isFetching && products.length === 0) {
    return <CollectionEmptyState />;
  }

  return (
    <>
      {/* GRID VIEW */}
      {view === "grid" ? (
        <ProductGrid products={products} />
      ) : (
        <div className="space-y-10">
          {products.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      <div className="py-10 flex justify-center">
        {isLoadingMore && (
          <Loader className="w-5 h-5 animate-spin text-accent" />
        )}

        <LoadMoreTrigger
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          isLoading={Boolean(isLoadingMore)}
        />
      </div>
    </>
  );
}
