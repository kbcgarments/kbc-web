"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import ImageCarousel from "@/components/ui/media/ImageCarousel";
import { localizeField } from "@/utils";
import { useToggleWishlist } from "@/hooks";
import AnimatedWishlistIcon from "@/components/ui/buttons/AnimatedWishlistIcon";
import { Product } from "@/types";
import Link from "next/link";
import {
  useCurrencyStore,
  useLanguageStore,
  useUIStore,
  useWishlistStore,
} from "@/stores";

export default function ProductListCard({ product }: { product: Product }) {
  const { language, translate } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const title = localizeField(product, "title", language);
  const description = localizeField(product, "description", language);

  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useWishlistStore((state) => state.hasItem(product.id));

  const openQuickView = useUIStore((s) => s.openQuickView);
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  const images = product.images ?? [];
  const mainImage = images[0];

  return (
    <div className="w-full border-b border-primary pb-10">
      {/* ------- MOBILE CAROUSEL ------- */}
      <div className="md:hidden mb-4">
        <ImageCarousel images={images} />
      </div>
      {/* ------- DESKTOP TWO-COLUMN ------- */}
      <div className="hidden md:flex gap-8">
        {/* LEFT: MAIN IMAGE */}
        <div className="w-65 shrink-0">
          {mainImage && (
            <div className="relative w-full h-82.5 rounded-lg overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={mainImage.url}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    (max-width: 1280px) 33vw,
                    25vw
                  "
                />
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS + ACTIONS */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-xl font-semibold text-primary leading-tight">
              {title}
            </h2>

            <p className="text-accent font-semibold mt-2 text-lg">
              {formatPrice(product.priceUSD)}
            </p>

            <p className="text-sm text-secondary mt-3 max-w-[90%] leading-relaxed line-clamp-3">
              {description || translate("product.noDescription")}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 mt-6">
            {/* QUICK SHOP (→ QuickAdd global modal) */}
            <button
              title={translate("product.actions.quickShop")}
              className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium cursor-pointer"
              onClick={() => openQuickAdd(product)}
            >
              {translate("product.actions.quickShop")}
            </button>

            {/* WISHLIST */}
            <button
              title={
                isInWishlist
                  ? translate("wishlist.actions.remove")
                  : translate("wishlist.actions.add")
              }
              onClick={() => toggleWishlist.mutate(product)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm hover:bg-secondary transition cursor-pointer
                ${isInWishlist ? "border-accent text-accent" : "border-primary"}
              `}
            >
              <AnimatedWishlistIcon isInWishlist={isInWishlist} />
              {isInWishlist
                ? translate("wishlist.actions.remove")
                : translate("wishlist.actions.add")}
            </button>

            {/* QUICK VIEW */}
            <button
              title={translate("product.view")}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm hover:bg-secondary transition cursor-pointer"
              onClick={() => openQuickView(product)}
            >
              <Eye className="w-4 h-4" />
              {translate("product.actions.quickView")}
            </button>
          </div>
        </div>
      </div>
      {/* ------- MOBILE CONTENT BELOW CAROUSEL ------- */}
      <div className="md:hidden">
        <h2 className="text-lg font-semibold text-primary leading-tight">
          {title}
        </h2>

        <p className="text-accent font-semibold mt-1 text-base">
          {formatPrice(product.priceUSD)}
        </p>

        <p className="text-sm text-secondary mt-3 leading-relaxed line-clamp-3">
          {description || translate("product.tabs.description")}
        </p>

        <div className="flex items-center gap-3 mt-5">
          {/* QUICK SHOP */}
          <button
            title={translate("product.actions.quickShop")}
            className="flex-1 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium"
            onClick={() => openQuickAdd(product)}
          >
            {translate("product.actions.quickShop")}
          </button>

          {/* WISHLIST */}
          <button
            title={
              isInWishlist
                ? translate("wishlist.actions.remove")
                : translate("wishlist.actions.add")
            }
            onClick={() => toggleWishlist.mutate(product)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm hover:bg-secondary transition 
              ${isInWishlist ? "border-accent text-accent" : "border-primary"}
            `}
          >
            <AnimatedWishlistIcon isInWishlist={isInWishlist} />
          </button>

          {/* QUICK VIEW */}
          <button
            title={translate("product.view")}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm hover:bg-secondary transition"
            onClick={() => openQuickView(product)}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
