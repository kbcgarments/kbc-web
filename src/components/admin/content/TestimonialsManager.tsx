"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader, Power } from "lucide-react";

import { useListTestimonials, useToggleTestimonial } from "@/hooks";
import type { TestimonialAdmin } from "@/types";

type FilterType = "ALL" | "ACTIVE" | "INACTIVE";

export default function TestimonialsManager() {
  const { data: testimonials = [], isLoading } = useListTestimonials();
  const toggleTestimonial = useToggleTestimonial();

  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "ACTIVE") return t.isActive;
    if (filter === "INACTIVE") return !t.isActive;
    return true;
  });

  const counts = {
    ALL: testimonials.length,
    ACTIVE: testimonials.filter((t) => t.isActive).length,
    INACTIVE: testimonials.filter((t) => !t.isActive).length,
  };

  const handleToggle = (testimonial: TestimonialAdmin) => {
    toggleTestimonial.mutate({
      id: testimonial.id,
      isActive: !testimonial.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Testimonials</h2>
        <p className="mt-1 text-sm text-secondary">
          Manage customer testimonials displayed on the homepage
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              rounded-lg px-4 py-2 text-sm font-medium transition-all
              ${
                filter === status
                  ? "bg-accent text-white"
                  : "bg-secondary/20 text-secondary hover:bg-secondary/30"
              }
            `}
          >
            {status === "ALL"
              ? "All"
              : status.charAt(0) + status.slice(1).toLowerCase()}
            <span
              className={`
                ml-2 rounded-full px-2 py-0.5 text-xs font-semibold
                ${filter === status ? "bg-white/20" : "bg-secondary/30"}
              `}
            >
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 ? (
        <div className="rounded-xl border border-primary/10 bg-secondary/20 py-20 text-center">
          <Star className="mx-auto mb-4 h-8 w-8 text-accent" />
          <h3 className="mb-2 text-lg font-semibold text-primary">
            No testimonials found
          </h3>
          <p className="text-sm text-secondary">
            Promote approved customer feedback to create testimonials
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border p-5 transition-all ${
                testimonial.isActive
                  ? "border-primary/10 bg-secondary/20"
                  : "border-primary/5 bg-secondary/10 opacity-60"
              }`}
            >
              {/* Rating */}
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      testimonial.rating != null && i < testimonial.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-tertiary"
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              {/* Quote (English only – admin rule) */}
              <p className="mb-4 line-clamp-4 text-sm italic leading-relaxed text-primary">
                “{testimonial.quote_en}”
              </p>

              {/* Customer */}
              <p className="mb-4 text-sm font-semibold text-secondary">
                — {testimonial.customerName}
              </p>

              {/* Status */}
              <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    testimonial.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-secondary/30 text-tertiary"
                  }`}
                >
                  {testimonial.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(testimonial)}
                disabled={toggleTestimonial.isPending}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 ${
                  testimonial.isActive
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                }`}
              >
                {toggleTestimonial.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
                {testimonial.isActive ? "Deactivate" : "Activate"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
