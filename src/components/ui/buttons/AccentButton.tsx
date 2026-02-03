"use client";

import { Loader } from "lucide-react";
import { cn } from "@/utils";

interface AccentButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  text?: string;
  type?: "button" | "submit";
}

export default function AccentButton({
  onClick,
  icon,
  disabled = false,
  loading = false,
  className,
  text,
  type,
}: AccentButtonProps) {
  return (
    <button
      type={type}
      title={text}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        `
        w-full  py-4 px-2 rounded-lg
        bg-accent text-white 
        tracking-wider font-semibold text-sm
        active:scale-100 capitalize cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:shadow-none
        flex items-center justify-center gap-2
        transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]
        hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
        hover:bg-primary/90 hover:border-primary/80`,
        className,
      )}
    >
      {loading ? (
        <Loader className="w-5 h-5 animate-spin text-white" />
      ) : (
        <div className="flex items-center justify-center gap-4">
          {icon}
          <span>{text}</span>
        </div>
      )}
    </button>
  );
}
