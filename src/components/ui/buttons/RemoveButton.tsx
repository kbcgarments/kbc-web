"use client";

import { cn } from "@/utils";

interface RemoveButtonProps {
  icon: React.ReactNode;
  onClick?: () => void | Promise<void>;
  title?: string;
  variant?: "default" | "danger";
  className?: string;
  disabled?: boolean;
}

export function RemoveButton({
  icon,
  onClick,
  title,
  variant = "default",
  className,
  disabled = false,
}: RemoveButtonProps) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        `
        relative flex items-center justify-center
        p-2 rounded-md w-fit
        transition-all duration-300 ease-out
        active:scale-90
        disabled:opacity-40 disabled:cursor-not-allowed
        group
        `,
        variant === "default" &&
          "hover:bg-secondary text-secondary hover:text-accent",
        variant === "danger" && "bg-(--color-text-accent)/10 text-danger",
        className,
      )}
    >
      <span
        className="
          absolute inset-0 rounded-md opacity-0 
          group-hover:opacity-100 transition-opacity duration-300
        "
      />

      <span className="relative z-10 flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
}
