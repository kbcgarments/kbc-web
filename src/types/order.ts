import { Cart } from "./cart";
import { Product } from "./product";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  REFUNDED = "REFUNDED",
  DELIVERY_FAILED = "DELIVERY_FAILED",
  DELIVERY_DELAYED = "DELIVERY_DELAYED",
}
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}
export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  message?: string | null;

  createdByAdminId?: string | null;
  createdAt: string;
}
export interface OrderItem {
  id: string;
  orderId: string;

  productId: string;
  variantId?: string | null;

  quantity: number;
  priceUSD: number;
  priceLocal: number;

  product: Product;
  imageUrl: string | null;
  variant: {
    colorId?: string | null;
    sizeId?: string | null;
    color?: {
      id: string;
      key: string;
      label: string;
      hex: string;
    };
    size?: {
      id: string;
      key: string;
      label: string;
      order: number;
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  flwId: string | null;
  /* ---------------- CUSTOMER ---------------- */
  customerId?: string | null;
  cartId?: string | null;
  cart: Cart | null;
  email: string;
  phone?: string | null;
  shippingAmount: number;
  totalAmount: number;
  subtotalAmount: number;
  totalAmountUSD: number;
  subtotalAmountUSD: number;
  shippingAmountUSD: number;
  exchangeRate: number;
  exchangeRateToUSD: number;
  /* ---------------- SHIPPING ---------------- */
  shippingAddressId?: string | null;

  shippingFullName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string | null;
  shippingPostal?: string | null;
  shippingCountry: string;

  /* ---------------- PAYMENT ---------------- */
  currency: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentProvider?: string | null;
  paymentIntentId?: string | null;

  /* ---------------- RELATIONS ---------------- */
  items: OrderItem[];
  orderTimelines: OrderTimeline[];
  statusHistory?: OrderStatusHistory[];
  receiptUrl?: string | null;

  /* ---------------- META ---------------- */
  createdAt: string;
  updatedAt: string;
  cancelledAt?: Date | null;
  paidAt?: Date | null;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postal?: string;
  country: string;
}
export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CheckoutResponse {
  order: Order;
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
  };
}

export interface NormalizedOrder extends Order {
  _ui: {
    previewImage: string;
    itemCount: number;
  };
}

export interface UpdateOrderShippingPayload {
  orderId: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingPostal?: string;
  shippingCountry: string;
  note?: string;
}
export interface OrderPayload {
  email: string;
  phone?: string;
  currency: string;

  shippingFullName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingPostal?: string;
  shippingCountry: string;
  saveAddress?: boolean;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
  expectedShipDate?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  trackingLink?: string;
  outForDeliveryTime?: string;
  deliveredDate?: string;
  deliveredTime?: string;

  failureReason?: string;
  nextAttemptDate?: string;
  delayReason?: string;
  newDeliveryDate?: string;
  cancelledBy?: CancellationSource;
  cancellationReason?: string;
  refundMessage?: string;
  refundAmount?: number;
}

export enum CancellationSource {
  Customer = "CUSTOMER",
  Admin = "ADMIN",
}
