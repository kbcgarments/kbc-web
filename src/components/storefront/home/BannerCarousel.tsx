"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Banner from "./Banner";
import { BannerPublic } from "@/types";

interface BannerCarouselProps {
  banners: BannerPublic[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset autoplay timer
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (autoPlay && banners.length > 1 && !document.hidden) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, goToNext, banners.length]);

  // Handle swipe gestures
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 50;
    const { offset, velocity } = info;

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        goToPrev();
      } else {
        goToNext();
      }
      resetAutoPlay();
    }
  };

  // Auto-play with visibility API
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      } else {
        resetAutoPlay();
      }
    };

    resetAutoPlay();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoPlay, banners.length, resetAutoPlay]);

  if (!banners || banners.length === 0) return null;

  if (banners.length === 1) {
    return (
      <section className={`py-6 sm:py-8 md:py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Banner banner={banners[0]} priority />
        </div>
      </section>
    );
  }

  return (
    <section className={`py-6 sm:py-8 md:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-xl touch-pan-y">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing select-none"
              >
                <Banner
                  banner={banners[currentIndex]}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-6 z-10">
            {banners.map((_, index: number) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index);
                  resetAutoPlay();
                }}
                className={`
                  h-2 rounded-full transition-all duration-300 touch-manipulation
                  ${
                    index === currentIndex
                      ? "w-6 sm:w-8 bg-accent"
                      : "w-2 bg-white/60 hover:bg-white/80"
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
