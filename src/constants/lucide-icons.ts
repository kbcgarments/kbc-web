// constants/lucide-icons.ts
import {
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Headphones,
  BadgeCheck,
  Globe,
  Package,
  Star,
  Lock,
} from "lucide-react";

export const LUCIDE_ICON_MAP = {
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Headphones,
  BadgeCheck,
  Globe,
  Package,
  Star,
  Lock,
} as const;

export type LucideIconName = keyof typeof LUCIDE_ICON_MAP;

export const LUCIDE_ICON_OPTIONS = Object.keys(
  LUCIDE_ICON_MAP,
) as LucideIconName[];
