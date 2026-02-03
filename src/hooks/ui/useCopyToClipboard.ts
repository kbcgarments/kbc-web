"use client";

import { copyToClipboard } from "@/utils/copyToClipboard";
import { useToastStore } from "@/stores";
import { SupportedLang } from "@/types";

export function useCopyToClipboard(lang: SupportedLang = "en") {
  const { success, error } = useToastStore();

  return async (value: string) =>
    copyToClipboard(value, {
      lang,
      onSuccess: success,
      onError: error,
    });
}
