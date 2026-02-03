"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import AccentButton from "../../ui/buttons/AccentButton";
import { useRouter } from "next/navigation";
import { cn } from "@/utils";

export function AdminTopbar() {
  const router = useRouter();
  const admin = useAdminAuthStore((state) => state.admin);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 bg-secondary border-b border-primary flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search..."
            title="Search admin panel"
            aria-label="Search admin panel"
            className="w-full pl-10 pr-4 py-2 bg-tertiary border border-primary rounded-lg text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="p-2 hover:bg-tertiary rounded-lg transition-colors"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-secondary" />
          ) : (
            <Sun className="w-5 h-5 text-secondary" />
          )}
        </button>

        {/* Notifications */}
        <button
          title="View notifications"
          aria-label="View notifications"
          className="relative p-2 hover:bg-tertiary rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-secondary" />
          <span
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            title="You have unread notifications"
            aria-label="Unread notifications indicator"
          />
        </button>

        <AccentButton
          text="Create new admin"
          aria-label="Create new admin"
          className={cn("capitalize text-sm py-0")}
          onClick={() => router.push("/admin/auth/register")}
        />

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-primary">
          <div
            className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            title={admin?.email || "Admin user"}
            aria-label={`Logged in as ${admin?.email || "admin"}`}
          >
            <span className="text-white text-sm font-semibold">
              {admin?.name?.charAt(0) || admin?.email.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
