import { OrderStatus } from "@/types";

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PACKED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  OUT_FOR_DELIVERY:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  PAYMENT_FAILED:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  REFUNDED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  DELIVERY_FAILED:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  DELIVERY_DELAYED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

export const ALL_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PACKED,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
  OrderStatus.PAYMENT_FAILED,
  OrderStatus.REFUNDED,
  OrderStatus.DELIVERY_FAILED,
  OrderStatus.DELIVERY_DELAYED,
];

export const DEFAULT_STATUS_NOTES: Record<OrderStatus, string> = {
  PENDING: "Your order has been received and is awaiting payment confirmation.",
  CONFIRMED:
    "Your payment has been confirmed and your order is now being processed.",
  PACKED: "Your order has been carefully packed and is ready for shipment.",
  SHIPPED:
    "Your order has been shipped. Please keep an eye out for delivery updates.",
  OUT_FOR_DELIVERY: "Your order is out for delivery and will arrive very soon.",
  DELIVERED:
    "Your order has been successfully delivered. We hope you enjoy it. Thank you for shopping with us!",
  CANCELLED:
    "This order has been cancelled. If you have questions, please contact support.",
  PAYMENT_FAILED:
    "Payment could not be processed. Please try again or contact support.",
  REFUNDED:
    "Your refund has been processed and will appear in your account within 5-7 business days.",
  DELIVERY_FAILED:
    "Delivery attempt was unsuccessful. We'll try again or contact you for alternate arrangements.",
  DELIVERY_DELAYED:
    "Your delivery has been delayed due to unforeseen circumstances. We apologize for the inconvenience.",
};
