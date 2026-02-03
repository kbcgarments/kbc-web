import { Category } from "./category";

/* ============================================
   ENUMS
============================================ */
export enum PRODUCT_STATUS {
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}
export enum PRODUCT_CONTENT_TYPE {
  DESCRIPTION = "DESCRIPTION",
  SHIPPING = "SHIPPING",
  GENERAL = "GENERAL",
}

export interface ProductType {
  id: string;
  key: string;
  label_en: string;
  label_fr?: string | null;
  label_es?: string | null;
  label_zu?: string | null;
  isActive: boolean;
  order: number;
  products?: Product[];
}

export const PRODUCT_CONTENT_TYPE_LABELS: Record<PRODUCT_CONTENT_TYPE, string> =
  {
    DESCRIPTION: "Description",
    SHIPPING: "Shipping Info",
    GENERAL: "General Info",
  };
/* ============================================
   PRODUCT CORE
============================================ */

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  colorId: string | null;
  isPrimary: boolean;
}

/* ---------- COLOR ---------- */
export interface ProductColor {
  id: string;
  key: string; // "black"
  label: string; // "Black"
  hex: string; // "#000000"
}

/* ---------- SIZE ---------- */
export interface ProductSize {
  id: string;
  key: string; // "s", "m", "xl"
  label: string; // "Small", "Medium"
  order: number;
}

/* ---------- VARIANT ---------- */
export interface ProductVariant {
  id: string;
  productId: string;

  colorId: string | null;
  color?: ProductColor | null;

  sizeId: string | null;
  size?: ProductSize | null;

  stock: number;
}

/* ---------- CONTENT ---------- */
export interface ProductContentSection {
  id: string;
  productId: string;
  type: PRODUCT_CONTENT_TYPE;
  title?: string | null;

  content_en: string;
  content_fr?: string | null;
  content_es?: string | null;
  content_zu?: string | null;

  order: number;
  createdAt: string;
  updatedAt: string;
}

/* ---------- PRODUCT ---------- */
export interface Product {
  id: string;
  categoryId: string | null;

  productType: ProductType;
  priceUSD: number;

  // Translations
  title_en: string;
  title_fr: string | null;
  title_es: string | null;
  title_zu: string | null;

  description_en: string;
  description_fr: string | null;
  description_es: string | null;
  description_zu: string | null;

  status: PRODUCT_STATUS;

  images: ProductImage[];
  variants: ProductVariant[];
  productContentSections?: ProductContentSection[];

  createdAt: string;
  updatedAt: string;

  category?: Category | null;
}

/* ============================================
   PAYLOADS
============================================ */

/* ---------- CREATE ---------- */
export interface CreateProductInput {
  categoryId: string | null;
  productTypeId: string | null;
  priceUSD: number;

  title_en: string;
  description_en: string;

  status?: PRODUCT_STATUS;

  images?: Array<{
    url: string;
    colorId?: string | null;
    isPrimary?: boolean;
  }>;

  variants?: Array<{
    colorId?: string | null;
    sizeId?: string | null;
    stock: number;
  }>;

  contentSections?: Array<{
    type: PRODUCT_CONTENT_TYPE;
    title?: string;
    content_en: string;
  }>;
}

/* ---------- UPDATE ---------- */
export interface UpdateProductInput {
  categoryId?: string | null;
  productType?: ProductType;
  priceUSD?: number;
  status?: PRODUCT_STATUS;

  title_en?: string;
  description_en?: string;

  contentSections?: Array<{
    type: PRODUCT_CONTENT_TYPE;
    title?: string;
    content_en: string;
  }>;
}

/* ============================================
   UI
============================================ */

export interface ProductTabsProps {
  sections: ProductContentSection[];
}
