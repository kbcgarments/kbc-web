"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface DropdownOption {
  label: string;
  value: string;
}

interface UniversalDropdownProps {
  options: DropdownOption[] | string[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function UniversalDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: UniversalDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Normalize options to objects
  const normalized = Array.isArray(options)
    ? options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt,
      )
    : [];

  const selectedLabel =
    normalized.find((o) => o.value === value)?.label || placeholder;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={clsx(
          "w-full text-left px-4 py-3 rounded-lg border flex items-center justify-between",
          "bg-white dark:bg-[#0F0E0E] text-gray-900 dark:text-white",
          "border-gray-300 dark:border-gray-700",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-accent/20",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span className="truncate">{selectedLabel}</span>

        <ChevronDown
          className={clsx(
            "w-5 h-5 text-gray-400 transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={clsx(
            "bg-white dark:bg-[#1B1B1B] mt-1 z-50",
            "border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg",
            "max-h-64 overflow-y-auto",
          )}
        >
          {normalized.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={clsx(
                "w-full text-left px-4 py-3 text-sm transition",
                value === opt.value
                  ? "bg-accent/10 text-accent font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
