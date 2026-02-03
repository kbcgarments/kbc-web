import { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;

  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  id: string;
  cartToken?: string;
  customerId?: string;
  deviceId?: string;
  items: CartItem[];

  createdAt: string;
  updatedAt: string;
}
