"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { LanguageSelector } from "../selectors/LanguageSelector";
import { CurrencySelector } from "../selectors/CurrencySelector";
import { ThemeToggle } from "../icons/ThemeToggle";
import { useGetCategories, useLogout } from "@/hooks";
import { getCategoryName, getCategoryRoute } from "@/lib/categoryHelpers";
import { cn } from "@/utils";
import Image from "next/image";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { translate, language } = useLanguageStore();
  const { isAuthenticated, user } = useAuthStore();
  const logout = useLogout();
  const { data: categories = [] } = useGetCategories();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-60 lg:hidden animate-fadeIn"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[320px] bg-primary shadow-2xl z-70 transform transition-transform duration-300 lg:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary shrink-0">
          <div className="flex items-center">
            <div className="w-[80%] h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Link href="/" className="flex justify-start items-start mr-4">
                <Image
                  src="https://res.cloudinary.com/ddi3mvlj4/image/upload/kbc-logo_mhy39q.png"
                  alt="KBC Universe"
                  width={256}
                  height={83}
                  className="h-7 w-auto"
                  sizes="80px"
                  priority
                />
              </Link>
              <span className="text-lg font-bold text-primary">Universe</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 icon-primary" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User Section */}
          {isAuthenticated && user && (
            <div className="px-5 py-4 border-b border-primary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-tertiary truncate">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary Navigation */}
          <nav className="py-2">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-tertiary uppercase tracking-wider px-2">
                {translate("navigation.primary.menu")}
              </p>
            </div>

            <Link
              href="/"
              title={translate("navigation.primary.home")}
              aria-label={translate("navigation.primary.home")}
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
            >
              <span className="text-sm font-medium group-hover:text-accent transition-colors">
                {translate("navigation.primary.home")}
              </span>
              <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/collections"
              title={translate("navigation.primary.shop")}
              aria-label={translate("navigation.primary.shop")}
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
            >
              <span className="text-sm font-medium group-hover:text-accent transition-colors">
                {translate("navigation.primary.shop")}
              </span>
              <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
            </Link>

            {/* Categories Accordion */}
            <div>
              <button
                title={translate("navigation.primary.categories")}
                aria-label={translate("navigation.primary.categories")}
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
              >
                <span className="text-sm font-medium group-hover:text-accent transition-colors">
                  {translate("navigation.primary.categories")}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-tertiary group-hover:text-accent transition-all",
                    expandedSection === "categories" && "rotate-180",
                  )}
                />
              </button>

              {/* Categories Submenu */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  expandedSection === "categories"
                    ? "max-h-100 opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="py-2 bg-secondary/30 border-y border-primary/50">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      href={getCategoryRoute(category.slug)}
                      onClick={onClose}
                      className="flex items-center gap-2 px-8 py-2.5 text-secondary hover:text-accent hover:bg-secondary/50 transition-all text-sm group"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{getCategoryName(category, language)}</span>
                    </Link>
                  ))}
                  {categories.length > 8 && (
                    <Link
                      href="/collections"
                      title={translate("navigation.common.viewAll")}
                      aria-label={translate("navigation.common.viewAll")}
                      onClick={onClose}
                      className="flex items-center gap-2 px-8 py-2.5 text-accent font-medium hover:bg-secondary/50 transition-all text-sm"
                    >
                      <span>{translate("navigation.common.viewAll")} →</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              title={translate("navigation.primary.about")}
              aria-label={translate("navigation.primary.about")}
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
            >
              <span className="text-sm font-medium group-hover:text-accent transition-colors">
                {translate("navigation.primary.about")}
              </span>
              <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/contact"
              title={translate("navigation.primary.contact")}
              aria-label={translate("navigation.primary.contact")}
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
            >
              <span className="text-sm font-medium group-hover:text-accent transition-colors">
                {translate("navigation.primary.contact")}
              </span>
              <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
            </Link>
          </nav>

          {/* Account Section */}
          <div className="border-t border-primary mt-2 py-2">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-tertiary uppercase tracking-wider px-2">
                {translate("navigation.account.account")}
              </p>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  href="/account/me"
                  title={translate("navigation.account.myAccount")}
                  aria-label={translate("navigation.account.myAccount")}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium group-hover:text-accent transition-colors">
                      {translate("navigation.account.myAccount")}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/account/orders"
                  title={translate("navigation.account.myOrders")}
                  aria-label={translate("navigation.account.myOrders")}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium group-hover:text-accent transition-colors">
                      {translate("navigation.account.myOrders")}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
                </Link>

                <button
                  title={translate("navigation.account.logout")}
                  aria-label={translate("navigation.account.logout")}
                  onClick={() => {
                    logout.mutate();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium group-hover:text-accent transition-colors">
                      {translate("navigation.account.logout")}
                    </span>
                  </div>
                </button>
              </>
            ) : (
              <Link
                href="/account/login"
                title={translate("navigation.account.login")}
                aria-label={translate("navigation.account.login")}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3 text-primary hover:bg-secondary/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium group-hover:text-accent transition-colors">
                    {translate("navigation.account.login")}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-accent transition-all group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Settings Section */}
          <div className="border-t border-primary mt-2 py-4 px-5">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">
                  {translate("common.language")}
                </p>
                <LanguageSelector />
              </div>

              <div>
                <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">
                  {translate("common.currency")}
                </p>
                <CurrencySelector />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
                  Theme
                </span>
                <ThemeToggle isSidebarOpen={isOpen} />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-primary px-5 py-4 space-y-3">
            <p className="text-xs font-bold text-tertiary uppercase tracking-wider">
              {translate("common.needHelp")}
            </p>
            <a
              href="tel:+27707643281"
              className="flex items-center gap-3 text-sm text-secondary hover:text-accent transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-sm">📞</span>
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform">
                +27 70 764 3281
              </span>
            </a>

            <a
              href="mailto:hello@kbcuniverse.org"
              className="flex items-center gap-3 text-sm text-secondary hover:text-accent transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-sm">✉️</span>
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform text-xs">
                hello@kbcuniverse.org
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
