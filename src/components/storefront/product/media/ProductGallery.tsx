"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";

type ProductGalleryProps = {
  images: ProductImage[];
  index: number;
  onIndexChange: (index: number) => void;
};

export default function ProductGallery({
  images,
  index,
  onIndexChange,
}: ProductGalleryProps) {
  const [direction, setDirection] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const next = () => {
    if (index < images.length - 1) {
      setDirection(1);
      onIndexChange(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      onIndexChange(index - 1);
    }
  };

  // Desktop: Mouse move for zoom effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Mobile: Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      next();
    } else if (diff < -threshold) {
      prev();
    }
  };

  // Swipe animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* DESKTOP: Vertical Thumbnails (Left Side) */}
      <div className="hidden lg:flex flex-col gap-3 w-24 shrink-0">
        {images.map((img, i) => (
          <button
            title="Product Image"
            key={img.id}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              onIndexChange(i);
            }}
            className={`
              relative h-28 w-full rounded-xl overflow-hidden
              transition-all duration-300
              ${
                i === index
                  ? "border-3 border-accent scale-105 shadow-md"
                  : "border border-primary/20 opacity-60 hover:opacity-100 hover:scale-105"
              }
            `}
          >
            <Image
              src={img.url}
              alt={`Product ${i + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
      {/* MAIN IMAGE AREA */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Large Image Container */}
        <div
          ref={imageRef}
          className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-secondary border border-primary/10 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current Image with Swipe Animation */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Image
                src={images[index].url}
                alt={`Product view ${index + 1}`}
                fill
                priority
                className={`
                  object-cover transition-transform duration-500
                  ${isHovered ? "scale-150 cursor-zoom-in" : "scale-100"}
                `}
                style={
                  isHovered
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : undefined
                }
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div
            className={`
              absolute inset-0 flex items-center justify-between px-4
              transition-opacity duration-300
              ${isHovered || images.length > 1 ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <button
              onClick={prev}
              disabled={index === 0}
              className={`
                p-2.5 lg:p-3 rounded-full
                bg-primary/90 backdrop-blur-sm border border-primary/20
                shadow-lg
                transition-all duration-300
                hover:scale-110 hover:bg-primary active:scale-95
                disabled:opacity-0 disabled:pointer-events-none
              `}
              aria-label="Previous image"
            >
              <ChevronLeft
                className="w-5 h-5 lg:w-6 lg:h-6 text-primary"
                strokeWidth={2}
              />
            </button>

            <button
              onClick={next}
              disabled={index === images.length - 1}
              className={`
                p-2.5 lg:p-3 rounded-full
                bg-primary/90 backdrop-blur-sm border border-primary/20
                shadow-lg
                transition-all duration-300
                hover:scale-110 hover:bg-primary active:scale-95
                disabled:opacity-0 disabled:pointer-events-none
              `}
              aria-label="Next image"
            >
              <ChevronRight
                className="w-5 h-5 lg:w-6 lg:h-6 text-primary"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary/90 backdrop-blur-sm border border-primary/20 rounded-full shadow-lg">
            <span className="text-xs font-semibold text-primary tabular-nums">
              {index + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* MOBILE: Horizontal Thumbnails (Bottom) */}
        <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide p-2">
          {images.map((img, i) => (
            <button
              title="Product Image"
              key={img.id}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                onIndexChange(i);
              }}
              className={`
                relative w-20 h-24 shrink-0 rounded-lg overflow-hidden
                transition-all duration-300
                ${
                  i === index
                    ? "border-2 border-accent scale-105 shadow-md"
                    : "border border-primary/20 opacity-60 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
