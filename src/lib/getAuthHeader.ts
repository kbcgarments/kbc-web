export function getAuthHeader() {
  const admin = localStorage.getItem("kbc_admin_token");
  const customer = localStorage.getItem("kbc_customer_token");

  if (admin) return `Bearer ${admin}`;
  if (customer) return `Bearer ${customer}`;
  return undefined;
}
