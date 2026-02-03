"use client";

import { ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import AccentButton from "../../../ui/buttons/AccentButton";
import { Product } from "@/types";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useAddToCart, useGetProduct, useProductVariant } from "@/hooks";
import VariantSelector from "../selectors/VariantSelector";

interface QuickAddToCartModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickAddToCartModal({
  product,
  onClose,
}: QuickAddToCartModalProps) {
  const { language, translate } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const { data: fullProduct, isLoading } = useGetProduct(product?.id);
  const variant = useProductVariant(fullProduct ?? null);
  if (isLoading || !fullProduct || !variant.selectedVariant) {
    return null;
  }
  // Move all hooks BEFORE the early return
  const title = product ? localizeField(product, "title", language) : "";

  const handleAddToCart = () => {
    addToCart.mutate(
      {
        productId: product.id,
        variantId: variant?.selectedVariant!.id,
        quantity,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* MODAL */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="
            relative w-full max-w-md 
            bg-primary dark:bg-sand-900 
            rounded-2xl shadow-2xl 
            p-8
          "
        >
          {/* Close Button */}
          <button
            title={translate("common.close")}
            onClick={onClose}
            className="
              absolute right-4 top-4 
              p-2 rounded-full
              bg-(--text-primary)
              transition-all duration-300
              hover:scale-110 active:scale-95
              shadow-md hover:shadow-2xl hover:rotate-45
            "
          >
            <X className="w-5 h-5 text-primary" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold text-center mb-2 text-primary pr-8">
            {title}
          </h2>

          {/* Price */}
          <p className="text-xl text-center font-semibold text-accent dark:text-accent-light mb-8">
            {formatPrice(product.priceUSD)}
          </p>
          <VariantSelector
            product={fullProduct}
            quantity={quantity}
            align="center"
            setQuantity={setQuantity}
            variant={variant}
          />

          {/* Add to Cart Button */}
          <AccentButton
            onClick={handleAddToCart}
            loading={addToCart.isPending}
            icon={<ShoppingBag className="w-5 h-5" />}
            text={translate("cart.actions.add")}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
