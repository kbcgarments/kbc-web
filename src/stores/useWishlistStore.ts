import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  isOpen: boolean;

  // Selectors
  hasItem: (productId: string) => boolean;
  itemCount: () => number;

  // Mutators
  setItems: (items: Product[]) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  resetWishlist: () => void;

  // Drawer controls
  openWishlist: () => void;
  closeWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      itemCount: () => get().items.length,

      hasItem: (productId) => get().items.some((p) => p.id === productId),

      setItems: (items) => set({ items }),

      addItem: (product) =>
        set((s) => ({
          items: s.items.some((p) => p.id === product.id)
            ? s.items
            : [...s.items, product],
        })),

      removeItem: (productId) =>
        set((s) => ({
          items: s.items.filter((p) => p.id !== productId),
        })),

      resetWishlist: () => set({ items: [] }),

      openWishlist: () => {
        set({ isOpen: true });
        if (typeof document !== "undefined") {
          document.body.style.overflow = "hidden";
        }
      },

      closeWishlist: () => {
        set({ isOpen: false });
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      },
    }),
    {
      name: "kbc-wishlist",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
