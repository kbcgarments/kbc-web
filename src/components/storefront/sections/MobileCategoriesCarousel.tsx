"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { localizeField } from "@/utils";
import { Category, Language } from "@/types";

interface MobileCategoriesCarouselProps {
  categories: Category[];
  language: Language;
}

const CARD_WIDTH = 140;
const GAP = 16;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935-763728e1935b?w=800&q=80";

export function MobileCategoriesCarousel({
  categories,
  language,
}: MobileCategoriesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(2);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* -------------------------------
   * CALCULATE CARDS PER VIEW
   * ----------------------------- */
  useEffect(() => {
    const updateVisibleCards = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      const cardsFit = Math.floor(width / (CARD_WIDTH + GAP));

      setVisibleCards(Math.max(1, Math.min(cardsFit, 3)));
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  /* -------------------------------
   * LIMITS
   * ----------------------------- */
  const maxIndex = Math.max(0, categories.length - visibleCards);

  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  /* -------------------------------
   * TOUCH SWIPE
   * ----------------------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (diff > threshold) handleNext();
    else if (diff < -threshold) handlePrevious();
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex gap-4"
          animate={{
            x: -(currentIndex * (CARD_WIDTH + GAP)),
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="shrink-0"
              style={{ width: CARD_WIDTH }}
              initial={{ opacity: 0.7, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <CategoryCircle category={category} language={language} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-6 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${
                index === currentIndex
                  ? "w-6 bg-(--color-text-accent)"
                  : "w-2 bg-(--color-text-secondary)"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------
 * CATEGORY CIRCLE — unchanged
 * ----------------------------- */
function CategoryCircle({
  category,
  language,
}: {
  category: Category;
  language: Language;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/collections/${category.slug}`}
      className="flex flex-col items-center gap-3 group"
    >
      <div
        className="
          relative w-36 h-36 rounded-full overflow-hidden
          bg-sand-100 dark:bg-sand-800
          shadow-lg group-hover:shadow-xl
          transition-all duration-300 group-hover:scale-105
        "
      >
        <Image
          src={category.imageUrl || FALLBACK_IMAGE}
          alt=""
          role="presentation"
          fill
          sizes="140px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>
      <p className="text-sm font-semibold text-center text-sand-900 dark:text-sand-50 max-w-30 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-light">
        {localizeField(category, "name", language)}
      </p>
    </Link>
  );
}
