"use client";

import Image from "next/image";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroPublic } from "@/types";

export default function HeroSection({
  hero,
  isLoading,
}: {
  hero: HeroPublic | null;
  isLoading: boolean;
}) {
  const { language } = useLanguageStore();

  if (isLoading) {
    return (
      <section className="min-w-full bg-primary">
        <div className="min-w-full mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 gap-6">
            {[...Array(1)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-100 bg-secondary rounded-xl mb-4" />
                <div className="w-full h-4 bg-secondary rounded mb-2" />
                <div className="w-full h-4 bg-secondary rounded " />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-screen h-[80vh] overflow-hidden">
      {/* Background image — OPTIMIZED */}
      <Image
        src={hero?.imageUrl || "/assets/placeholder.jpg"}
        alt="KBC Universe Collection"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        className="object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/50" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              {localizeField(hero, "headline", language)}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-md">
              {localizeField(hero, "subheadline", language)}
            </p>

            {hero?.ctaText_en && hero.ctaLink && (
              <Link
                href={hero.ctaLink}
                className="inline-flex items-center justify-center gap-2
                       bg-accent text-white font-semibold
                       rounded-lg px-6 py-3 mt-6
                       hover:bg-accent-dark transition"
              >
                {localizeField(hero, "ctaText", language)}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
