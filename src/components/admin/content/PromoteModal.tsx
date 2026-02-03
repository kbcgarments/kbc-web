"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader, Star, Sparkles } from "lucide-react";

import { usePromoteFeedbackToTestimonial } from "@/hooks/";
import type { CustomerFeedbackAdmin } from "@/types/";

interface PromoteModalProps {
  feedback: CustomerFeedbackAdmin;
  onClose: () => void;
}

export default function PromoteModal({ feedback, onClose }: PromoteModalProps) {
  const promoteToTestimonial = usePromoteFeedbackToTestimonial();

  const [customerName, setCustomerName] = useState(
    feedback.order?.shippingFullName || feedback.order?.email || "",
  );

  const isLoading = promoteToTestimonial.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) return;

    await promoteToTestimonial.mutateAsync({
      feedbackId: feedback.id,
      customerName: customerName.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-primary rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="border-b border-primary/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              Promote to Testimonial
            </h2>
          </div>

          <button
            title="Close"
            onClick={onClose}
            className="p-2 hover:bg-secondary/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preview */}
          <div className="bg-secondary/20 border border-primary/10 rounded-xl p-5">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (feedback.rating ?? 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-tertiary"
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-primary italic leading-relaxed mb-4">
              “{feedback.message}”
            </p>

            {/* Meta */}
            {feedback.order && (
              <div className="text-xs text-tertiary flex gap-2">
                <span>Order #{feedback.order.orderNumber}</span>
                <span>•</span>
                <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
              Customer Display Name *
            </label>
            <input
              title="Enter customer name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-secondary/20 border border-primary/20 rounded-lg"
            />
            <p className="text-xs text-tertiary mt-2">
              This name will be shown publicly with the testimonial.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-primary/20 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !customerName.trim()}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Promoting…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Promote
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
