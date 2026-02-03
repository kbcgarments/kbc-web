"use client";

import { create } from "zustand";
import type { Product } from "@/types";

interface UIState {
  // drawers
  cartOpen: boolean;
  orderDetailsOrderId: string | null;
  mobileFiltersOpen: boolean;

  // modals
  quickViewProduct: Product | null;
  quickAddProduct: Product | null;

  // actions
  openCart: () => void;
  closeCart: () => void;

  openOrderDetails: (orderId: string) => void;
  closeOrderDetails: () => void;

  openFilters: () => void;
  closeFilters: () => void;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  orderDetailsOrderId: null,
  mobileFiltersOpen: false,
  quickViewProduct: null,
  quickAddProduct: null,

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  openOrderDetails: (orderId) => set({ orderDetailsOrderId: orderId }),
  closeOrderDetails: () => set({ orderDetailsOrderId: null }),

  openFilters: () => set({ mobileFiltersOpen: true }),
  closeFilters: () => set({ mobileFiltersOpen: false }),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  openQuickAdd: (product) => set({ quickAddProduct: product }),
  closeQuickAdd: () => set({ quickAddProduct: null }),
}));
