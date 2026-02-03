import { ShippingInfo } from "./order";

export type CheckoutStep = "address" | "payment" | "review";

export interface CheckoutState {
  email: string;
  phone: string;
  shipping: ShippingInfo;
  selectedAddressId?: string;
  saveAddress: boolean;
}
