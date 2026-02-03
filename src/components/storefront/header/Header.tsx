"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronDown, User, LogOut, Loader2 } from "lucide-react";

import { TopBar } from "./TopBar";
import { WishlistIcon } from "./icons/WishlistIcon";
import { CartIcon } from "./icons/CartIcon";

import { MobileSidebar } from "./navigation/MobileSidebar";

import { ShopMegaMenu } from "./menus/ShopMegaMenu";
import { CategoriesMegaMenu } from "./menus/CategoriesMegaMenu";

import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/hooks";
import { cn } from "@/utils";
import { SearchToggle } from "./icons/SearchToggle";
import { ThemeToggle } from "./icons/ThemeToggle";
import Image from "next/image";

type MenuType = "shop" | "categories" | "products" | null;

export default function Header() {
  const { translate } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<MenuType | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ========================================
     CLICK OUTSIDE TO CLOSE MEGA MENU
  ======================================== */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", onClick);
    }
    return () => document.removeEventListener("mousedown", onClick);
  }, [openMenu]);

  /* ========================================
     MEGA MENU HOVER HANDLERS
  ======================================== */
  const handleMenuEnter = (menu: MenuType) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    enterTimeoutRef.current = setTimeout(() => {
      setOpenMenu(menu);
    }, 150);
  };

  const handleMenuLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 300);
  };

  /* ========================================
     CLEANUP TIMERS
  ======================================== */
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  /* ========================================
     NAV ITEMS WITH MEGA MENUS
  ======================================== */
  const navItemsWithMenus: Array<{ key: MenuType; label: string }> = [
    { key: "shop", label: translate("navigation.primary.shop") },
    { key: "categories", label: translate("navigation.primary.categories") },
  ];
  const accountLabel = isAuthenticated
    ? translate("navigation.account.account")
    : translate("navigation.account.login");

  const accountHref = isAuthenticated ? "/account/me" : "/account/login";

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <>
      <header ref={headerRef} className="relative z-40">
        {/* ========================================
            TOP BAR (DESKTOP ONLY)
        ======================================== */}
        <TopBar />

        {/* ========================================
            MAIN HEADER
        ======================================== */}
        <div className="transition-all duration-300 bg-primary">
          <div className="max-w-7xl mx-auto py-2 md:py-6  px-2 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* ========================================
                MOBILE MENU BUTTON
            ======================================== */}
            <div className="flex items-center gap-3">
              <button
                title={translate("navigation.common.openMenu")}
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-md hover:bg-white/10 transition-colors"
              >
                <Menu className={cn("w-5 h-5")} />
              </button>

              {/* ========================================
                LOGO
            ======================================== */}
              <Link href="/" className="flex justify-start items-start">
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
            </div>

            {/* ========================================
                DESKTOP NAVIGATION
            ======================================== */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Home Link */}
              <Link
                href="/"
                title={translate("navigation.primary.home")}
                className={cn(
                  "text-sm text-primary font-medium transition-colors duration-200 relative",
                  "hover:text-accent",
                  "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent",
                  "after:transition-all after:duration-200",
                  "hover:after:w-full hover:text-accent",
                )}
              >
                {translate("navigation.primary.home")}
              </Link>

              {/* Nav Items with Mega Menus */}
              {navItemsWithMenus.map(({ key, label }) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(key)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors duration-200",
                      "hover:text-accent text-primary relative",
                      "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent",
                      "after:transition-all after:duration-200",
                      "hover:after:w-full",
                      openMenu === key && "text-accent after:w-full",
                    )}
                  >
                    {label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        openMenu === key && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              ))}

              {/* Static Links */}
              <Link
                title={translate("navigation.primary.about")}
                aria-label={translate("navigation.primary.about")}
                href="/about"
                className={cn(
                  "text-sm text-primary font-medium transition-colors duration-200 relative",
                  "hover:text-accent",
                  "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent",
                  "after:transition-all after:duration-200",
                  "hover:after:w-full",
                )}
              >
                {translate("navigation.primary.about")}
              </Link>
              <Link
                title={translate("navigation.primary.contact")}
                aria-label={translate("navigation.primary.contact")}
                href="/contact"
                className={cn(
                  "text-sm text-primary font-medium transition-colors duration-200 relative",
                  "hover:text-accent",
                  "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent",
                  "after:transition-all after:duration-200",
                  "hover:after:w-full",
                )}
              >
                {translate("navigation.primary.contact")}
              </Link>
            </nav>

            {/* ========================================
                ACTION ICONS
            ======================================== */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SearchToggle />

              <WishlistIcon className="hidden lg:block" />
              <CartIcon className="hidden lg:block" />

              {/* Account Icon - Conditional based on auth state */}
              <div className="flex items-center gap-2">
                {/* Account Link */}
                <Link
                  href={accountHref}
                  title={accountLabel}
                  aria-label={accountLabel}
                  className="p-2 hover:bg-secondary/50 rounded-md transition-all duration-200 hidden lg:block group"
                >
                  <User className="w-5 h-5 transition-colors duration-200 group-hover:text-accent" />
                </Link>

                {/* Logout */}
                {isAuthenticated && !logout.isPending && (
                  <button
                    type="button"
                    title={translate("navigation.account.logout")}
                    aria-label={translate("navigation.account.logout")}
                    onClick={() => logout.mutate()}
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-(--color-text-danger)/10 transition"
                  >
                    <LogOut className="w-5 h-5 text-danger" />
                  </button>
                )}
                {logout.isPending && (
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-(--color-text-danger)/10 transition">
                    <Loader2 className="w-5 h-5 text-danger animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            MEGA MENU PORTAL
        ======================================== */}
        <div
          className={cn(
            "absolute inset-x-0 top-full transition-all duration-300 ease-out",
            openMenu
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none",
          )}
          onMouseEnter={() => {
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
          }}
          onMouseLeave={handleMenuLeave}
        >
          <div className="w-screen bg-primary border-b border-primary shadow-2xl">
            <div className="max-w-350 mx-auto px-8 py-16">
              {openMenu === "shop" && <ShopMegaMenu />}
              {openMenu === "categories" && <CategoriesMegaMenu />}
            </div>
          </div>
        </div>
      </header>
      {/* ========================================
          MOBILE COMPONENTS
      ======================================== */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
