"use client";
import { useMemo } from "react";
import { getLucideIcon } from "@/lib";
import { useLanguageStore } from "@/stores";
import { localizeField } from "@/utils";
import { WhyChooseUsPublic } from "@/types";

export default function WhyChooseUsSection({
  whyChooseUs,
  isLoading,
}: {
  whyChooseUs?: WhyChooseUsPublic[];
  isLoading: boolean;
}) {
  const { language } = useLanguageStore();
  const features = useMemo(() => {
    return Array.isArray(whyChooseUs) ? whyChooseUs.slice(0, 6) : [];
  }, [whyChooseUs]);

  if (isLoading) {
    return (
      <section className="py-8  bg-brown">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="max-h-30 h-30 bg-secondary rounded-xl mb-4" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brown py-8">
      <div className="max-w-8xl mx-auto px-6 md:px-12">
        {/* Features Bar - Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = getLucideIcon(feature.icon);

            return (
              <div key={feature.id} className="flex items-start gap-4 group">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1 tracking-wider">
                    {localizeField(feature, "title", language)}
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {localizeField(feature, "description", language)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
