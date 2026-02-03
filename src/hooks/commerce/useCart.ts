"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Cart, Product } from "@/types";
import {
  useCartStore,
  useLanguageStore,
  useToastStore,
  useWishlistStore,
} from "@/stores";
import {
  interpretCartError,
  resolveCartSuccess,
  useMutationHelpers,
} from "@/lib";

/* -----------------------------------------------------------------------------
   CART LIFECYCLE — initializes cart ONCE and fetches it afterwards
----------------------------------------------------------------------------- */
export function useGetCart() {
  const setCart = useCartStore((s) => s.setCart);

  return useQuery<Cart>({
    queryKey: ["cart"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const cart = await apiClient.get<Cart>("/cart");
      setCart(cart.id, cart.items ?? []);
      return cart;
    },
  });
}

/* -----------------------------------------------------------------------------
   ADD ITEM TO CART — optimistic update
----------------------------------------------------------------------------- */
export function useAddToCart() {
  const { setItems: setCartItems, openCart } = useCartStore();
  const setWishlistItems = useWishlistStore((s) => s.setItems);
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: {
      productId: string;
      variantId: string;
      quantity: number;
    }) => apiClient.post<Cart>("/cart/items", payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);
      const previousWishlist =
        queryClient.getQueryData<Product[]>(["wishlist"]) ?? [];
      let wasExisting = false;
      /* ---------------- CART OPTIMISTIC ---------------- */

      if (previousCart) {
        const existingIndex = previousCart.items.findIndex(
          (it) =>
            it.productId === payload.productId &&
            it.variantId === payload.variantId,
        );
        wasExisting = existingIndex > -1;

        const updatedItems =
          existingIndex > -1
            ? previousCart.items.map((item, idx) =>
                idx === existingIndex
                  ? { ...item, quantity: item.quantity + payload.quantity }
                  : item,
              )
            : previousCart.items;

        queryClient.setQueryData<Cart>(["cart"], {
          ...previousCart,
          items: updatedItems,
        });

        setCartItems(updatedItems);
      }

      /* ---------------- WISHLIST OPTIMISTIC ---------------- */

      const updatedWishlist = previousWishlist.filter(
        (p) => p.id !== payload.productId,
      );

      queryClient.setQueryData(["wishlist"], updatedWishlist);
      setWishlistItems(updatedWishlist);

      return { previousCart, previousWishlist, wasExisting };
    },

    onSuccess: (serverCart, vars, ctx) => {
      queryClient.setQueryData(["cart"], serverCart);
      setCartItems(serverCart.items);

      const key = resolveCartSuccess(
        ctx?.wasExisting ? "update" : "add",
        vars.quantity,
      );
      const { translate } = useLanguageStore.getState();
      success(translate(key));

      openCart();
    },

    onError: (err: unknown, _vars, ctx) => {
      if (ctx?.previousCart) {
        queryClient.setQueryData(["cart"], ctx.previousCart);
        setCartItems(ctx.previousCart.items);
      }

      if (ctx?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], ctx.previousWishlist);
        setWishlistItems(ctx.previousWishlist);
      }

      const { translate } = useLanguageStore.getState();
      error(translate(interpretCartError(err)));
    },
  });
}

/* -----------------------------------------------------------------------------
   UPDATE QUANTITY — optimistic update
----------------------------------------------------------------------------- */
export function useUpdateCartItem() {
  const { setItems } = useCartStore();
  const { translate } = useLanguageStore.getState();
  const { queryClient, error } = useMutationHelpers();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiClient.patch(`/cart/items/${itemId}`, { quantity }),

    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData<Cart>(["cart"]);

      if (previous) {
        const updatedItems = previous.items.map((it) =>
          it.id === itemId ? { ...it, quantity } : it,
        );

        queryClient.setQueryData<Cart>(["cart"], {
          ...previous,
          items: updatedItems,
        });

        setItems(updatedItems);
      }

      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["cart"], ctx.previous);
        setItems(ctx.previous.items);
      }

      error(translate(interpretCartError(err)));
    },
  });
}

/* -----------------------------------------------------------------------------
   REMOVE ITEM — optimistic update
----------------------------------------------------------------------------- */
export function useRemoveCartItem() {
  const { setItems } = useCartStore();
  const { translate } = useLanguageStore.getState();
  const { error } = useToastStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData<Cart>(["cart"]);

      if (previous) {
        const updatedItems = previous.items.filter((i) => i.id !== itemId);

        queryClient.setQueryData<Cart>(["cart"], {
          ...previous,
          items: updatedItems,
        });

        setItems(updatedItems);
      }

      return { previous };
    },

    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["cart"], ctx.previous);
        setItems(ctx.previous.items);
      }
      error(translate(interpretCartError(err)));
    },
  });
}
/* -----------------------------------------------------------------------------
   CLEAR CART (ALL ITEMS)
----------------------------------------------------------------------------- */
export function useClearCart() {
  const { setItems } = useCartStore();
  const { translate } = useLanguageStore.getState();
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: () => apiClient.delete("/cart"),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previous = queryClient.getQueryData<Cart>(["cart"]);

      if (previous) {
        queryClient.setQueryData<Cart>(["cart"], {
          ...previous,
          items: [],
        });
        setItems([]);
      }

      return { previous: previous as Cart };
    },
    onSuccess: () => {
      const { translate } = useLanguageStore.getState();
      success(translate(resolveCartSuccess("clear")));
    },
    onError: (err: Error, _vars, ctx?: { previous: Cart }) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["cart"], ctx.previous);
        setItems(ctx.previous.items);
      }
      error(translate(interpretCartError(err)));
    },
  });
}
