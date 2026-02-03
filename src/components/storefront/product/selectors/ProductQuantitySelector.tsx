"use client";

import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function ProductQuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = "md",
}: ProductQuantitySelectorProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "h-8",
      button: "w-8 h-8",
      display: "min-w-10 h-8 text-sm",
      icon: "w-3 h-3",
      label: "text-xs",
    },
    md: {
      container: "h-10",
      button: "w-10 h-10",
      display: "min-w-12 h-10 text-base",
      icon: "w-4 h-4",
      label: "text-sm",
    },
    lg: {
      container: "h-12",
      button: "w-12 h-12",
      display: "min-w-14 h-12 text-lg",
      icon: "w-5 h-5",
      label: "text-base",
    },
  };

  const config = sizeConfig[size];

  return (
    <div>
      <div
        className={`inline-flex items-center border border-primary rounded-lg bg-primary overflow-hidden ${config.container}`}
      >
        {/* Decrease Button */}
        <button
          onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          title="Decrease quantity"
          className={`${config.button} flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Minus className={config.icon} strokeWidth={2} />
        </button>

        {/* Quantity Display */}
        <div
          className={`flex-1 ${config.display} flex items-center justify-center border-x border-primary bg-secondary/30`}
        >
          <span
            className={`${config.label} font-bold text-primary tabular-nums`}
          >
            {quantity}
          </span>
        </div>

        {/* Increase Button */}
        <button
          onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          title="Increase quantity"
          className={`${config.button} flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Plus className={config.icon} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
