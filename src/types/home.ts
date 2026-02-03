import { Product } from "./product";

/* ======================================================
   COMMON
====================================================== */

export type Locale = "en" | "fr" | "es" | "zu";

export enum FeedbackStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROMOTED = "PROMOTED",
}

/* ======================================================
   DASHBOARD METRICS (ADMIN)
====================================================== */

export interface DashboardMetrics {
  /* =============================
     PRODUCT & CATEGORY METRICS
  ============================== */
  totalProducts: number;
  totalCategories: number;

  /* =============================
     ORDER METRICS
  ============================== */
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  /* =============================
     CUSTOMER METRICS
  ============================== */
  totalCustomers: number;

  /* =============================
     REVENUE METRICS
  ============================== */
  totalRevenueUSD: number;
  revenueTodayUSD: number;
  revenueThisWeekUSD: number;
  revenueThisMonthUSD: number;

  /* =============================
     FEEDBACK METRICS
  ============================== */
  pendingFeedback: number;
  approvedFeedback: number;
  promotedFeedback: number;

  /* =============================
     TESTIMONIAL METRICS
  ============================== */
  totalTestimonials: number;
  activeTestimonials: number;

  /* =============================
     HOMEPAGE CONTENT METRICS
  ============================== */
  activeHeroSections: number;
  activeBanners: number;
  activeWhyChooseUsItems: number;
}

/* ======================================================
   HERO
====================================================== */

/** 🔐 Admin hero (CMS, English-only used in UI) */
export interface HeroAdmin {
  id: string;

  headline_en: string;
  subheadline_en?: string | null;

  ctaText_en?: string | null;
  ctaLink?: string | null;

  imageUrl: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/** 🌍 Public hero (language-resolved) */
export interface HeroPublic {
  id: string;
  headline: string;
  subheadline?: string | null;
  ctaText_en?: string | null;
  ctaLink?: string | null;
  imageUrl: string;
}

/* ======================================================
   BANNERS
====================================================== */

/** 🔐 Admin banner (CMS) */
export interface BannerAdmin {
  id: string;

  title_en?: string | null;
  description_en?: string | null;
  ctaText_en?: string | null;
  ctaLink?: string | null;

  imageUrl: string;

  createdAt: string;
  updatedAt: string;
}

/** 🌍 Public banner */
export interface BannerPublic {
  id: string;

  title_en?: string | null;
  description_en?: string | null;
  ctaText_en?: string | null;
  ctaLink?: string | null;

  imageUrl: string;
}

/* ======================================================
   WHY CHOOSE US
====================================================== */

/** 🔐 Admin */
export interface WhyChooseUsAdmin {
  id: string;

  title_en: string;
  description_en: string;

  icon?: string | null;
  order: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/** 🌍 Public */
export interface WhyChooseUsPublic {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
}

/* ======================================================
   CUSTOMER FEEDBACK (ADMIN)
====================================================== */

export interface CustomerFeedbackAdmin {
  id: string;
  status: FeedbackStatus;

  rating?: number | null;
  message: string;

  createdAt: string;

  order: {
    orderNumber: string;
    email: string;
    shippingFullName?: string | null;
  };
}

/* ======================================================
   TESTIMONIALS
====================================================== */

/** 🔐 Admin testimonial */
export interface TestimonialAdmin {
  id: string;
  feedbackId?: string | null;
  avatarUrl?: string | null;

  customerName: string;
  quote_en: string;

  rating?: number | null;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/** 🌍 Public testimonial */
export interface TestimonialPublic {
  id: string;
  customerName: string;
  quote: string;
  rating?: number | null;
  avatarUrl?: string | null;
}

/* ======================================================
   HOMEPAGE PAYLOADS
====================================================== */

/** 🌍 Public homepage */
export interface HomepageResponse {
  hero: HeroPublic | null;
  banners: BannerPublic[];

  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];

  testimonials: TestimonialPublic[];
  whyChooseUs: WhyChooseUsPublic[];
}

/** 🔐 Admin CMS overview */
export interface AdminHomepageContent {
  heroes: HeroAdmin[];
  banners: BannerAdmin[];
  whyChooseUs: WhyChooseUsAdmin[];
  testimonials: TestimonialAdmin[];
  customerFeedback: CustomerFeedbackAdmin[];
}
