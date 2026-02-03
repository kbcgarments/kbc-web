"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";

import { Product, ProductImage } from "@/types";
import { useCurrencyStore, useLanguageStore, useWishlistStore } from "@/stores";
import { useToastStore } from "@/stores/useToastStore";
import {
  useAddToCart,
  useToggleWishlist,
  useProductVariant,
  useGetProduct,
} from "@/hooks";

import { localizeField } from "@/utils";

import AccentButton from "@/components/ui/buttons/AccentButton";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import AnimatedWishlistIcon from "@/components/ui/buttons/AnimatedWishlistIcon";
import VariantSelector from "../selectors/VariantSelector";

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { language, translate } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { error } = useToastStore();
  const { data: fullProduct, isLoading } = useGetProduct(product.id);
  const variant = useProductVariant(fullProduct ?? null);

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useWishlistStore((s) => s.hasItem(product.id));

  /** --------------------------------
   * VARIANT STATE (SINGLE SOURCE OF TRUTH)
   -------------------------------- */
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  if (isLoading || !fullProduct || !variant.selectedVariant) {
    return null;
  }
  /** --------------------------------
   * COPY
   -------------------------------- */
  const title = localizeField(product, "title", language);
  const description = localizeField(product, "description", language);

  /** --------------------------------
   * ACTIONS
   -------------------------------- */
  const handleAddToCart = () => {
    addToCart.mutate(
      {
        productId: product.id,
        variantId: variant?.selectedVariant!.id,
        quantity,
      },
      {
        onSuccess: onClose,
        onError: () => error("Failed to add to cart"),
      },
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative bg-primary rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE */}
          <button
            title="Close"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary shadow-md hover:shadow-2xl hover:rotate-45 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
            {/* IMAGES */}
            <div className="relative overflow-hidden rounded-xl">
              <motion.div
                className="flex"
                drag="x"
                dragElastic={0.15}
                animate={{ x: `-${imageIndex * 100}%` }}
                onDragEnd={(_, info) => {
                  if (
                    info.offset.x < -50 &&
                    imageIndex < variant.imagesForColor.length - 1
                  )
                    setImageIndex((i) => i + 1);
                  if (info.offset.x > 50 && imageIndex > 0)
                    setImageIndex((i) => i - 1);
                }}
              >
                {variant.imagesForColor.map((img: ProductImage) => (
                  <div key={img.id} className="relative min-w-full z-100 h-140">
                    <Image
                      src={img.url}
                      alt={title}
                      fill
                      className="object-cover rounded-md"
                      sizes="300px"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* DETAILS */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{title}</h2>

              <p className="text-2xl font-semibold text-accent">
                {formatPrice(product.priceUSD)}
              </p>

              <p className="text-sm opacity-80">{description}</p>
              <VariantSelector
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                variant={variant}
                align="left"
              />
              <div className="actions space-y-4">
                {/* ACTIONS */}
                <AccentButton
                  icon={<ShoppingBag className="w-5 h-5" />}
                  onClick={handleAddToCart}
                  loading={addToCart.isPending}
                  text={translate("cart.actions.add")}
                />

                <PrimaryButton
                  onClick={() => toggleWishlist.mutate(product)}
                  icon={<AnimatedWishlistIcon isInWishlist={isInWishlist} />}
                  className={`${isInWishlist ? "text-accent" : "text-primary"}`}
                  text={
                    isInWishlist
                      ? translate("wishlist.actions.remove")
                      : translate("wishlist.actions.add")
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
