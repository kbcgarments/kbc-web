import type { Product, Language, ProductImage } from "@/types";

/* --------------------------------------------
   TRANSLATIONS
--------------------------------------------- */
export function getProductTitle(product: Product, language: Language): string {
  const key = `title_${language}` as keyof Product;
  return (product[key] as string) || product.title_en || "Untitled Product";
}

export function getProductDescription(
  product: Product,
  language: Language,
): string {
  const key = `description_${language}` as keyof Product;
  return (product[key] as string) || product.description_en || "";
}

/* --------------------------------------------
   ROUTING
--------------------------------------------- */
export function getProductRoute(productId: string): string {
  return `/product/${productId}`;
}

/* --------------------------------------------
   IMAGES
--------------------------------------------- */
export function getPrimaryImage(
  product: Product,
  colorId?: string | null,
): ProductImage | undefined {
  if (!product.images?.length) return undefined;

  if (colorId) {
    const colorImages = product.images.filter((img) => img.colorId === colorId);

    return colorImages.find((img) => img.isPrimary) || colorImages[0];
  }

  return product.images.find((img) => img.isPrimary) || product.images[0];
}

/* --------------------------------------------
   VARIANTS
--------------------------------------------- */
export function getAvailableColorIds(product: Product): string[] {
  if (!product.variants?.length) return [];

  const colors = new Set<string>();

  product.variants.forEach((v) => {
    if (v.colorId) colors.add(v.colorId);
  });

  return Array.from(colors);
}

export function getVariantStock(
  product: Product,
  colorId: string | null,
  sizeId: string | null,
): number {
  if (!product.variants?.length) return 0;

  const variant = product.variants.find(
    (v) => v.colorId === colorId && v.sizeId === sizeId,
  );

  return variant?.stock ?? 0;
}

export function isProductInStock(product: Product): boolean {
  return product.variants?.some((v) => v.stock > 0) ?? false;
}

/* --------------------------------------------
   PRICE
--------------------------------------------- */
export function formatPrice(
  priceUSD: number,
  currencyRate: number,
  currencySymbol: string,
): string {
  const value = priceUSD * currencyRate;

  return (
    currencySymbol + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
