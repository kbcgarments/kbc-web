"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";

import { Product } from "@/types";
import { useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";
import { ProductQuantitySelector } from "../selectors/ProductQuantitySelector";
import { useProductVariant } from "@/hooks";

type Props = {
  product: Product;
  variant: ReturnType<typeof useProductVariant>;
  quantity: number;
  setQuantity: (q: number) => void;
  onAdd: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function StickyAddToCartBar({
  product,
  variant,
  quantity,
  setQuantity,
  onAdd,
  disabled,
  isLoading,
}: Props) {
  const { translate, language } = useLanguageStore();
  const [open, setOpen] = useState(false);

  const {
    selectedVariant,
    availableColors,
    variants,
    selectColor,
    selectSize,
  } = variant;

  if (!selectedVariant) return null;

  const selectedColor = availableColors.find(
    (c) => c.id === selectedVariant.colorId,
  );

  const selectionLabel = `${selectedColor?.label ?? ""} / ${
    selectedVariant.size?.key.toUpperCase() ?? ""
  }`;

  /* --------------------------------
   * ALL VALID COLOR/SIZE PAIRS
   -------------------------------- */
  const variantOptions = variants
    .filter((v) => v.color && v.size)
    .map((v) => ({
      id: v.id,
      color: v.color!,
      size: v.size!,
      stock: v.stock,
    }));

  const handleSelect = (colorId: string, sizeId: string) => {
    selectColor(colorId);
    selectSize(sizeId);
    setOpen(false);
  };
  const variantImage =
    product.images.find(
      (img) => img.colorId === selectedVariant.colorId && img.isPrimary,
    ) ||
    product.images.find((img) => img.colorId === selectedVariant.colorId) ||
    product.images[0];
  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="fixed bottom-0 inset-x-0 bg-primary border-t border-primary/10 px-4 py-3 shadow-xl z-100">
      <div className="max-w-6xl mx-auto flex items-center gap-3 md:gap-6">
        {/* LEFT: IMAGE + INFO (desktop only) */}
        <div className="hidden md:flex items-center gap-4 min-w-0">
          {product.images.length && (
            <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-secondary/20 shrink-0">
              <Image
                src={variantImage.url}
                fill
                className="object-cover"
                alt={localizeField(product, "title", language)}
                sizes="56px"
              />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary truncate">
              {localizeField(product, "title", language)}
            </p>
            <p className="text-xs text-secondary truncate">{selectionLabel}</p>
          </div>
        </div>

        {/* DROPUP SELECTOR */}
        <div className="flex-1 md:flex-none relative min-w-45 max-w-50">
          <button
            onClick={() => setOpen(!open)}
            className="w-full  flex items-center justify-between gap-3 px-4 py-3 rounded-sm border border-primary/20 bg-secondary/20 hover:bg-secondary/30 transition-colors text-sm font-medium text-primary"
          >
            <span className="truncate">{selectionLabel}</span>
            {open ? (
              <ChevronUp
                className="w-4 h-4 text-secondary shrink-0"
                strokeWidth={1.5}
              />
            ) : (
              <ChevronDown
                className="w-4 h-4 text-secondary shrink-0"
                strokeWidth={1.5}
              />
            )}
          </button>

          {/* DROPUP MENU - Positioned above the button */}
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop - only on mobile */}
                <div
                  className="md:hidden fixed inset-0 bg-black/40 -z-10"
                  onClick={() => setOpen(false)}
                />

                {/* Dropdown List */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full max-h-75  left-0 right-0  bg-primary border border-primary/10 rounded-t-sm shadow-2xl overflow-hidden  overflow-y-auto"
                >
                  <div className="p-2">
                    {variantOptions.map((v) => {
                      const isSelected =
                        v.color.id === selectedVariant.colorId &&
                        v.size.id === selectedVariant.sizeId;

                      return (
                        <button
                          key={v.id}
                          disabled={v.stock === 0}
                          onClick={() => handleSelect(v.color.id, v.size.id)}
                          className={`w-full flex items-start justify-start px-2 py-2.5 rounded-lg transition-colors ${
                            isSelected
                              ? "bg-(--color-bg-accent)/20"
                              : "bg-transparent"
                          } ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-primary capitalize">
                              {v.color.label} / {v.size.key.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* QUANTITY (desktop only) */}
        <div className="hidden md:block shrink-0">
          <ProductQuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </div>

        {/* ADD TO CART */}
        <button
          onClick={onAdd}
          disabled={disabled}
          title={translate("cart.actions.add")}
          aria-label={translate("cart.actions.add")}
          className="w-30 md:w-60 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            translate("cart.actions.add")
          )}
        </button>
      </div>
    </div>
  );
}
