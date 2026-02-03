"use client";

import Link from "next/link";
import { cn } from "@/utils";

interface AnimatedButtonProps {
  href?: string;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "ghost" | "solid" | "outline";
  size?: "sm" | "md" | "lg";
}

export function AnimatedButton({
  href,
  asChild = false,
  children,
  className,
  variant = "ghost",
  size = "md",
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-[10px] md:text-xs leading-tight",
    md: "px-5 py-2.5 text-[11px] md:text-sm leading-tight",
    lg: "px-6 py-3 text-xs md:text-base leading-tight",
  };

  const variantClasses = {
    ghost:
      "text-white border-2 border-white/80 backdrop-blur-sm bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl",
    solid:
      "text-sand-900 bg-white border-2 border-white shadow-lg hover:bg-sand-100 hover:shadow-2xl",
    outline:
      "text-white border-2 border-white/80 bg-transparent hover:bg-white hover:text-sand-900 shadow-md hover:shadow-xl",
  };

  const inner = (
    <span
      className={cn(
        "relative inline-flex items-center justify-center text-center group overflow-hidden rounded-full",
        "font-bold uppercase tracking-wider",
        "transition-all duration-300 ease-out",
        "hover:scale-105 active:scale-100",
        "w-full max-w-[85%]",
        "min-h-10",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {/* Sliding overlay */}
      <span
        className={cn(
          "absolute inset-0 rounded-full transition-transform duration-500 ease-out",
          "-translate-x-full group-hover:translate-x-0",
          variant === "ghost" && "bg-white/20",
          variant === "solid" && "bg-sand-900/10",
          variant === "outline" && "bg-white",
        )}
      />

      {/* Shimmer effect */}
      <span
        className="
          absolute inset-0 rounded-full pointer-events-none
          bg-linear-to-r from-transparent via-white/40 to-transparent
          -translate-x-full group-hover:translate-x-full
          transition-transform duration-1000 ease-in-out
        "
      />

      {/* Text with line clamp (max 2 lines) */}
      <span className="relative z-10 line-clamp-2 px-2">{children}</span>
    </span>
  );

  if (asChild) {
    return <>{inner}</>;
  }

  if (href) {
    return (
      <Link href={href} className="inline-flex justify-center w-full">
        {inner}
      </Link>
    );
  }

  return (
    <button className="inline-flex justify-center w-full cursor-pointer disabled:cursor-not-allowed">
      {inner}
    </button>
  );
}
