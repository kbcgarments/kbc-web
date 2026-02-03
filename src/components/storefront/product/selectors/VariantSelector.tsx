"use client";

import { Product } from "@/types";
import { ProductSizeSelector } from "./ProductSizeSelector";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductColorSwatches } from "./ProductColorSwatches";
import { useProductVariant } from "@/hooks";
import { useLanguageStore } from "@/stores";
import { useMemo } from "react";
export type ProductVariantState = ReturnType<typeof useProductVariant>;
type VariantSelectorProps = {
  product: Product;
  quantity: number;
  isInfoSection?: boolean;
  align?: "left" | "right" | "center";
  setQuantity: (quantity: number) => void;
  setIsSizeChartModalOpen?: (isOpen: boolean) => void;
  variant: ProductVariantState;
};

export default function VariantSelector({
  product,
  quantity,
  isInfoSection = false,
  align = "left",
  setQuantity,
  setIsSizeChartModalOpen = () => false,
  variant,
}: VariantSelectorProps) {
  const {
    selectedVariant,
    selectedColorId,
    availableColors,
    availableSizes,
    selectColor,
    selectSize,
  } = variant;
  const { translate } = useLanguageStore();
  const stockMessage = useMemo(() => {
    if (!selectedVariant) return null;

    if (selectedVariant.stock === 0) {
      return translate("product.stock.outOfStock");
    }

    if (selectedVariant.stock <= 10) {
      return translate("product.stock.lowStock").replace(
        "{{count}}",
        String(selectedVariant.stock),
      );
    }

    return translate("product.stock.inStockReady");
  }, [selectedVariant, translate]);
  if (!selectedVariant) return null;

  return (
    <div
      className={`space-y-6 mb-4 flex flex-col items-${align === "left" ? "start" : align === "right" ? "end" : "center"}`}
    >
      {isInfoSection && stockMessage && (
        <p
          className={`
      flex items-center gap-2 text-sm
      ${
        selectedVariant.stock === 0
          ? "text-red-600 dark:text-red-400"
          : selectedVariant.stock <= 10
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-green-600 dark:text-green-400"
      }
    `}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {stockMessage}
        </p>
      )}

      {/* COLOR SELECT */}
      <ProductColorSwatches
        images={product.images}
        colors={availableColors}
        selectedColorId={selectedColorId}
        onColorSelect={selectColor}
        size="lg"
      />

      {/* SIZE + SIZE CHART */}
      <div
        className={`w-full flex items-start  ${isInfoSection ? "justify-between" : "justify-center"} gap-6`}
      >
        <ProductSizeSelector
          align={align}
          sizes={availableSizes}
          selectedSizeId={selectedVariant.sizeId ?? null}
          onSizeSelect={selectSize}
        />
        {isInfoSection && (
          <button
            type="button"
            onClick={() => setIsSizeChartModalOpen(true)}
            className="text-sm underline whitespace-nowrap text-secondary hover:text-primary transition-colors"
          >
            {translate("product.sizeChart.title")}
          </button>
        )}
      </div>

      {/* QUANTITY */}
      <ProductQuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        size="lg"
      />
    </div>
  );
}
