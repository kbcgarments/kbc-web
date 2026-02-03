"use client";

import { useLanguageStore } from "@/stores";
import { ProductSize } from "@/types";

interface ProductSizeSelectorProps {
  sizes: ProductSize[];
  align?: "left" | "right" | "center";
  selectedSizeId: string | null;
  onSizeSelect: (sizeId: string) => void;
}

export function ProductSizeSelector({
  sizes,
  align = "left",
  selectedSizeId,
  onSizeSelect,
}: ProductSizeSelectorProps) {
  const { translate } = useLanguageStore();

  if (!sizes.length) return null;

  return (
    <div
      className={`${align === "left" ? "w-full" : align === "right" ? "items-end" : ""} flex flex-col space-y-3`}
    >
      <p className="text-xs tracking-widest text-primary font-medium capitalize text-left">
        {translate("product.labels.size")}:{" "}
        <span className="font-semibold">
          {sizes.find((s) => s.id === selectedSizeId)?.key.toUpperCase() ||
            translate("product.labels.size")}
        </span>
      </p>

      <div className="flex flex-wrap gap-2 items-center md:items-start">
        {sizes.map((size) => {
          const isSelected = selectedSizeId === size.id;

          return (
            <button
              key={size.id}
              onClick={() => onSizeSelect(size.id)}
              title={`${translate("product.labels.size")} ${size.key.toUpperCase()}`}
              className={`
                h-10 w-10 rounded-full  font-medium uppercase
                transition-all duration-200 ease-out ring-1 ring-current text-xs
                ${
                  isSelected
                    ? "bg-accent text-white  shadow-sm"
                    : "bg-sand-100 text-primary"
                }
              `}
            >
              {size.key.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
