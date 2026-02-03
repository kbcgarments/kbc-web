"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useUIStore } from "@/stores";
import { cn } from "@/utils";

interface CartIconProps {
  isTransparent?: boolean;
  className?: string;
}

export function CartIcon({ isTransparent = false, className }: CartIconProps) {
  const { items } = useCartStore();
  const openCart = useUIStore((state) => state.openCart);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const iconColorClass = isTransparent ? "text-white" : "text-primary";

  return (
    <button
      onClick={openCart}
      className={`relative p-2 hover:bg-secondary/50 rounded-md transition-all duration-200 group
        ${className}
      )`}
      aria-label="Cart"
    >
      <ShoppingBag
        className={cn(
          "w-5 h-5 transition-colors duration-200 group-hover:text-accent",
          iconColorClass,
        )}
      />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
