"use client";

import { Phone, Mail } from "lucide-react";
import { LanguageSelector } from "./selectors/LanguageSelector";
import { CurrencySelector } from "./selectors/CurrencySelector";
import { useLanguageStore } from "@/stores/useLanguageStore";

export function TopBar() {
  const { translate } = useLanguageStore();

  return (
    <div className="bg-secondary text-white transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm">
          {/* Left side - Contact info */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+27707643281"
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>+27 707 643 281</span>
            </a>

            <a
              href="mailto:support@kbcuniverse.org"
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>support@kbcuniverse.org</span>
            </a>
          </div>

          {/* Center - Promo message */}
          <div className="flex-1 md:flex-initial text-center">
            <p className="text-primary text-xs md:text-sm font-medium">
              {translate("cart.notes.freeShipping")}
            </p>
          </div>

          {/* Right side - Language & Currency */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <div className="w-px h-4 bg-white/20" />
            <CurrencySelector />
          </div>
        </div>
      </div>
    </div>
  );
}
