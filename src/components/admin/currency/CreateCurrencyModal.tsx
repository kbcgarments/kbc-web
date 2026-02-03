"use client";

import { useState } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { useCreateCurrencyRates } from "@/hooks";
import { CURRENCY_OPTIONS } from "@/constants";

/* ======================================================
   CONSTANTS
====================================================== */

/* ======================================================
   COMPONENT
====================================================== */

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateCurrencyModal({ open, onClose }: Props) {
  const createRate = useCreateCurrencyRates();

  const [currency, setCurrency] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const reset = () => {
    setCurrency("");
    setRate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedRate = Number(rate);
    if (!currency || !Number.isFinite(parsedRate) || parsedRate <= 0) {
      return;
    }

    try {
      await createRate.mutateAsync({
        currency,
        rate: parsedRate,
      });

      reset();
      onClose();
    } catch {
      // handled in hook
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-primary shadow-2xl border border-primary/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
          <h2 className="text-lg font-semibold text-primary">
            Add Currency Rate
          </h2>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 hover:bg-secondary/30 transition"
          >
            <X className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Currency */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Currency
            </label>

            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                className="
                  w-full appearance-none rounded-lg
                  border border-primary/20
                  bg-secondary/20
                  px-4 py-3 pr-10
                  text-primary
                  focus:outline-none focus:ring-2 focus:ring-accent
                "
              >
                <option value="" disabled>
                  Select currency
                </option>
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary" />
            </div>
          </div>

          {/* Rate */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
              Rate (relative to 1 USD)
            </label>

            <input
              type="number"
              min="0"
              step="0.0001"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.92"
              className="
                w-full rounded-lg
                border border-primary/20
                bg-secondary/20
                px-4 py-3
                text-primary
                focus:outline-none focus:ring-2 focus:ring-accent
              "
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-primary/20 px-6 py-3 text-secondary hover:bg-secondary/30 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createRate.isPending}
              className="
                flex-1 rounded-lg bg-accent px-6 py-3
                font-semibold text-white
                hover:bg-accent-dark
                transition disabled:opacity-50
                flex items-center justify-center gap-2
              "
            >
              {createRate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Rate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
