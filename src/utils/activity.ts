import { ActivityType } from "@/types";

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  PRODUCT_CREATED: "Product created",
  PRODUCT_UPDATED: "Product updated",
  PRODUCT_ARCHIVED: "Product archived",
  PRODUCT_RESTORED: "Product restored",
  PRODUCT_HARD_DELETED: "Product permanently deleted",

  CATEGORY_CREATED: "Category created",
  CATEGORY_UPDATED: "Category updated",
  CATEGORY_DELETED: "Category deleted",

  CURRENCY_RATE_CREATED: "Currency rate created",
  CURRENCY_RATE_UPDATED: "Currency rate updated",

  ADMIN_CREATED: "Admin account created",
};

export function formatActor(actor?: { name?: string; email?: string }) {
  if (!actor) return "System";
  return actor.name || actor.email || "Unknown admin";
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
