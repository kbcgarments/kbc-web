"use client";

import Image from "next/image";
import { Category } from "@/types";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";

interface Props {
  category: Category;
}

export default function CollectionBanner({ category }: Props) {
  const { language } = useLanguageStore();

  const title = localizeField(category, "name", language);
  const desc = localizeField(category, "description", language);

  return (
    <div className="relative w-full h-60 md:h-85 overflow-hidden rounded-2xl">
      <Image
        src={category.imageUrl || "/placeholders/collection.png"}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover brightness-[0.75]"
      />
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl font-display text-white font-bold mb-3">
          {title}
        </h1>

        {desc && (
          <p className="text-white/80 max-w-xl text-sm md:text-base">{desc}</p>
        )}
      </div>
    </div>
  );
}
