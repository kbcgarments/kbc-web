"use client";

import { LucideIcon } from "lucide-react";

export function SectionCard({
  title,
  icon: Icon,
  children,
  variant = "default",
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <section
      className={`rounded-xl border p-5 sm:p-6 transition-all ${
        variant === "danger"
          ? "border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
          : "border-primary/10 bg-secondary/20 hover:border-primary/20"
      }`}
    >
      <header className="flex items-center gap-2 mb-5">
        <Icon
          className={`w-5 h-5 ${variant === "danger" ? "text-red-600 dark:text-red-400" : "text-accent"}`}
          strokeWidth={1.5}
        />
        <h3 className="text-base sm:text-lg font-bold text-primary">{title}</h3>
      </header>
      {children}
    </section>
  );
}
