"use client";

import Image from "next/image";
import { Category } from "@/types";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";

interface Props {
  category: Category | null;
}

export default function CollectionHeroBanner({ category }: Props) {
  const { language, translate } = useLanguageStore();

  if (category?.imageUrl) {
    const title = localizeField(category, "name", language);
    const desc = localizeField(category, "description", language);

    return (
      <div className="relative w-full h-65 md:h-85 overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 max-w-7xl mx-auto">
          <h1 className="text-white text-4xl md:text-5xl font-display font-bold mb-2 drop-shadow-lg text-center">
            {title}
          </h1>

          {desc && (
            <p className="text-white/80 max-w-xl text-sm md:text-base drop-shadow text-center">
              {desc}
            </p>
          )}
        </div>
      </div>
    );
  }

  // CASE 2: No category OR no image → fallback hero
  const fallbackTitle = category
    ? localizeField(category, "name", language)
    : translate("collections.hero.allCollections");

  return (
    <div className="w-full flex flex-col items-center justify-center bg-secondary dark:bg-sand-800 py-16 md:py-24 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
          {fallbackTitle}
        </h1>

        {!category && (
          <p className="mt-3 text-secondary dark:text-sand-300 max-w-xl text-sm md:text-base">
            {translate("collections.hero.fallbackDescription")}
          </p>
        )}
      </div>
    </div>
  );
}
