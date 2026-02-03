"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase text-secondary">
        {label}
      </label>
      <div
        className={`relative rounded-lg border ${
          error ? "border-red-400" : "border-primary/20"
        } bg-primary focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20`}
      >
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 pr-10 text-sm text-primary placeholder:text-tertiary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
