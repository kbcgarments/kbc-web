// components/ui/StatusBadge.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  variant: "in-cart" | "different-variant";
}

export function StatusBadge({ variant }: StatusBadgeProps) {
  const config = {
    "in-cart": {
      text: "In Cart",
      icon: CheckCircle2,
      bgColor: "bg-emerald-500/10 dark:bg-emerald-400/10",
      borderColor: "border-emerald-500/30 dark:border-emerald-400/30",
      textColor: "text-emerald-700 dark:text-emerald-300",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      dotColor: "bg-emerald-600 dark:bg-emerald-400",
    },
    "different-variant": {
      text: "Different Variant",
      icon: AlertCircle,
      bgColor: "bg-amber-500/10 dark:bg-amber-400/10",
      borderColor: "border-amber-500/30 dark:border-amber-400/30",
      textColor: "text-amber-700 dark:text-amber-300",
      iconColor: "text-amber-600 dark:text-amber-400",
      dotColor: "bg-amber-600 dark:bg-amber-400",
    },
  };

  const {
    text,
    icon: Icon,
    bgColor,
    borderColor,
    textColor,
    iconColor,
    dotColor,
  } = config[variant];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={`
        inline-flex items-center gap-1.5
        text-[10px] px-3 py-1.5
        rounded-full border
        font-bold uppercase tracking-wider
        shadow-sm hover:shadow-md
        transition-shadow duration-200
        ${bgColor} ${borderColor} ${textColor}
      `}
    >
      <Icon className={`w-3 h-3 ${iconColor}`} />
      <span>{text}</span>
      <span className={`w-1 h-1 rounded-full ${dotColor} animate-pulse`} />
    </motion.span>
  );
}
