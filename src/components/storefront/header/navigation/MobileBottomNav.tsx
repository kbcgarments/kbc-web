"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User, Heart } from "lucide-react";
import {
  useAuthStore,
  useCartStore,
  useUIStore,
  useWishlistStore,
  useLanguageStore,
} from "@/stores";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { translate } = useLanguageStore();
  const { items: cartItems } = useCartStore();
  const { openCart } = useUIStore();
  const wishlistItemCount = useWishlistStore((s) => s.itemCount());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isActive = (path: string) => pathname === path;
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-primary border-t border-primary shadow-header">
      <div className="grid grid-cols-4 h-16 px-2">
        {/* Home */}
        <Link
          href="/"
          title={translate("navigation.primary.home")}
          className={`flex flex-col items-center justify-center gap-1 py-2 transition-theme ${
            isActive("/") ? "text-accent" : "text-secondary"
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium truncate w-full text-center px-1">
            {translate("navigation.primary.home")}
          </span>
        </Link>

        {/* Cart */}
        <button
          title={translate("cart.title")}
          aria-label={translate("cart.title")}
          onClick={openCart}
          className="flex flex-col items-center justify-center gap-1 py-2 text-secondary transition-theme relative"
        >
          <ShoppingBag className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium truncate w-full text-center px-1">
            {translate("cart.title")}
          </span>
          {cartItemCount > 0 && (
            <span className="absolute top-1 right-1/4 w-5 h-5 bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center">
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          aria-label={translate("wishlist.title")}
          title={translate("wishlist.title")}
          className="flex flex-col items-center justify-center gap-1 py-2 text-secondary transition-theme relative"
        >
          <Heart className="w-5 h-5 text-primary shrink-0" />
          <span className="text-xs font-medium truncate w-full text-center px-1">
            {translate("wishlist.title")}
          </span>
          {wishlistItemCount > 0 && (
            <span className="absolute top-1 right-1/4 w-5 h-5 bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center">
              {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
            </span>
          )}
        </Link>

        {/* Account */}
        <Link
          title={translate("navigation.account.account")}
          aria-label={translate("navigation.account.account")}
          href={isAuthenticated ? "/account/me" : "/account/login"}
          className={`flex flex-col items-center justify-center gap-1 py-2 transition-theme ${
            isActive("/account/me") || isActive("/account/login")
              ? "text-accent"
              : "text-secondary"
          }`}
        >
          <User className="w-5 h-5 shrink-0" />
          <span className="text-xs font-medium truncate w-full text-center px-1">
            {translate("navigation.account.account")}
          </span>
        </Link>
      </div>
    </nav>
  );
}
