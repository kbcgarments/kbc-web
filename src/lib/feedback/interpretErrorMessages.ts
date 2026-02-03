import { AxiosError } from "axios";

export function interpretCartError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "cart.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 400 && message.includes("stock")) {
    return "cart.errors.stockLimit";
  }

  if (status === 400 && message.includes("variant")) {
    return "cart.errors.invalidVariant";
  }

  if (status === 401) {
    return "auth.errors.notAuthenticated";
  }

  if (status === 409) {
    return "cart.errors.conflict";
  }

  return "cart.errors.generic";
}

export function interpretWishlistError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "wishlist.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 401) {
    return "auth.errors.notAuthenticated";
  }

  if (message.includes("not found")) {
    return "wishlist.errors.notFound";
  }

  return "wishlist.errors.generic";
}

export function interpretOrderError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "order.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 400 && message.includes("cart")) {
    return "order.errors.invalidCart";
  }

  if (status === 401) {
    return "auth.errors.notAuthenticated";
  }

  if (status === 404) {
    return "order.errors.notFound";
  }

  if (status === 409) {
    return "order.errors.outOfStock";
  }

  return "order.errors.generic";
}

export function interpretAuthError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "auth.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 400 && message.includes("password")) {
    return "auth.errors.invalidPassword";
  }

  if (status === 400 && message.includes("email")) {
    return "auth.errors.invalidEmail";
  }

  if (status === 401) {
    return "auth.errors.invalidCredentials";
  }

  if (status === 404) {
    return "auth.errors.notFound";
  }

  return "auth.errors.generic";
}

export function interpretAddressError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "address.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 400 && message.includes("phone")) {
    return "address.errors.invalidPhone";
  }

  if (status === 400 && message.includes("postal")) {
    return "address.errors.invalidPostalCode";
  }

  if (status === 404) {
    return "address.errors.notFound";
  }

  return "address.errors.generic";
}

export function interpretProfileError(error: unknown): string {
  if (!(error instanceof AxiosError)) {
    return "profile.errors.generic";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message?.toLowerCase?.() ?? "";

  if (status === 400 && message.includes("email")) {
    return "profile.errors.invalidEmail";
  }

  if (status === 400 && message.includes("phone")) {
    return "profile.errors.invalidPhone";
  }

  if (status === 401) {
    return "auth.errors.notAuthenticated";
  }

  return "profile.errors.generic";
}
