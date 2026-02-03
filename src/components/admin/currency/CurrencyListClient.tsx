"use client";

import { useState } from "react";
import { useGetCurrencyRates, useUpdateCurrencyRate } from "@/hooks";
import {
  DollarSign,
  Edit,
  Save,
  X,
  Loader,
  RefreshCw,
  Plus,
} from "lucide-react";
import { CreateCurrencyModal } from "./CreateCurrencyModal";
import { useCurrencyStore } from "@/stores";

export function CurrencyListClient() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: rates = [], isLoading, refetch } = useGetCurrencyRates();
  const updateRate = useUpdateCurrencyRate();
  const symbol = useCurrencyStore((s) => s.getCurrencySymbol());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: string, currentRate: number) => {
    setEditingId(id);
    setEditValue(currentRate.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (currency: string) => {
    const rate = parseFloat(editValue);
    if (isNaN(rate) || rate <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    updateRate.mutate(
      { currency, rate },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditValue("");
        },
      },
    );
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Currency Exchange Rates
          </h1>
          <p className="text-secondary">
            Manage exchange rates for multi-currency support
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-primary rounded-lg hover:bg-tertiary transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Currency</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              About Exchange Rates
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              All rates are relative to 1 USD. For example, if EUR rate is 0.92,
              it means 1 USD = 0.92 EUR. Update these rates regularly to ensure
              accurate pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((rate) => {
          const isEditing = editingId === rate.id;

          return (
            <div
              key={rate.id}
              className="bg-secondary border border-primary rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">
                    {symbol}
                  </span>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(rate.id, rate.rate)}
                    className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    title="Edit rate"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="text-2xl font-bold text-primary mb-1">
                {rate.currency}
              </h3>

              {isEditing ? (
                <div className="space-y-3 flex items-center flex-col justify-between">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(rate.currency);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="w-full px-3 py-2 bg-primary border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                    placeholder="Enter rate"
                    autoFocus
                  />
                  <div className="flex gap-2 max-h-10 w-full items-end justify-end">
                    <button
                      title="Update or Save Button"
                      onClick={() => saveEdit(rate.currency)}
                      disabled={updateRate.isPending}
                      className="px-3 py-2  flex items-center justify-center h-10 w-24 border border-accent rounded-lg gap-2"
                    >
                      {updateRate.isPending ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin text-accent" />
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-accent" />
                          <span className="text-accent">Save</span>
                        </>
                      )}
                    </button>
                    <button
                      title="Cancel Button"
                      onClick={cancelEdit}
                      disabled={updateRate.isPending}
                      className=" px-3 py-2  border border-primary rounded-lg hover:bg-tertiary transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-semibold text-accent mb-2">
                    {rate.rate.toFixed(2)}
                  </p>
                  <p className="text-sm text-secondary">
                    1 USD = {rate.rate.toFixed(2)} {rate.currency}
                  </p>
                  <p className="text-xs text-tertiary mt-2">
                    Updated: {new Date(rate.updatedAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {rates.length === 0 && (
        <div className="text-center py-12 bg-secondary border border-primary rounded-lg">
          <DollarSign className="w-12 h-12 text-tertiary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-primary mb-2">
            No Currency Rates
          </h3>
          <p className="text-secondary">
            Currency rates will appear here once configured
          </p>
        </div>
      )}

      <CreateCurrencyModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
