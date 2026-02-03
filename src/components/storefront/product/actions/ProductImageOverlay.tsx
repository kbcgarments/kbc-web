"use client";

import { ShoppingBag, Eye } from "lucide-react";
import { useWishlistStore } from "@/stores/useWishlistStore";
import AnimatedWishlistIcon from "@/components/ui/buttons/AnimatedWishlistIcon";
import { useToggleWishlist } from "@/hooks";
import type { Product } from "@/types";
import { useLanguageStore, useUIStore } from "@/stores";

interface Props {
  product: Product;
  isVisible: boolean;
}

export function ProductImageOverlay({ product, isVisible }: Props) {
  const { translate } = useLanguageStore();
  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useWishlistStore((state) => state.hasItem(product.id));
  const quickAdd = useUIStore((state) => state.openQuickAdd);
  const quickView = useUIStore((state) => state.openQuickView);

  return (
    <div
      className={`
        absolute inset-x-0 bottom-0 hidden md:block
        bg-linear-to-t from-black/70 via-black/40 to-transparent
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <div className="py-4 md:py-6 flex justify-center px-2">
        <div
          className="
            flex items-center justify-center
            bg-primary dark:bg-sand-900
            px-4 md:px-8 py-2 md:py-3 rounded-full shadow-lg
            gap-3 md:gap-6
          "
        >
          {/* WISHLIST */}
          <button
            title={
              isInWishlist
                ? translate("wishlist.actions.remove")
                : translate("wishlist.actions.add")
            }
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist.mutate(product);
            }}
            className="p-1 md:p-0 cursor-pointer"
          >
            <AnimatedWishlistIcon
              isInWishlist={isInWishlist}
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>

          {/* SEPARATOR */}
          <span className="block w-px h-5 md:h-6 bg-sand-300 dark:bg-sand-700" />

          {/* 🛒 QUICK ADD */}
          <button
            title={translate("cart.actions.add")}
            onClick={(e) => {
              e.stopPropagation();
              quickAdd(product);
            }}
            className="
              flex items-center justify-center 
              text-sand-900 dark:text-sand-50 cursor-pointer
              hover:text-accent dark:hover:text-accent-light
              transition-colors
              p-1 md:p-0
            "
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* SEPARATOR */}
          <span className="block w-px h-5 md:h-6 bg-sand-300 dark:bg-sand-700" />

          {/* QUICK VIEW */}
          <button
            title="Quick view"
            onClick={(e) => {
              e.stopPropagation();
              quickView(product);
            }}
            className="
              flex items-center justify-center 
              text-sand-900 dark:text-sand-50 cursor-pointer
              hover:text-accent dark:hover:text-accent-light
              transition-colors
              p-1 md:p-0
            "
          >
            <Eye className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
