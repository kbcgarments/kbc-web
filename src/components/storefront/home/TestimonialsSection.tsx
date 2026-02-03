"use client";

import { Star, Quote } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { SectionHeader } from "@/components/ui/layout/SectionHeader";
import { useMemo } from "react";
import { localizeField } from "@/utils";
import { TestimonialPublic } from "@/types";

export default function TestimonialsSection({
  testimonials,
  isLoading,
}: {
  testimonials: TestimonialPublic[];
  isLoading: boolean;
}) {
  const { translate, language } = useLanguageStore();

  const testimonialsMemo = useMemo(() => {
    return Array.isArray(testimonials) ? testimonials.slice(0, 6) : [];
  }, [testimonials]);
  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            title={translate("sections.testimonials.title")}
            subtitle={translate("sections.testimonials.description")}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="max-h-50 h-50  bg-secondary rounded-xl mb-4" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonialsMemo.length) return null;
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader
          title={translate("sections.testimonials.title")}
          subtitle={translate("sections.testimonials.description")}
        />

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsMemo.map((testimonial) => {
            const initials = testimonial.customerName
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .toUpperCase();

            const productTitle = localizeField(
              testimonial,
              "productTitle",
              language,
            );

            return (
              <div
                key={testimonial.id}
                className="bg-secondary rounded-2xl p-8 relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-accent" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-primary leading-relaxed mb-6 text-base">
                  {testimonial.quote}
                </p>

                {/* Product Purchased */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-xs font-semibold text-accent mb-6">
                  {translate("common.purchased")}: {productTitle}
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-6 border-t border-primary">
                  {/* Initials Avatar */}
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {initials}
                  </div>

                  <div>
                    <p className="font-semibold text-primary">
                      {testimonial.customerName}
                    </p>
                    <p className="text-sm text-secondary">{productTitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
