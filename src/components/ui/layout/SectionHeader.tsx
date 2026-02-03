"use client";

import { cn } from "@/utils";

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center mb-16 space-y-6", className)}>
      <div>
        {/* TITLE */}
        <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
          {title}
        </h2>
        {/* SUBTITLE */}
        {subtitle && (
          <p className="text-lg text-secondary max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
      {/* ORNAMENT */}
      <div className="flex items-center justify-center gap-2 select-none">
        {/* LEFT DOTS */}
        <div className="flex gap-1 opacity-60">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-accent" />
          ))}
        </div>

        {/* CENTER DIAMONDS */}
        <div className="flex items-center gap-2">
          {/* Small left diamond */}
          <span className="h-2 w-2 rotate-45 border border-accent" />

          {/* Larger center diamond */}
          <span className="h-3.5 w-3.5 rotate-45 border-2 border-accent" />

          {/* Small right diamond */}
          <span className="h-2 w-2 rotate-45 border border-accent" />
        </div>

        {/* RIGHT DOTS */}
        <div className="flex gap-1 opacity-60">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="w-1 h-1  rounded-full bg-accent" />
          ))}
        </div>
      </div>
    </div>
  );
}
