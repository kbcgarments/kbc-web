import { COPY_MESSAGES, SupportedLang } from "@/types";

interface CopyOptions {
  lang?: SupportedLang;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export async function copyToClipboard(
  value: string,
  options: CopyOptions = {},
) {
  const { lang = "en", onSuccess, onError } = options;

  try {
    await navigator.clipboard.writeText(value);

    onSuccess?.(COPY_MESSAGES[lang].success);
    return true;
  } catch {
    onError?.(COPY_MESSAGES[lang].failure);
    return false;
  }
}
