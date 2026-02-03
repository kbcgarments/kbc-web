"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Language } from "@/types";
import { ChevronDown } from "lucide-react";

const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "zu", name: "isiZulu", flag: "🇿🇦" },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { language, setLanguage, translate } = useLanguageStore();
  const currentLanguage = languages.find((lang) => lang.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        title={translate("common.language")}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-theme"
        aria-label={translate("common.language")}
        aria-expanded={isOpen ? "true" : "false"}
      >
        <span className="text-base">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-primary border border-primary rounded-md shadow-lg z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              title={translate("common.language")}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-tertiary transition-theme ${
                lang.code === language
                  ? "bg-tertiary text-accent"
                  : "text-primary"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === language && (
                <span className="ml-auto text-accent">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
