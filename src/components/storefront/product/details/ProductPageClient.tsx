/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import {
  useCurrencyStore,
  useLanguageStore,
  useToastStore,
  useWishlistStore,
} from "@/stores";

import {
  useAddToCart,
  useToggleWishlist,
  useProductVariant,
  useHomepageFeaturedProducts,
} from "@/hooks";

import { Product, ProductContentSection } from "@/types";
import { localizeField } from "@/utils";

import AnimatedWishlistIcon from "@/components/ui/buttons/AnimatedWishlistIcon";
import AccentButton from "@/components/ui/buttons/AccentButton";
import BreadCrumb from "@/components/ui/layout/BreadCrumb";
import StickyAddToCartBar from "../misc/StickyAddToCartBar";
import SizeChartModal from "../misc/SizeChartModal";

import ProductGallery from "../media/ProductGallery";
import ProductTabs from "./ProductTabs";
import RecommendedProducts from "../misc/RecommendedProducts";
import VariantSelector from "../selectors/VariantSelector";

import { Share2, ShoppingBag } from "lucide-react";

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  /* ======================================================
     STORES & HOOKS
  ====================================================== */
  const { language, translate } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { error, success } = useToastStore();
  const { data: recommendedProductsData, isLoading: isRecommendedLoading } =
    useHomepageFeaturedProducts();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useWishlistStore((s) => s.hasItem(product.id));
  const [imageIndex, setImageIndex] = useState(0);
  const variant = useProductVariant(product);
  const { selectedVariant } = variant;
  /* ======================================================
     MEMOIZED VALUES
  ====================================================== */
  const title = useMemo(
    () => localizeField(product as any, "title", language),
    [product, language],
  );

  const description = useMemo(
    () => localizeField(product as any, "description", language),
    [product, language],
  );

  const recommendedProducts = useMemo(() => {
    return Array.isArray(recommendedProductsData)
      ? recommendedProductsData.slice(0, 8)
      : [];
  }, [recommendedProductsData]);

  /* ======================================================
     STATE
  ====================================================== */
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);

  useEffect(() => {
    if (!variant.selectedColorId) return;

    const firstIndexForColor = product.images.findIndex(
      (img) => img.colorId === variant.selectedColorId,
    );

    if (firstIndexForColor !== -1) {
      setImageIndex(firstIndexForColor);
    }
  }, [variant.selectedColorId, product.images]);

  const handleGalleryIndexChange = (index: number) => {
    setImageIndex(index);

    const img = product.images[index];
    if (img?.colorId && img.colorId !== variant.selectedColorId) {
      variant.selectColor(img.colorId);
    }
  };
  /* ======================================================
     STICKY BAR ON SCROLL
  ====================================================== */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyBar(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ======================================================
     HANDLERS (MEMOIZED)
  ====================================================== */
  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) {
      error(translate("product.selectColorAndSize"));
      return;
    }

    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    });
  }, [selectedVariant, quantity, product.id, addToCart, error, translate]);

  const handleToggleWishlist = useCallback(() => {
    toggleWishlist.mutate(product);
  }, [product, toggleWishlist]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        success("Link copied to clipboard!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Could not copy link";
        error(errorMessage);
      }
    }
  }, [title, description, success, error]);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <>
      {/* PAGE WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* BREADCRUMB */}
        <BreadCrumb
          items={[
            { label: translate("navigation.primary.home"), href: "/" },
            { label: title, href: "" },
          ]}
        />

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* IMAGES */}
          <ProductGallery
            images={product.images}
            index={imageIndex}
            onIndexChange={handleGalleryIndexChange}
          />

          {/* PRODUCT INFO */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                {title}
              </h1>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-accent">
                  {formatPrice(product.priceUSD)}
                </p>
                {/* Add discount price if you have it */}
              </div>
            </div>

            {/* Description */}
            <p className="text-secondary leading-relaxed">{description}</p>

            {/* Divider */}
            <div className="border-t border-primary/10" />

            {/* VARIANTS */}
            <VariantSelector
              isInfoSection
              product={product}
              quantity={quantity}
              variant={variant}
              setQuantity={setQuantity}
              setIsSizeChartModalOpen={setIsSizeChartModalOpen}
            />

            {/* Divider */}
            <div className="border-t border-primary/10" />

            {/* ADD TO CART */}
            <div className="space-y-4">
              <AccentButton
                icon={<ShoppingBag className="w-5 h-5 text-white" />}
                onClick={handleAddToCart}
                text={translate("cart.actions.add")}
                disabled={!selectedVariant || addToCart.isPending}
                loading={addToCart.isPending}
              />

              {/* Action Buttons Row */}
              <div className="flex items-center gap-4">
                {/* Wishlist */}
                <button
                  title={
                    isInWishlist
                      ? translate("wishlist.actions.remove")
                      : translate("wishlist.actions.add")
                  }
                  onClick={handleToggleWishlist}
                  disabled={toggleWishlist.isPending}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-secondary/50 transition-all disabled:opacity-50 hover:scale-105 duration-300 ${isInWishlist ? "border-(--color-text-accent) text-accent" : "border-primary/20"}`}
                >
                  <AnimatedWishlistIcon isInWishlist={isInWishlist} />
                  <span className="text-sm font-medium">
                    {isInWishlist
                      ? translate("wishlist.actions.remove")
                      : translate("wishlist.actions.add")}
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="px-4 py-3 border border-primary/20 rounded-lg hover:bg-secondary/50 transition-all"
                  title="Share product"
                >
                  <Share2
                    className="w-5 h-5 text-secondary"
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-16 lg:mt-24">
          <ProductTabs
            sections={product.productContentSections as ProductContentSection[]}
          />
        </div>

        {/* RECOMMENDED */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <RecommendedProducts
              products={recommendedProducts as Product[]}
              isLoading={isRecommendedLoading}
            />
          </div>
        )}
      </div>

      {/* STICKY BAR */}
      {showStickyBar && (
        <StickyAddToCartBar
          product={product}
          variant={variant}
          quantity={quantity}
          setQuantity={setQuantity}
          onAdd={handleAddToCart}
          disabled={addToCart.isPending || variant.selectedVariant?.stock === 0}
          isLoading={addToCart.isPending}
        />
      )}

      {/* SIZE CHART MODAL */}
      {isSizeChartModalOpen && (
        <SizeChartModal
          isSizeChartModalOpen={isSizeChartModalOpen}
          onClose={() => setIsSizeChartModalOpen(false)}
        />
      )}
    </>
  );
}
