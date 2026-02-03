import { Currency } from "@/types";

export const getOrderCurrency = (currency: Currency) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "NGN":
      return "₦";
    case "ZAR":
      return "R";
    default:
      return currency;
  }
};
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
) {
  return template.replace(/{{(\w+)}}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : "",
  );
}
