"use client";

interface Props {
  hex: string;
  name: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterColorSwatch({ hex, name, active, onToggle }: Props) {
  return (
    <button
      title={name}
      onClick={onToggle}
      className={`relative w-10 h-10 rounded-full transition
        ${active ? "ring-2 ring-accent scale-110" : "border-primary"}
      `}
      style={{ backgroundColor: hex }}
    >
      {hex === "#FFFFFF" && (
        <span className="absolute inset-0 rounded-full border border-primary" />
      )}
    </button>
  );
}
