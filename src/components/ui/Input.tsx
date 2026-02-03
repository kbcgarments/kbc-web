"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/utils";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  rightSlot?: React.ReactNode;
}

export function Input({
  label,
  icon: Icon,
  rightSlot,
  className,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-secondary">
          {label}
        </label>
      )}

      <div
        className={cn(
          `relative flex items-center gap-2 border rounded-lg
            bg-primary outline-none transition-all duration-500
          ${focused ? "border-(--color-bg-accent)" : "border-primary/20"}`,
        )}
      >
        {/* Left Icon */}
        {Icon && (
          <div className="w-8 text-tertiary flex items-start justify-center">
            <Icon className="w-4 h-4" strokeWidth={1.5} />
          </div>
        )}

        {/* Input */}
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
          className={clsx(
            "flex-1 bg-transparent py-3 text-sm text-primary",
            "placeholder:text-tertiary rounded-r-lg",
            "focus:outline-none",
            Icon ? "pl-1 pr-4" : "pl-2 pr-4",
            rightSlot && "pr-10",
            className,
          )}
        />

        {/* Right Slot (eye icon, button, etc.) */}
        {rightSlot && (
          <div className="absolute right-3 flex items-center text-tertiary">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
