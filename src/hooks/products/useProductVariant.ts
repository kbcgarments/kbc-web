/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/types";

export function useProductVariant(product: Product | null) {
  /**
   * NORMALIZE VARIANTS
   */
  const variants: ProductVariant[] = useMemo(() => {
    return Array.isArray(product?.variants) ? product!.variants : [];
  }, [product]);

  /**
   * SINGLE SOURCE OF TRUTH
   */
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  /**
   * INITIAL VARIANT
   * – first available variant with stock
   */
  useEffect(() => {
    if (!product) return;
    if (selectedVariant) return;
    if (!variants.length) return;

    // Try to find first variant with stock
    const firstAvailable = variants.find((v) => v.stock > 0) || variants[0];
    setSelectedVariant(firstAvailable);
  }, [product, variants, selectedVariant]);

  /**
   * DERIVED: COLOR & SIZE
   */
  const selectedColorId = selectedVariant?.colorId ?? null;
  const selectedSizeId = selectedVariant?.sizeId ?? null;

  /**
   * VARIANTS FOR SELECTED COLOR ONLY
   */
  const variantsForColor = useMemo(() => {
    if (!selectedColorId) return [];
    return variants.filter((v) => v.colorId === selectedColorId);
  }, [variants, selectedColorId]);

  /**
   * AVAILABLE SIZES (FOR CURRENT COLOR ONLY)
   * Returns only sizes that exist for the selected color
   */
  const availableSizes = useMemo(() => {
    const sizeMap = new Map<string, NonNullable<ProductVariant["size"]>>();

    for (const v of variantsForColor) {
      if (v.size) {
        sizeMap.set(v.size.id, v.size);
      }
    }

    return Array.from(sizeMap.values()).sort((a, b) => a.order - b.order);
  }, [variantsForColor]);

  /**
   * ALL AVAILABLE COLORS
   * Unique colors across all variants
   */
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, NonNullable<ProductVariant["color"]>>();

    for (const v of variants) {
      if (v.color) {
        colorMap.set(v.color.id, v.color);
      }
    }

    return Array.from(colorMap.values());
  }, [variants]);

  /**
   * COLOR CHANGE
   * – auto-pick first valid size for that color
   * – prefer the same size if available in new color
   */
  const selectColor = (colorId: string) => {
    const variantsForNewColor = variants.filter((v) => v.colorId === colorId);

    if (!variantsForNewColor.length) return;

    // Try to keep the same size if available in new color
    let nextVariant = variantsForNewColor.find(
      (v) => v.sizeId === selectedSizeId,
    );

    // If same size not available, pick first available size
    if (!nextVariant) {
      nextVariant =
        variantsForNewColor.find((v) => v.stock > 0) || variantsForNewColor[0];
    }

    setSelectedVariant(nextVariant);
  };

  /**
   * SIZE CHANGE
   * – only for current color
   */
  const selectSize = (sizeId: string) => {
    const nextVariant = variantsForColor.find((v) => v.sizeId === sizeId);
    if (nextVariant) setSelectedVariant(nextVariant);
  };

  /**
   * CHECK IF SIZE IS AVAILABLE FOR CURRENT COLOR
   */
  const isSizeAvailable = (sizeId: string) => {
    return variantsForColor.some((v) => v.sizeId === sizeId);
  };

  /**
   * CHECK IF SIZE HAS STOCK FOR CURRENT COLOR
   */
  const isSizeInStock = (sizeId: string) => {
    const variant = variantsForColor.find((v) => v.sizeId === sizeId);
    return variant ? variant.stock > 0 : false;
  };

  /**
   * COLOR-AWARE IMAGES
   */
  const imagesForColor = useMemo(() => {
    if (!product) return [];
    if (!selectedColorId) return product.images ?? [];

    const filtered = product.images?.filter(
      (img) => img.colorId === selectedColorId,
    );

    return filtered?.length ? filtered : (product.images ?? []);
  }, [product, selectedColorId]);

  return {
    /** state */
    selectedVariant,
    selectedColorId,
    selectedSizeId,

    /** derived */
    variants,
    variantsForColor,
    availableSizes,
    availableColors,
    imagesForColor,

    /** helpers */
    isSizeAvailable,
    isSizeInStock,

    /** actions */
    setSelectedVariant,
    selectColor,
    selectSize,
  };
}
