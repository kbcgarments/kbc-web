"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores";
import type { BannerPublic } from "@/types";
import { localizeField } from "@/utils";

interface BannerProps {
  banner: BannerPublic;
  priority?: boolean;
  className?: string;
}

export default function Banner({
  banner,
  priority = false,
  className = "",
}: BannerProps) {
  const { language } = useLanguageStore();
  const title = localizeField(banner, "title", language);
  const description = localizeField(banner, "description", language);
  const ctaText = localizeField(banner, "ctaText", language);

  const hasContent = title || description || ctaText;
  const hasLink = banner.ctaLink;

  const content = (
    <div
      className={`relative w-full aspect-video sm:aspect-21/9 overflow-hidden rounded-lg sm:rounded-xl ${className}`}
    >
      {/* Background Image */}
      <Image
        src={banner.imageUrl}
        alt={title || "Promotional banner"}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
        quality={70}
        sizes="
          (max-width: 640px) calc(100vw - 1.5rem),
          (max-width: 1024px) calc(100vw - 3rem),
          1200px
        "
      />

      {/* Gradient Overlay */}
      {hasContent && (
        <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/70 via-black/40 sm:via-black/30 to-transparent" />
      )}

      {/* Content Overlay */}
      {hasContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute inset-0 flex items-end sm:items-center"
        >
          <div className="w-full px-4 pb-6 sm:px-6 sm:pb-0 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="max-w-xl space-y-3 sm:space-y-4">
              {/* Title */}
              {title && (
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                >
                  {title}
                </motion.h2>
              )}

              {/* Description */}
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed line-clamp-2 sm:line-clamp-3"
                >
                  {description}
                </motion.p>
              )}

              {/* CTA Button */}
              {ctaText && hasLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="pt-1 sm:pt-2"
                >
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-accent text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-accent-dark active:bg-accent-dark transition-all shadow-lg hover:shadow-xl active:scale-95 group touch-manipulation">
                    {ctaText}
                    <ArrowRight
                      className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2.5}
                    />
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Wrap in Link if ctaLink exists
  if (hasLink) {
    return (
      <Link
        href={banner.ctaLink!}
        className="block group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg sm:rounded-xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}
