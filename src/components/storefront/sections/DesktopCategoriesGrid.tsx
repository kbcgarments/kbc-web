// components/storefront/sections/DesktopCategoryGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Easing, motion, Variants } from "framer-motion";
import { AnimatedButton } from "@/components/ui/buttons/AnimatedButton";
import { localizeField } from "@/utils";
import { Category, Language } from "@/types";

interface DesktopCategoryGridProps {
  categories: Category[];
  language: Language;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80";

export function DesktopCategoryGrid({
  categories,
  language,
}: DesktopCategoryGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as Easing },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-3 gap-6"
    >
      {/* ROW 1 */}
      {categories[0] && (
        <GridCard
          category={categories[0]}
          variants={itemVariants}
          className="col-span-2 h-100"
          language={language}
        />
      )}

      {categories[1] && (
        <GridCard
          category={categories[1]}
          variants={itemVariants}
          className="h-100"
          language={language}
        />
      )}

      {categories[2] && (
        <GridCard
          category={categories[2]}
          variants={itemVariants}
          className="h-100"
          language={language}
        />
      )}

      {/* ROW 2 */}
      {categories[3] && (
        <GridCard
          category={categories[3]}
          variants={itemVariants}
          className="h-100"
          language={language}
        />
      )}

      {categories[4] && (
        <GridCard
          category={categories[4]}
          variants={itemVariants}
          className="h-100"
          language={language}
        />
      )}

      {categories[5] && (
        <GridCard
          category={categories[5]}
          variants={itemVariants}
          className="col-span-2 h-100"
          language={language}
        />
      )}

      {categories[6] && (
        <GridCard
          category={categories[6]}
          variants={itemVariants}
          className="h-100"
          language={language}
        />
      )}
    </motion.div>
  );
}

interface GridCardProps {
  category: Category;
  variants: Variants;
  className: string;
  language: Language;
}

function GridCard({ category, variants, className, language }: GridCardProps) {
  return (
    <motion.div variants={variants} className={className}>
      <Link
        href={`/collections/${category.slug}`}
        className="
          relative block w-full h-full
          rounded-2xl overflow-hidden
          shadow-lg hover:shadow-2xl
          transition-all duration-500 ease-out
          group
        "
      >
        <Image
          src={category.imageUrl || FALLBACK_IMAGE}
          alt=""
          role="presentation"
          fill
          loading="lazy"
          sizes="
            (min-width: 1280px) 33vw,
            (min-width: 1024px) 33vw,
            (min-width: 768px) 50vw,
            100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <AnimatedButton size="md" variant="ghost">
            {localizeField(category, "name", language)}
          </AnimatedButton>
        </div>
      </Link>
    </motion.div>
  );
}
