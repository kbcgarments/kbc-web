"use client";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useCurrencyStore } from "@/stores";

interface Props {
  minPrice?: number;
  maxPrice?: number;
  onMinChange: (value?: number) => void;
  onMaxChange: (value?: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PriceRange({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 1000,
  step = 10,
}: Props) {
  const formatPrice = useCurrencyStore((s) => s.formatPrice);

  const value: [number, number] = [minPrice ?? min, maxPrice ?? max];

  return (
    <div className="w-full space-y-4">
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(val) => {
          if (!Array.isArray(val)) return;

          const [newMin, newMax] = val;

          onMinChange(newMin === min ? undefined : newMin);
          onMaxChange(newMax === max ? undefined : newMax);
        }}
        trackStyle={{ backgroundColor: "var(--color-text-accent)", height: 6 }}
        railStyle={{ backgroundColor: "var(--color-bg-tertiary)", height: 6 }}
        handleStyle={[
          {
            borderColor: "var(--color-text-accent)",
            backgroundColor: "#fff",
            height: 18,
            width: 18,
            marginTop: -6,
          },
          {
            borderColor: "var(--color-text-accent)",
            backgroundColor: "#fff",
            height: 18,
            width: 18,
            marginTop: -6,
          },
        ]}
      />

      {/* Values */}
      <div className="flex justify-between text-sm font-medium text-primary">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  );
}
