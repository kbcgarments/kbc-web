"use client";

import Link from "next/link";
import { useGetCategories } from "@/hooks";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { getCategoryName, getCategoryRoute } from "@/lib/categoryHelpers";
import { Loader } from "lucide-react";
import { useMemo } from "react";
import Image from "next/image";

export function CategoriesPageClient() {
  const { data, isLoading, error } = useGetCategories();
  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const { language, translate } = useLanguageStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-accent animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <p className="text-error text-lg mb-4">Failed to load categories</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-theme"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit bg-primary">
      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              No Categories Yet
            </h2>
            <p className="text-secondary mb-6">
              We&apos;re building our catalog. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-md hover:bg-accent-dark transition-theme"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={getCategoryRoute(category.slug)}
                className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-tertiary shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* CATEGORY IMAGE */}
                <Image
                  src={category?.imageUrl || "/placeholder.jpg"}
                  alt={getCategoryName(category, language)}
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  fill
                  priority
                  sizes="100vw"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/50 group-hover:from-black/80  transition-colors duration-500" />
                {/* CENTERED CONTENT */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                  <h3
                    className="
                      text-2xl lg:text-3xl
                      font-display font-bold
                      text-white
                      tracking-wide
                      mb-2
                      group-hover:-translate-y-0.5
                      transition-transform duration-300
                    "
                  >
                    {getCategoryName(category, language)}
                  </h3>

                  <span
                    className="
                      text-xs uppercase tracking-widest
                      text-white/80
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                  >
                    {translate("common.exploreCollection")}
                  </span>
                </div>

                {/* SUBTLE BORDER GLOW */}
                <div
                  className="
      pointer-events-none
      absolute inset-0 rounded-2xl
      ring-1 ring-white/10
      group-hover:ring-accent/40
      transition
    "
                />
              </Link>
            ))}
          </div>
        )}{" "}
      </div>
    </div>
  );
}
