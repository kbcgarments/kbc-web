"use client";

import { useLanguageStore } from "@/stores";
import { Category } from "@/types";
import { localizeField } from "@/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategorySectionProps {
  category: Category;
  reverse?: boolean;
}

export function CategorySection({
  category,
  reverse = false,
}: CategorySectionProps) {
  const { language } = useLanguageStore();

  return (
    <section
      className="min-h-screen flex flex-col "
      aria-labelledby={`category-${localizeField(category, "name", language)}`}
    >
      {/* Header */}
      <div className="max-w-7xl px-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2.5 hover:bg-tertiary rounded-xl transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
          </Link>

          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
              Create Categories
            </h1>
            <p className="text-sm text-secondary mt-1">
              Add multiple categories at once
            </p>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 flex-1 flex items-center">
        <div
          className={`grid gap-12 lg:gap-16 items-center w-full ${
            reverse ? "md:grid-cols-[1fr_1.2fr]" : "md:grid-cols-[1.2fr_1fr]"
          }`}
        >
          {/* IMAGE */}
          <div
            className={`${reverse ? "md:order-2" : "md:order-1"} group`}
            data-aos="fade-up"
          >
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl shadow-2xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent z-10" />

              <Image
                src={category.imageUrl ?? "/assets/placeholder.jpg"}
                alt={localizeField(category, "name", language)}
                fill
                priority={false}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 90vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* TEXT */}
          <div
            className={`space-y-6 ${reverse ? "md:order-1" : "md:order-2"}`}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Category
            </div>

            <h2
              id={`category-${localizeField(category, "name", language)}`}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-primary leading-tight"
            >
              {localizeField(category, "name", language)}
            </h2>

            {localizeField(category, "description", language) && (
              <p className="text-lg md:text-xl leading-relaxed text-secondary max-w-prose">
                {localizeField(category, "description", language)}
              </p>
            )}

            {/* Decorative Element */}
            <div className="flex items-center gap-3 pt-4">
              <div className="h-1 w-16 bg-accent rounded-full" />
              <div className="h-1 w-8 bg-accent/50 rounded-full" />
              <div className="h-1 w-4 bg-accent/25 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
