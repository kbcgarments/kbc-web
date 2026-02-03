// src/types/category.ts

import type { Product } from "./product";

export type CategoryNameKey = "name_en" | "name_fr" | "name_es" | "name_zu";

export interface Category {
  id: string;
  slug: string;

  name_en: string;
  name_fr: string | null;
  name_es: string | null;
  name_zu: string | null;

  description_en: string | null;
  description_fr: string | null;
  description_es: string | null;
  description_zu: string | null;

  imageUrl: string | null;

  createdAt: string;
  updatedAt: string;

  products?: Product[];
}
