"use client";

import { useUIStore } from "@/stores";
import { QuickAddToCartModal } from "@/components/storefront/product/actions/QuickAddToCartModal";
import CollectionMobileFilters from "@/components/storefront/collections/filters/CollectionMobileFilters";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import { ProductQuickView } from "@/components/storefront/product/actions/ProductQuickView";
import { useGetCategories } from "@/hooks";
import { useMemo } from "react";
import OrderDetailsDrawer from "@/components/storefront/account/order/OrderDetailsDrawer";

export default function GlobalUI() {
  const {
    cartOpen,
    mobileFiltersOpen,
    quickViewProduct,
    quickAddProduct,
    orderDetailsOrderId,
    closeCart,
    closeFilters,
    closeQuickView,
    closeQuickAdd,
    closeOrderDetails,
  } = useUIStore();
  const { data } = useGetCategories();
  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  return (
    <>
      {/* CART DRAWER */}
      <CartDrawer open={cartOpen} onClose={closeCart} />

      {/* ORDER DETAILS DRAWER */}
      {orderDetailsOrderId && (
        <OrderDetailsDrawer
          open={Boolean(orderDetailsOrderId)}
          orderId={orderDetailsOrderId}
          onClose={closeOrderDetails}
        />
      )}
      {/* MOBILE FILTER DRAWER */}
      <CollectionMobileFilters
        categories={categories}
        open={mobileFiltersOpen}
        onClose={closeFilters}
      />

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={closeQuickView} />
      )}

      {/* QUICK ADD */}
      {quickAddProduct && (
        <QuickAddToCartModal
          product={quickAddProduct}
          onClose={closeQuickAdd}
        />
      )}
    </>
  );
}
