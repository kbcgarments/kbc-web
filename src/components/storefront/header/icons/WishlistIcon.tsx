"use client";

import { Heart } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useWishlistStore } from "@/stores";
import { cn } from "@/utils";
import Link from "next/link";

interface WishlistIconProps {
  isTransparent?: boolean;
  className?: string;
}

export function WishlistIcon({
  isTransparent = false,
  className,
}: WishlistIconProps) {
  const { translate } = useLanguageStore();
  const items = useWishlistStore((s) => s.items);
  const itemCount = items.length;

  const iconColorClass = isTransparent ? "text-white" : "text-primary";

  return (
    <Link
      href="/wishlist"
      aria-label={translate("wishlist.title")}
      className={`relative p-2 hover:bg-secondary/50 rounded-md transition-all duration-200 group
        ${className}
      )`}
    >
      <Heart
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
    </Link>
  );
}
