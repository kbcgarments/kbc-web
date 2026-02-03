"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/stores/useAuthStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useLogout } from "@/hooks";

export function AccountIcon() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { isAuthenticated } = useAuthStore();
  const { translate } = useLanguageStore();
  const logout = useLogout();

  const iconClass = `${
    isHome ? "text-white" : "text-primary"
  } w-5 h-5 group-hover:text-accent transition-colors`;

  /* ============================================
     AUTHENTICATED → SIGN OUT
  ============================================ */
  if (isAuthenticated) {
    return (
      <button
        type="button"
        title={translate("navigation.account.logout")}
        aria-label={translate("navigation.account.logout")}
        onClick={() => logout.mutate()}
        className="p-2 hover:bg-secondary rounded-md transition-theme group cursor-pointer"
      >
        <LogOut className={iconClass} />
      </button>
    );
  }

  /* ============================================
     UNAUTHENTICATED → LOGIN
  ============================================ */
  return (
    <Link
      href="/account/login"
      title={translate("navigation.account.login")}
      aria-label={translate("navigation.account.login")}
      className="p-2 hover:bg-secondary rounded-md transition-theme group cursor-pointer"
    >
      <User className={iconClass} />
    </Link>
  );
}
