"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Currency } from "@/types";
import { ChevronDown } from "lucide-react";

const currencies: Array<{ code: Currency; name: string; symbol: string }> = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

export function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currency, setCurrency } = useCurrencyStore();
  const { translate } = useLanguageStore();
  const currentCurrency = currencies.find((curr) => curr.code === currency);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCurrencyChange = (code: Currency) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        title={translate("common.currency")}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-theme"
        aria-label={translate("common.currency")}
        aria-expanded={isOpen}
      >
        <span className="font-medium">{currentCurrency?.code}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-primary border border-primary rounded-md shadow-lg z-50 overflow-hidden">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              title={translate("common.currency")}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary transition-theme ${
                curr.code === currency
                  ? "bg-tertiary text-accent"
                  : "text-primary"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="font-medium">{curr.symbol}</span>
                <span>{curr.code}</span>
              </span>
              <span className="text-xs text-secondary">{curr.name}</span>
              {curr.code === currency && (
                <span className="ml-2 text-accent">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
