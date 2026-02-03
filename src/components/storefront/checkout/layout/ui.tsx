"use client";

import { Check } from "lucide-react";

/* ======================================================
   SURFACE
====================================================== */
export function Surface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-secondary/90  p-2 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

/* ======================================================
   SECTION TITLE
====================================================== */
export function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
        {icon}
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

/* ======================================================
   BUTTONS
====================================================== */
export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="
        w-full py-4 rounded-xl
        bg-linear-to-r from-(--color-text-accent) to-(--color-bg-brown)/70
        text-white font-bold uppercase tracking-wide
        hover:scale-[1.01] transition
        disabled:opacity-50
      "
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="
        w-full py-4 rounded-xl
        border border-primary/30
        text-primary font-semibold
        hover:bg-secondary transition
      "
    >
      {children}
    </button>
  );
}

/* ======================================================
   STEP INDICATOR (used in header)
====================================================== */
export function Step({
  icon,
  label,
  active,
  done,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-11 h-11 rounded-full flex items-center justify-center
          ${
            active || done
              ? "bg-accent text-white"
              : "border border-primary/30 text-secondary"
          }
        `}
      >
        {done ? <Check className="w-5 h-5" /> : icon}
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

export function Divider() {
  return <div className="w-12 h-px bg-primary/20" />;
}
