import { Language } from "@/stores/useLanguageStore";

/**
 * Safely extracts a localized field from an object
 */
export function localizeField<T extends object>(
  obj: T | null | undefined,
  base: string,
  lang: Language,
): string {
  if (!obj) return "";

  const localizedKey = `${base}_${lang}` as keyof T;
  const fallbackKey = `${base}_en` as keyof T;

  const localizedValue = obj[localizedKey];
  if (typeof localizedValue === "string" && localizedValue.trim()) {
    return localizedValue;
  }

  const fallbackValue = obj[fallbackKey];
  if (typeof fallbackValue === "string" && fallbackValue.trim()) {
    return fallbackValue;
  }

  return "";
}
