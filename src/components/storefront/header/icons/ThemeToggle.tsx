"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/utils";
import { useLanguageStore } from "@/stores";

interface ThemeToggleProps {
  isTransparent?: boolean;
  isSidebarOpen?: boolean;
}

export function ThemeToggle({
  isTransparent = false,
  isSidebarOpen = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { translate } = useLanguageStore();
  const iconColorClass =
    isTransparent && !isSidebarOpen ? "text-white" : "text-primary";

  return (
    <button
      title={translate("common.toggleTheme")}
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-secondary/50 transition-all duration-200 group"
      aria-label={translate("common.toggleTheme")}
    >
      {theme === "light" ? (
        <Moon
          className={cn(
            "w-5 h-5 transition-colors duration-200 group-hover:text-accent",
            iconColorClass,
          )}
        />
      ) : (
        <Sun
          className={cn(
            "w-5 h-5 transition-colors duration-200 group-hover:text-accent",
            iconColorClass,
          )}
        />
      )}
    </button>
  );
}
