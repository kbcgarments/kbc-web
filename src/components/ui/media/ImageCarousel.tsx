"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/types";

interface Props {
  images: ProductImage[];
  height?: number; // optional override
}

export default function ImageCarousel({ images, height = 320 }: Props) {
  const [index, setIndex] = useState(0);

  // Touch references
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  if (!images || images.length === 0) return null;
  const total = images.length;

  // ---------- HANDLE TOUCH ----------
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const diff = currentX.current - startX.current;

    if (diff > 50 && index > 0) {
      setIndex(index - 1); // swipe right → previous
    } else if (diff < -50 && index < total - 1) {
      setIndex(index + 1); // swipe left → next
    }

    isDragging.current = false;
    startX.current = 0;
    currentX.current = 0;
  };

  // ---------- BUTTON NAV ----------
  const next = () => index < total - 1 && setIndex(index + 1);
  const prev = () => index > 0 && setIndex(index - 1);

  return (
    <div className="relative w-full bg-primary rounded-xl overflow-hidden select-none">
      {/* IMAGE WRAPPER */}
      <div
        className="flex transition-transform duration-300"
        style={{
          transform: `translateX(-${index * 100}%)`,
          height,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div key={img.id} className="min-w-full relative">
            <Image
              src={img.url}
              alt={img.url}
              fill
              className="object-cover rounded-xl"
              sizes="60vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {/* ONLY SHOW ARROWS IF > 1 IMAGE */}
      {total > 1 && (
        <>
          {/* PREV */}
          <button
            title="Previous image"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 
                       bg-white/80 dark:bg-black/40 backdrop-blur-sm
                       p-2 rounded-full shadow hover:bg-white transition"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          {/* NEXT */}
          <button
            title="Next image"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       bg-white/80 dark:bg-black/40 backdrop-blur-sm
                       p-2 rounded-full shadow hover:bg-white transition"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </>
      )}
      {/* IMAGE COUNTER */}
      {total > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2
                 bg-black/60 text-white px-3 py-1 rounded-full text-xs"
        >
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
}
