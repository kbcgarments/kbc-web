import { TranslationKeys } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "fr" | "es" | "zu";

interface Translations {
  [key: string]: string | Translations;
}

interface LanguageStore {
  language: Language;
  translations: Translations;
  isLoading: boolean;

  /** true = admin dashboard => no i18n requests */
  isAdmin: boolean;

  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
  getObject: <T = unknown>(key: string) => T | undefined;
  loadTranslations: (lang: Language) => Promise<void>;
}

/**
 * Decide if we're on the admin app.
 * - hostname: admin.localhost, admin.yourdomain.com
 * - pathname: /admin/...
 */
function detectAdmin(): boolean {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  return host.startsWith("admin.") || path.startsWith("/admin");
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "en",
      translations: {},
      isLoading: false,
      isAdmin: detectAdmin(),

      setLanguage: (lang: Language) => {
        // Admin doesn't use translations at all
        if (get().isAdmin) {
          set({ language: lang });
          return;
        }

        set({ language: lang });
        void get().loadTranslations(lang);
      },

      translate: (key: string): string => {
        // Admin: no translation system, just return the key (or plain text)
        if (get().isAdmin) return key;

        const keys = key.split(".");
        let value: TranslationKeys | string = get().translations;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k] as TranslationKeys;
          } else {
            return key;
          }
        }

        return typeof value === "string" ? value : key;
      },

      getObject: <T = unknown>(key: string): T | undefined => {
        if (get().isAdmin) return undefined;

        return key
          .split(".")
          .reduce<unknown>(
            (acc, k) =>
              acc && typeof acc === "object"
                ? (acc as Record<string, unknown>)[k]
                : undefined,
            get().translations,
          ) as T | undefined;
      },

      loadTranslations: async (lang: Language) => {
        // Admin: skip fetching locales completely (prevents 404 spam)
        if (get().isAdmin) {
          set({ translations: {}, isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch(`/locales/${lang}.json`, {
            cache: "no-store",
          });

          if (!response.ok) {
            set({ translations: {}, isLoading: false });
            return;
          }

          const data = (await response.json()) as Translations;
          set({ translations: data, isLoading: false });
        } catch {
          set({ translations: {}, isLoading: false });
        }
      },
    }),
    {
      name: "kbc-language",
      partialize: (state) => ({ language: state.language }),
    },
  ),
);
