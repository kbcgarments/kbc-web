import type { Order } from "@/types";
import type { NormalizedOrder } from "@/types";

export function normalizeOrder(order: Order): NormalizedOrder {
  const firstItem = order.items?.[0];

  const previewImage =
    firstItem?.imageUrl ??
    firstItem?.product?.images?.[0]?.url ??
    "/assets/placeholder.jpg";

  return {
    ...order,
    _ui: {
      previewImage,
      itemCount: order.items?.length ?? 0,
    },
  };
}
