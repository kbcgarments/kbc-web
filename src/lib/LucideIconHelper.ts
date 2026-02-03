import type { LucideIcon } from "lucide-react";
import { LUCIDE_ICON_MAP, type LucideIconName } from "@/constants/lucide-icons";

export const DEFAULT_ICON: LucideIcon = LUCIDE_ICON_MAP.Star;

export function getLucideIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return DEFAULT_ICON;

  return LUCIDE_ICON_MAP[iconName as LucideIconName] ?? DEFAULT_ICON;
}
