import type { Metadata } from "next";
import { CurrencyListClient } from "@/components/admin/currency/CurrencyListClient";

export const metadata: Metadata = {
  title: "Currency Rates | Admin",
  description: "Manage currency exchange rates",
};

export default function CurrencyPage() {
  return <CurrencyListClient />;
}
