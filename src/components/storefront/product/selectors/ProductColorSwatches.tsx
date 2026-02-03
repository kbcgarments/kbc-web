"use client";

import Image from "next/image";
import { ProductColor, ProductImage } from "@/types";
import { useLanguageStore } from "@/stores";

interface ProductColorSwatchesProps {
  images: ProductImage[];
  colors: ProductColor[];
  selectedColorId: string | null;
  onColorSelect: (colorId: string) => void;

  mode?: "image" | "color";
  description?: boolean;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
}

export function ProductColorSwatches({
  images,
  colors = [],
  selectedColorId,
  onColorSelect,
  mode = "image",
  description = true,
  maxDisplay = 3,
  size = "sm",
}: ProductColorSwatchesProps) {
  const { translate } = useLanguageStore();

  const imageColorIds = new Set(
    images.map((img) => img.colorId).filter(Boolean),
  );

  const displayColors = colors.filter((c) => imageColorIds.has(c.id));
  if (displayColors.length === 0) return null;

  // In image mode: show all colors
  // In color mode: respect maxDisplay limit (default 3)
  const effectiveMaxDisplay =
    mode === "image" ? displayColors.length : maxDisplay;
  const hasMore = displayColors.length > effectiveMaxDisplay;
  const remainingCount = displayColors.length - effectiveMaxDisplay;

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  const selectedColorLabel =
    displayColors.find((c) => c.id === selectedColorId)?.label ??
    translate("product.labels.color");

  return (
    <div className="flex flex-col gap-2">
      {description && (
        <p className="text-xs tracking-widest font-medium capitalize text-secondary">
          {translate("product.labels.color")}:{" "}
          <span className="font-semibold text-primary">
            {selectedColorLabel}
          </span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {displayColors.slice(0, effectiveMaxDisplay).map((color) => {
          const isSelected = selectedColorId === color.id;

          const previewImage =
            images.find((img) => img.colorId === color.id) ?? null;

          // Ensure hex has # prefix
          const colorHex = color.hex?.startsWith("#")
            ? color.hex
            : `#${color.hex}`;

          return (
            <button
              key={color.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onColorSelect(color.id);
              }}
              title={`Select ${color.label}`}
              aria-label={`Select ${color.label}`}
              className={`
                ${sizeClasses[size]}
                overflow-hidden
                transition-all duration-300 
                flex items-center justify-center
                ${isSelected ? "ring-2 ring-accent scale-110" : "ring-2 ring-primary/20 hover:ring-accent/50"}
                ${mode === "image" ? "rounded-lg" : "rounded-full"}
              `}
            >
              {/* IMAGE MODE */}
              {mode === "image" && previewImage?.url && (
                <Image
                  src={previewImage.url}
                  alt={color.label}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  sizes="300px"
                />
              )}
              {/* COLOR MODE */}
              {mode === "color" && (
                <div
                  className="w-full h-full max-h-5 max-w-5 rounded-full"
                  style={{ backgroundColor: colorHex }}
                />
              )}
            </button>
          );
        })}
        {mode === "color" && hasMore && (
          <span className="text-xs font-medium text-secondary">
            {remainingCount}+
          </span>
        )}
      </div>
    </div>
  );
}
