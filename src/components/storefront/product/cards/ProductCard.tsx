/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { localizeField } from "@/utils";
import { useRouter } from "next/navigation";
import { useLanguageStore, useCurrencyStore } from "@/stores";
import { ProductColorSwatches } from "../selectors/ProductColorSwatches";
import { ProductImageOverlay } from "../actions/ProductImageOverlay";
import { useGetProductAvailableColors } from "@/hooks";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { data: availableColors = [] } = useGetProductAvailableColors(
    product.id,
  );
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [swipeIndex, setSwipeIndex] = useState(0);

  const { formatPrice } = useCurrencyStore();
  const language = useLanguageStore((s) => s.language);

  const title = localizeField(product, "title", language);

  /* --------------------------------
   * PREFETCH (ONCE)
   -------------------------------- */
  useEffect(() => {
    router.prefetch(`/product/${product.id}`);
  }, [router, product.id]);

  /* --------------------------------
   * COLOR-AWARE IMAGES
   -------------------------------- */
  const imagesForColor = useMemo(() => {
    if (!selectedColorId) return product.images;

    const filtered = product.images.filter(
      (img) => img.colorId === selectedColorId,
    );

    return filtered.length ? filtered : product.images;
  }, [product.images, selectedColorId]);

  const primary = imagesForColor[0];
  const secondary = imagesForColor[1] ?? primary;

  /* --------------------------------
   * UPDATE COLOR BASED ON SWIPE
   -------------------------------- */
  useEffect(() => {
    if (swipeIndex >= 0 && swipeIndex < imagesForColor.length) {
      const currentImage = imagesForColor[swipeIndex];
      if (currentImage?.colorId && currentImage.colorId !== selectedColorId) {
        setSelectedColorId(currentImage.colorId);
      }
    }
  }, [swipeIndex, imagesForColor, selectedColorId]);

  /* --------------------------------
   * RENDER
   -------------------------------- */
  return (
    <motion.div
      className="group relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* IMAGE SECTION */}
      <motion.div
        role="button"
        aria-label={`View details for ${title}`}
        className="relative aspect-3/4 mb-3 md:mb-4 rounded-xl overflow-hidden 
                   bg-sand-100 dark:bg-sand-800 shadow-md cursor-pointer"
        onClick={() => router.push(`/product/${product.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6 }}
      >
        {/* MOBILE SWIPE - FIXED VERSION */}
        <div className="relative w-full h-full md:hidden overflow-hidden">
          <div className="absolute inset-0 md:hidden">
            <Image
              src={primary.url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw"
            />
          </div>
        </div>

        {/* DESKTOP HOVER IMAGE SWAP */}
        {primary && (
          <div className="absolute inset-0 hidden md:block">
            <Image
              src={isHovered ? secondary.url : primary.url}
              alt={title}
              fill
              priority
              className={`
                object-cover transition-all duration-700
                ${isHovered ? "scale-105" : "scale-100"}
              `}
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                (max-width: 1280px) 33vw,
                25vw"
            />
          </div>
        )}

        {/* OVERLAY ACTIONS */}
        <ProductImageOverlay product={product} isVisible={isHovered} />
      </motion.div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-col items-center px-1">
        <h3
          className="text-sm md:text-base font-light text-primary dark:text-sand-50 
                       line-clamp-2 text-center leading-tight"
        >
          {title}
        </h3>

        <p className="text-base md:text-lg font-medium text-accent mb-3 md:mb-4">
          {formatPrice(product.priceUSD)}
        </p>

        <ProductColorSwatches
          images={product.images}
          mode="color"
          colors={availableColors}
          selectedColorId={selectedColorId}
          onColorSelect={(colorId) => {
            setSelectedColorId(colorId);
            setSwipeIndex(0);
          }}
          description={false}
          size="sm"
        />
      </div>
    </motion.div>
  );
}
export default memo(ProductCard);
