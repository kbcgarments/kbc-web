// src/types/i18n.ts

export type Language = "en" | "fr" | "es" | "zu";

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}
export type SupportedLang = "en" | "fr" | "es" | "zu";

export const COPY_MESSAGES: Record<
  SupportedLang,
  {
    success: string;
    failure: string;
  }
> = {
  en: {
    success: "Copied to clipboard",
    failure: "Unable to copy. Please try again.",
  },
  fr: {
    success: "Copié dans le presse-papiers",
    failure: "Impossible de copier. Veuillez réessayer.",
  },
  es: {
    success: "Copiado al portapapeles",
    failure: "No se pudo copiar. Inténtalo de nuevo.",
  },
  zu: {
    success: "Kukopishelwe ku-clipboard",
    failure: "Ayikwazanga ukukopishwa. Sicela uzame futhi.",
  },
};
