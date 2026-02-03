"use client";

import Link from "next/link";
import { useGetCategories } from "@/hooks";
import { useLanguageStore } from "@/stores/useLanguageStore";
import {
  getCategoryName,
  getCategoryRoute,
  getFeaturedCategories,
} from "@/lib/categoryHelpers";
import { Sparkles, TrendingUp, Package } from "lucide-react";
import { useMemo } from "react";

export function ShopMegaMenu() {
  const { data, isLoading } = useGetCategories();
  const { language, translate } = useLanguageStore();
  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const featuredCategories = getFeaturedCategories(categories, 6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-4 bg-secondary rounded w-32" />
            <div className="space-y-3">
              <div className="h-3 bg-tertiary rounded w-24" />
              <div className="h-3 bg-tertiary rounded w-28" />
              <div className="h-3 bg-tertiary rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
      {/* ========================================
          Column 1: Featured Categories
      ======================================== */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-5">
          {translate("navigation.common.featured")}
        </h3>
        <ul className="space-y-4">
          {featuredCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={getCategoryRoute(category.slug)}
                className="group flex items-center gap-2 text-sm text-secondary hover:text-accent transition-all duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  {getCategoryName(category, language)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ========================================
          Column 2: All Categories
      ======================================== */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-5">
          {translate("navigation.common.allCategories")}
        </h3>
        <ul className="space-y-4">
          {categories.slice(0, 8).map((category) => (
            <li key={category.id}>
              <Link
                href={getCategoryRoute(category.slug)}
                className="group flex items-center gap-2 text-sm transition-all duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200">
                  {getCategoryName(category, language)}
                </span>
              </Link>
            </li>
          ))}
          {categories.length > 8 && (
            <li>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors duration-200 mt-2"
              >
                <span>{translate("navigation.common.viewAll")}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* ========================================
          Column 3: Quick Links
      ======================================== */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-5">
          {translate("navigation.common.quickLinks")}
        </h3>
        <ul className="space-y-4">
          <li>
            <Link
              href="/size-guide"
              title={translate("navigation.primary.sizeGuide")}
              aria-label={translate("navigation.primary.sizeGuide")}
              className="group flex items-center gap-3 text-sm text-secondary hover:text-accent transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200 shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {translate("navigation.primary.sizeGuide")}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#new-arrivals"
              title={translate("sections.newArrivals.title")}
              aria-label={translate("sections.newArrivals.title")}
              className="group flex items-center gap-3 text-sm text-secondary hover:text-accent transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200 shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {translate("sections.newArrivals.title")}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#best-sellers"
              title={translate("sections.bestSellers.title")}
              aria-label={translate("sections.bestSellers.title")}
              className="group flex items-center gap-3 text-sm text-secondary hover:text-accent transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200 shrink-0">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {translate("sections.bestSellers.title")}
              </span>
            </Link>
          </li>
          <li className="pt-2 border-t border-primary">
            <Link
              href="/order/track"
              title={translate("navigation.common.trackOrder")}
              aria-label={translate("navigation.common.trackOrder")}
              className="group flex items-center gap-3 text-sm font-medium text-accent hover:text-accent-dark transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-200 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {translate("navigation.common.trackOrder")}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
