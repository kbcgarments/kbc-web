"use client";

import Link from "next/link";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { useWishlistStore, useLanguageStore } from "@/stores";
import { Surface } from "../checkout/layout/ui";
import ProductCard from "../product/cards/ProductCard";
import { useClearWishlist } from "@/hooks";
import { Product } from "@/types";

export default function WishlistItemsClient() {
  const { translate } = useLanguageStore();
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useClearWishlist();

  const itemCount = useMemo(() => items.length, [items]);

  return (
    <Surface className="mt-10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-tertiary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {translate("wishlist.empty.title")}
            </h3>
            <p className="text-sm text-secondary mb-6 max-w-xs">
              {translate("wishlist.empty.description")}
            </p>
            <Link
              href="/collections"
              className="px-8 py-3 bg-accent text-white  rounded-full font-semibold hover:bg-accent-dark transition-all"
            >
              {translate("wishlist.actions.continueShopping")}
            </Link>
          </div>
        )}

        {/* WISHLIST CONTENT */}
        {items.length > 0 && (
          <>
            {/* HEADER */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Heart
                      className="w-8 h-8 text-accent fill-current"
                      strokeWidth={1.5}
                    />
                    <h1 className="text-3xl font-bold text-primary">
                      {translate("wishlist.shoppingTitle")} ({itemCount})
                    </h1>
                  </div>

                  <p className="text-primary">
                    {itemCount} {itemCount === 1 ? "item" : "items"} saved
                  </p>
                </div>

                <button
                  title={translate("wishlist.actions.clear")}
                  aria-label={translate("wishlist.actions.clear")}
                  onClick={() => clearWishlist.mutate()}
                  disabled={clearWishlist.isPending}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  {clearWishlist.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    translate("wishlist.actions.clear")
                  )}
                </button>
              </div>
            </div>

            {/* ITEMS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {items
                .filter((item): item is Product => Boolean(item?.id))
                .map((item) => (
                  <div key={item.id}>
                    <ProductCard product={item} />
                  </div>
                ))}
            </div>

            {/* BOTTOM CTA */}
            <div className="text-center pt-8 border-t border-gray-100">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:scale-105 duration-500 transition-all group"
              >
                {translate("wishlist.actions.continueShopping")}
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </Surface>
  );
}
