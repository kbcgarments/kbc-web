/* ============================================
   CURRENCY
============================================ */

export type Currency = "USD" | "NGN" | "ZAR" | "GBP" | "EUR";

export interface CurrencyRate {
  id: string;
  currency: Currency;
  rate: number;
  updatedAt: string;
}

/**
 * Backend returns CurrencyRate[]
 */
export type CurrencyRates = CurrencyRate[];
