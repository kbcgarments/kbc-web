"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref = "/collections",
  onCtaClick,
}: EmptyStateProps) {
  const ctaClassName =
    "inline-flex items-center gap-2 px-10 py-4 bg-linear-to-r from-(--color-text-accent) to-(--color-bg-brown)/50 text-white rounded-full font-bold hover:shadow-xl transition-all hover:scale-105 duration-500";

  return (
    <div className="flex flex-col items-center text-center py-20 px-6">
      {/* ICON */}
      <div className="w-28 h-28 bg-linear-to-br from-(--color-text-accent) to-(--color-bg-brown)/50 rounded-2xl flex items-center justify-center mb-8 relative">
        <div className="absolute inset-2 border-2 border-white/20 rounded-xl" />
        <Icon className="w-14 h-14 text-accent" />
      </div>

      {/* TEXT */}
      <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>

      <p className="text-secondary max-w-md mb-10 leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      {ctaHref ? (
        <Link href={ctaHref} className={ctaClassName}>
          {ctaLabel}
          <ArrowRight className="w-5 h-5" />
        </Link>
      ) : (
        <button onClick={onCtaClick} className={ctaClassName}>
          {ctaLabel}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
