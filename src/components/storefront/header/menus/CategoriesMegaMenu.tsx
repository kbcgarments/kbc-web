"use client";

import Link from "next/link";
import { useGetCategories } from "@/hooks";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { getCategoryName, getCategoryRoute } from "@/lib/categoryHelpers";
import { ChevronRight } from "lucide-react";

export function CategoriesMegaMenu() {
  const { data: allCategories = [], isLoading } = useGetCategories();
  const { language, translate } = useLanguageStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-secondary/50 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
      {allCategories.map((category) => (
        <Link
          key={category.id}
          aria-label={getCategoryName(category, language)}
          title={getCategoryName(category, language)}
          href={getCategoryRoute(category.slug)}
          className="group flex items-center justify-between gap-3 py-3 px-4 rounded-lg hover:bg-secondary/50 transition-all duration-200"
        >
          <span className="text-sm text-secondary group-hover:text-accent transition-colors duration-200 truncate flex-1">
            {getCategoryName(category, language)}
          </span>
          <ChevronRight className="w-4 h-4 text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
        </Link>
      ))}

      {allCategories.length > 16 && (
        <Link
          href="/collections"
          title={translate("navigation.common.viewAll")}
          aria-label={translate("navigation.common.viewAll")}
          className="group flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent/10 transition-all duration-200 border-2 border-dashed border-accent/30 hover:border-accent/50"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-200 shrink-0">
            <span className="text-accent text-sm font-bold">+</span>
          </div>
          <span className="text-sm font-semibold text-accent hover:text-accent-dark transition-colors duration-200 flex-1">
            {translate("navigation.common.viewAll")}
          </span>
        </Link>
      )}
    </div>
  );
}
