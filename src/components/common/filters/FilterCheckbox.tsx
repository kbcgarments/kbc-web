"use client";

import { Check } from "lucide-react";

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function FilterCheckbox({ label, checked, onToggle }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="peer sr-only border-2 border-primary"
      />

      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition shadow-2xl
          ${checked ? "bg-accent border-accent" : "border-accent "}
        `}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white rounded-sm" />}
      </div>

      <span
        className={`text-sm text-primary ${checked ? "text-accent" : "text-primary"}`}
      >
        {label}
      </span>
    </label>
  );
}
