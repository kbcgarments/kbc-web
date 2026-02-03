import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Currency, CurrencyRate } from "@/types";

const SYMBOL_MAP: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  ZAR: "R",
};

interface CurrencyStore {
  currency: Currency;
  rates: CurrencyRate[];

  setCurrency: (currency: Currency) => void;
  setRates: (rates: CurrencyRate[]) => void;

  getRate: () => CurrencyRate;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
  getCurrencySymbol: () => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: "USD",
      rates: [],

      setCurrency: (currency) => set({ currency }),
      setRates: (rates) => set({ rates }),

      getRate: () => {
        const { rates, currency } = get();

        return (
          rates.find((r) => r.currency === currency) ?? {
            id: "USD",
            currency: "USD",
            rate: 1,
            updatedAt: "",
          }
        );
      },

      /* Convert priceUSD → selected currency */
      convertPrice: (priceUSD) => {
        const rate = get().getRate();
        return priceUSD * (rate?.rate ?? 1);
      },

      /* Format with symbol + commas */
      formatPrice: (priceUSD) => {
        const converted = get().convertPrice(priceUSD);
        const symbol = get().getCurrencySymbol();

        const formatted = converted
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${symbol}${formatted}`;
      },

      getCurrencySymbol: () => {
        return SYMBOL_MAP[get().currency] ?? "$";
      },
    }),
    {
      name: "kbc-currency",
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
);
