"use client";

interface Props {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterSizePill({ label, active, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg text-sm border-2 transition font-semibold
        ${active ? "border-accent text-accent bg-accent/10" : "border-primary"}
      `}
    >
      {label}
    </button>
  );
}
