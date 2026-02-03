"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, XCircle, Loader, Sparkles } from "lucide-react";

import { useListCustomerFeedback, useReviewFeedback } from "@/hooks";

import PromoteModal from "./PromoteModal";
import { CustomerFeedbackAdmin, FeedbackStatus } from "@/types/";

type FilterStatus = "ALL" | FeedbackStatus;

export default function FeedbackReview() {
  const { data: feedbackList = [], isLoading } = useListCustomerFeedback();
  const reviewFeedback = useReviewFeedback();

  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [promotingFeedback, setPromotingFeedback] =
    useState<CustomerFeedbackAdmin | null>(null);

  const handleApprove = (id: string) => {
    reviewFeedback.mutate({ feedbackId: id, status: FeedbackStatus.APPROVED });
  };

  const handleReject = (id: string) => {
    if (confirm("Are you sure you want to reject this feedback?")) {
      reviewFeedback.mutate({
        feedbackId: id,
        status: FeedbackStatus.REJECTED,
      });
    }
  };

  const filteredFeedback = feedbackList.filter((f) =>
    filter === "ALL" ? true : f.status === filter,
  );

  const statusCounts: Record<FilterStatus, number> = {
    ALL: feedbackList.length,
    PENDING: feedbackList.filter((f) => f.status === FeedbackStatus.PENDING)
      .length,
    APPROVED: feedbackList.filter((f) => f.status === FeedbackStatus.APPROVED)
      .length,
    REJECTED: feedbackList.filter((f) => f.status === FeedbackStatus.REJECTED)
      .length,
    PROMOTED: feedbackList.filter((f) => f.status === FeedbackStatus.PROMOTED)
      .length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Customer Feedback</h2>
        <p className="text-sm text-secondary mt-1">
          Review customer feedback and promote to testimonials
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(
          [
            "ALL",
            "PENDING",
            "APPROVED",
            "REJECTED",
            "PROMOTED",
          ] as FilterStatus[]
        ).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
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
            {statusCounts[status] > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary/30">
                {statusCounts[status]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 border border-primary/10 rounded-xl">
          <Star className="w-10 h-10 mx-auto mb-4 text-accent" />
          <h3 className="text-lg font-semibold text-primary">
            No feedback found
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedback.map((feedback, index) => {
            const displayName =
              feedback.order?.shippingFullName || feedback?.order?.email;

            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-secondary/20 border border-primary/10 rounded-xl p-5"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (feedback.rating ?? 0)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-tertiary"
                      }`}
                    />
                  ))}
                </div>

                {/* Meta */}
                <p className="text-sm text-secondary mb-2">
                  <strong>{displayName}</strong> • Order #
                  {feedback.order.orderNumber} •{" "}
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>

                {/* Message */}
                <p className="text-primary mb-4">
                  &quot;{feedback.message}&quot;
                </p>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {feedback.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(feedback.id)}
                        className="btn-success"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(feedback.id)}
                        className="btn-danger"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}

                  {feedback.status === "APPROVED" && (
                    <button
                      onClick={() => setPromotingFeedback(feedback)}
                      className="btn-purple"
                    >
                      <Sparkles className="w-4 h-4" />
                      Promote to Testimonial
                    </button>
                  )}

                  {feedback.status === "PROMOTED" && (
                    <span className="btn-muted">
                      <Sparkles className="w-4 h-4" />
                      Testimonial Created
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Promote Modal */}
      <AnimatePresence>
        {promotingFeedback && (
          <PromoteModal
            feedback={promotingFeedback}
            onClose={() => setPromotingFeedback(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
