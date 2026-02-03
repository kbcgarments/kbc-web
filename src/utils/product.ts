import type { ProductVariant } from "@/types";

export type StockStatus = "inStockReady" | "lowStock" | "outOfStock";

export function formatPrice(value: number | string): string {
  if (value === null || value === undefined) return "0";

  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) return "0";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function getStockStatus(variant: ProductVariant): StockStatus {
  if (variant.stock === 0) return "outOfStock";
  if (variant.stock <= 10) return "lowStock";
  return "inStockReady";
}
