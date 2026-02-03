export function resolveAuthSuccess(
  action: "register" | "login" | "logout" | "forgotPassword" | "resetPassword",
) {
  switch (action) {
    case "register":
      return "auth.success.registered";
    case "login":
      return "auth.success.loggedIn";
    case "logout":
      return "auth.success.loggedOut";
    case "forgotPassword":
      return "auth.success.resetSent";
    case "resetPassword":
      return "auth.success.passwordReset";
  }
}

export function resolveCartSuccess(
  action: "add" | "update" | "remove" | "clear",
  quantity?: number,
) {
  switch (action) {
    case "add":
      return quantity ? "cart.success.added" : "cart.success.addedSingle";
    case "update":
      return "cart.success.quantityUpdated";
    case "remove":
      return "cart.success.removed";
    case "clear":
      return "cart.success.cleared";
  }
}

export function resolveWishlistSuccess(
  action: "add" | "remove" | "clear" | "toggle",
) {
  switch (action) {
    case "add":
      return "wishlist.success.added";
    case "remove":
      return "wishlist.success.removed";
    case "clear":
      return "wishlist.success.cleared";
    case "toggle":
      return "wishlist.success.updated";
  }
}

export function resolveOrderSuccess(action: "checkout" | "shippingUpdate") {
  switch (action) {
    case "checkout":
      return "order.success.created";
    case "shippingUpdate":
      return "order.success.shippingUpdated";
  }
}

export function resolveAddressSuccess(
  action: "create" | "update" | "delete" | "setDefault",
) {
  switch (action) {
    case "create":
      return "address.success.created";
    case "update":
      return "address.success.updated";
    case "delete":
      return "address.success.deleted";
    case "setDefault":
      return "address.success.setDefault";
  }
}

export function resolveProfileSuccess(action: "update" | "deactivate") {
  switch (action) {
    case "update":
      return "profile.success.updated";
    case "deactivate":
      return "profile.success.deactivated";
  }
}
