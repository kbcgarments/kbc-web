"use client";

import Link from "next/link";
import Image from "next/image";
import { Visa, Mastercard, Amex, Paypal } from "react-pay-icons";
import { Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useCartStore, useLanguageStore } from "@/stores";
import { useUpdateCartItem, useRemoveCartItem } from "@/hooks";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { localizeField } from "@/utils";
import EmptyState from "@/components/ui/layout/EmptyState";
import { ProductQuantitySelector } from "../product/selectors";

export default function CartItemsClient() {
  const { items, cartTotal } = useCartStore();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { formatPrice } = useCurrencyStore();
  const { language, translate } = useLanguageStore();

  const [orderNotes, setOrderNotes] = useState("");

  return (
    <>
      {/* EMPTY STATE */}
      {items.length === 0 && (
        <EmptyState
          icon={ShoppingBag}
          title={translate("cart.empty.title")}
          description={translate("cart.empty.description")}
          ctaLabel={translate("cart.actions.startShopping")}
          ctaHref="/collections"
        />
      )}
      {/* CART CONTENT */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT – ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {/* HEADER - Desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-3  bg-secondary rounded-sm">
              <div className="col-span-5 text-sm font-bold text-secondary uppercase tracking-wider">
                {translate("cart.labels.product") || "Product"}
              </div>
              <div className="col-span-3 text-sm font-bold text-secondary uppercase tracking-wider text-center">
                {translate("cart.labels.quantity") || "Quantity"}
              </div>
              <div className="col-span-3 text-sm font-bold text-secondary uppercase tracking-wider text-right">
                {translate("cart.labels.total")}
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* ITEMS */}
            <div className="space-y-3">
              {items.map((item) => {
                const { product, variant } = item;
                const selectedColor = variant.color;
                const selectedSize = variant.size;
                const title = localizeField(product, "title", language);
                const colorImage =
                  product.images.find(
                    (img) => img.colorId === variant.colorId && img.isPrimary,
                  ) ||
                  product.images.find(
                    (img) => img.colorId === variant.colorId,
                  ) ||
                  product.images[0];

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-4  border-b border-gray-300 last:border-0"
                  >
                    {/* PRODUCT */}
                    <div className="md:col-span-5 flex gap-3 md:gap-4">
                      <Link
                        href={`/product/${product.id}`}
                        className="relative w-20 h-24 md:w-24 md:h-28 shrink-0 overflow-hidden rounded-md bg-tertiary"
                      >
                        <Image
                          src={colorImage?.url || "/placeholder.jpg"}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          className="block text-sm md:text-base font-bold text-primary hover:text-accent line-clamp-2 mb-1"
                        >
                          {title}
                        </Link>
                        <p className="text-sm text-accent font-bold mb-2">
                          {formatPrice(product.priceUSD)}
                        </p>
                        <div className="text-xs text-secondary space-y-0.5">
                          {selectedColor && (
                            <div>Color: {selectedColor.label}</div>
                          )}
                          <div>Size: {selectedSize?.key.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                    {/* QUANTITY - Desktop */}
                    <div className="hidden md:flex md:col-span-3 items-center justify-center">
                      <ProductQuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(q) =>
                          updateItem.mutate({ itemId: item.id, quantity: q })
                        }
                      />
                    </div>
                    {/* TOTAL - Desktop */}
                    <div className="hidden md:flex md:col-span-3 items-center justify-end">
                      <p className="text-lg font-bold text-accent">
                        {formatPrice(product.priceUSD * item.quantity)}
                      </p>
                    </div>
                    {/* REMOVE - Desktop */}
                    <div className="hidden md:flex md:col-span-1 items-center justify-end">
                      <button
                        onClick={() => removeItem.mutate(item.id)}
                        title="Remove"
                        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-danger/10 text-secondary hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* QUANTITY + TOTAL + REMOVE - Mobile */}
                    <div className="md:hidden flex items-center justify-between pt-3 border-t border-primary/20">
                      <ProductQuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={(q) =>
                          updateItem.mutate({ itemId: item.id, quantity: q })
                        }
                      />
                      <p className="text-base font-bold text-accent">
                        {formatPrice(product.priceUSD * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem.mutate(item.id)}
                        title="Remove"
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-danger/10 text-secondary hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT – SUMMARY */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4 bg-secondary rounded-md my-8 md:my-0">
            {/* ORDER NOTES */}
            <div className=" rounded-lg p-4">
              <h3 className="text-base font-bold text-primary mb-3">
                {translate("cart.notes.form.label")}
              </h3>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={translate("cart.notes.form.placeholder")}
                className="w-full h-24 px-3 py-2 bg-transparent border border-primary rounded-md text-sm text-primary placeholder:text-primary blur:text-primary focus:primary resize-none focus:outline-none focus:ring-1 focus:ring-(--color-text-accent)/50 transition-all duration 500"
              />
            </div>

            {/* TOTAL */}
            <div className=" rounded-lg p-4">
              <h3 className="text-lg font-bold text-primary mb-4">
                {translate("cart.labels.total")}
              </h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary">
                    {translate("cart.labels.shipping")}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {translate("cart.notes.shippingCalculated")}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-300">
                  <span className="text-secondary">
                    {translate("cart.labels.tax") || "Tax"}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {translate("cart.notes.shippingCalculated")}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-base font-bold text-primary">
                    {translate("cart.labels.subtotal")}
                  </span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(cartTotal())}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center w-full py-3.5 bg-accent text-white rounded-md text-sm font-bold hover:bg-accent-dark uppercase"
                >
                  {translate("cart.actions.checkout")}
                </Link>
                <Link
                  href="/collections"
                  className="flex items-center justify-center w-full py-3 bg-primary border-2 border-accent text-accent rounded-md text-sm font-bold hover:bg-accent hover:text-white uppercase"
                >
                  {translate("cart.actions.continueShopping")}
                </Link>
              </div>

              {/* PAYMENT ICONS */}
              <div className="mt-5 pt-5 border-t border-gray-300 flex items-center justify-center gap-2 opacity-60">
                <Visa className="w-10 h-10 text-primary" />
                <Mastercard className="w-10 h-10 text-primary" />
                <Amex className="w-10 h-10 text-primary" />
                <Paypal className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
