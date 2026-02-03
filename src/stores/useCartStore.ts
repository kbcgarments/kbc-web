import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  id?: string;
  items: CartItem[];
  isOpen: boolean;

  hasItem: (productId: string, variantId: string) => boolean;
  getItem: (productId: string, variantId: string) => CartItem | undefined;

  // Mutators
  setCart: (id: string, items: CartItem[]) => void;
  setItems: (items: CartItem[]) => void;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  resetCart: () => void;

  // Computed
  itemCount: () => number;
  cartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      hasItem: (productId, variantId) =>
        get().items.some(
          (i) => i.productId === productId && i.variantId === variantId,
        ),

      getItem: (productId, variantId) =>
        get().items.find(
          (i) => i.productId === productId && i.variantId === variantId,
        ),

      setCart: (id, items) => set({ id, items }),
      setItems: (items) => set({ items }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      clearCart: () => set({ items: [] }),

      resetCart: () =>
        set({
          id: undefined,
          items: [],
        }),

      itemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      cartTotal: () =>
        get().items.reduce(
          (total, item) => total + item.quantity * item.product.priceUSD,
          0,
        ),
    }),
    {
      name: "kbc-cart",
      partialize: (state) => ({
        items: state.items,
        id: state.id,
      }),
    },
  ),
);
