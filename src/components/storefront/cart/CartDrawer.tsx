"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import {
  useUpdateCartItem,
  useRemoveCartItem,
  useLockBodyScroll,
} from "@/hooks";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useCartStore, useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";
import { ProductQuantitySelector } from "@/components/storefront/product/selectors/ProductQuantitySelector";
import AccentButton from "@/components/ui/buttons/AccentButton";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useLockBodyScroll(open);
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { formatPrice } = useCurrencyStore();
  const { translate, language } = useLanguageStore();

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.priceUSD * item.quantity,
        0,
      ),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />
      {/* DRAWER */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-primary z-50 shadow-2xl px-4
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between py-4 border-b border-primary/50">
            <h2 className="text-lg font-bold text-primary">
              {translate("cart.shoppingTitle")} ({itemCount})
            </h2>
            <button
              title={translate("common.close")}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary shadow-md hover:shadow-2xl hover:rotate-45 transition-all duration-300"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* EMPTY STATE */}
          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {translate("cart.empty.title")}
              </h3>
              <p className="text-sm text-secondary mb-6 max-w-xs">
                {translate("cart.empty.description")}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-accent text-white  rounded-full font-semibold hover:bg-accent-dark transition-all"
              >
                {translate("cart.actions.continueShopping")}
              </button>
            </div>
          )}

          {/* ITEMS */}
          {items.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => {
                    const { product, variant } = item;
                    const selectedColor = variant.color;
                    const selectedSize = variant.size;
                    const title = localizeField(product, "title", language);
                    const colorImage =
                      product.images.find(
                        (img) =>
                          img.colorId === variant.colorId && img.isPrimary,
                      ) ||
                      product.images.find(
                        (img) => img.colorId === variant.colorId,
                      ) ||
                      product.images[0];

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border-b border-gray-400/30 last:border-0"
                      >
                        {/* IMAGE */}
                        <Link
                          href={`/product/${product.id}`}
                          onClick={onClose}
                          title={title}
                          className="relative w-20 h-30 shrink-0 overflow-hidden rounded-lg bg-secondary group"
                        >
                          <Image
                            src={colorImage?.url || "/assetsplaceholder.jpg"}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="100px"
                          />
                        </Link>
                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">
                          {/* TITLE */}
                          <Link
                            href={`/product/${product.id}`}
                            onClick={onClose}
                            title={title}
                            className="block text-sm font-bold text-primary hover:text-accent transition-colors line-clamp-2 leading-tight mb-1"
                          >
                            {title}
                          </Link>

                          {/* COLOR & SIZE */}
                          <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                            {selectedColor && (
                              <>
                                <span>
                                  {translate("common.color")}:{" "}
                                  {selectedColor.label}
                                </span>
                                <span>•</span>
                              </>
                            )}
                            {selectedSize && (
                              <span>
                                {translate("common.size")}:{" "}
                                {selectedSize?.key.toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* PRICE */}
                          <p className="text-base font-bold text-accent mb-3">
                            {formatPrice(product.priceUSD * item.quantity)}
                          </p>

                          {/* QUANTITY & REMOVE */}
                          <div className="flex items-center justify-between">
                            <ProductQuantitySelector
                              quantity={item.quantity}
                              min={1}
                              max={variant.stock}
                              onQuantityChange={(q) =>
                                updateItem.mutate({
                                  itemId: item.id,
                                  quantity: q,
                                })
                              }
                            />

                            <button
                              title={translate("cart.actions.remove")}
                              aria-label={translate("cart.actions.remove")}
                              onClick={() => removeItem.mutate(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-danger/10 text-secondary hover:text-danger transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER */}
              <div className="py-4 bg-secondary/2 border-t border-gray-400/30">
                <div className="flex items-center justify-between text-sm pb-4">
                  <span>{translate("cart.labels.subtotal")} </span>
                  <span className="font-bold text-accent text-xl">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {/* CHECKOUT BUTTON */}
                <div className="space-y-4">
                  <AccentButton
                    text={translate("cart.actions.checkout")}
                    onClick={() => {
                      router.push("/checkout");
                      onClose();
                    }}
                  />
                  <PrimaryButton
                    text={translate("cart.actions.viewCart")}
                    onClick={() => {
                      onClose();
                      router.push("/cart");
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
